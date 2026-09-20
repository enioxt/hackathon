#!/usr/bin/env python3
"""Saneia referências de ambiente interno antes de publicar (determinístico, idempotente).

uso: sanear-publico.py <fontes-verificadas.json> <regras-de-cruzamento-de-dados.md>
Sai 1 se, depois de sanear, algum padrão proibido ainda aparece.
"""
import json, re, sys

PROIBIDO = re.compile(
    r"/tmp/claude-1000|/home/enio|CLAUDE\.md|AGENTS\.md|ForjaEye|\.egos/|motor de análise|"
    r"eagle-eye|kernel|intelink|monitor-transito\.ts|INDICE_FONTES_DADOS", re.I)
STUB = ("Item interno do time, fora deste repositório público. "
        "As fontes públicas que ele consulta estão listadas em entradas próprias.")
NOMES = {  # índice -> nome público da entrada
    76: "Acervo local do time com dados abertos já baixados (não é fonte pública; as fontes têm entrada própria)",
    77: "Fontes geográficas públicas offline (OSM Geofabrik · IBGE CNEFE · Overpass)",
    78: "Ferramenta interna do time — monitor de trânsito (não é fonte pública)",
    80: "Ferramenta interna do time — radar de licitações (consulta o PNCP, que é público)",
    81: "Relatório interno do time sobre acervo de mobilidade (relata fontes públicas)",
    82: "Ferramenta interna do time — consulta de transparência (não é fonte pública)",
}
CURTOS = {"acesso", "classificacao", "sobrevive", "valor", "formato", "granularidade", "angulo", "dono"}


def limpa(v):
    if isinstance(v, str):
        return v.replace("", "").replace(", sem envolver dado sensível", ", sem envolver dado sensível")
    if isinstance(v, list):
        return [limpa(x) for x in v]
    if isinstance(v, dict):
        return {k: limpa(x) for k, x in v.items()}
    return v


def stub(v):
    if isinstance(v, str):
        return STUB if PROIBIDO.search(v) else v
    if isinstance(v, list):
        out = [x for x in (stub(x) for x in v)]
        vistos, dedup = set(), []
        for x in out:
            chave = json.dumps(x, ensure_ascii=False, sort_keys=True)
            if chave not in vistos:
                vistos.add(chave); dedup.append(x)
        return dedup
    if isinstance(v, dict):
        return {k: stub(x) for k, x in v.items()}
    return v


def tudo_stub(v):
    """Entrada interna: todo texto longo vira o aviso, sem depender de padrão."""
    if isinstance(v, str):
        return STUB
    if isinstance(v, list):
        return [STUB] if v and all(isinstance(x, str) for x in v) else []
    if isinstance(v, dict):
        return {k: (x if isinstance(x, (bool, int, float)) or x is None else tudo_stub(x)) for k, x in v.items()}
    return v


def sanear_json(path):
    dados = sanear_itens(json.load(open(path, encoding="utf-8")))
    open(path, "w", encoding="utf-8").write(json.dumps(dados, ensure_ascii=False, indent=1) + "\n")
    return len(dados)


def sanear_itens(dados):
    n_antes = len(dados)
    dados = limpa(dados)
    for i, nome in NOMES.items():
        e = dados[i]
        e["fonte"] = nome
        if i != 77:
            e["url"] = "—"
        for k in list(e):
            if k in ("fonte", "url"):
                continue
            e[k] = stub(e[k]) if k in CURTOS else tudo_stub(e[k])
            if k in CURTOS and isinstance(e[k], str) and e[k] == STUB:
                e[k] = "NAO-EXISTE (ferramenta interna do time, não é fonte pública)" if k == "acesso" else "INTERNO"
    assert len(dados) == n_antes
    return dados


INTERNO_LACUNA = re.compile(PROIBIDO.pattern + r"|SSOT|policial|/transparencia|disco desta máquina|disco local", re.I)


def sanear_lacunas_dado(d):
    return _anda(limpa(d))


def _anda(v):
    if True:
        if isinstance(v, str):
            return re.sub(r"o path usado no (motor de análise|intelink) deu 404", "o caminho antigo deu 404", v)
        if isinstance(v, list):
            return [_anda(x) for x in v if not (isinstance(x, str) and INTERNO_LACUNA.search(x))]
        if isinstance(v, dict):
            return {k: _anda(x) for k, x in v.items()}
        return v


def sanear_lacunas(path):
    d = sanear_lacunas_dado(json.load(open(path, encoding="utf-8")))
    open(path, "w", encoding="utf-8").write(json.dumps(d, ensure_ascii=False, indent=1) + "\n")


CITA = re.compile(r"\s+—\s+(?:princípio de\s+)?(?:R-[A-Z0-9-]+|R\d+\S*|mesma regra|`AGENTS|`motor|L0-|P\d\b)[^\n]*$")


def sanear_md(path):
    linhas = open(path, encoding="utf-8").read().split("\n")
    while linhas and not linhas[0].startswith("# "):
        linhas.pop(0)
    out = []
    for l in linhas:
        if l.startswith("Regras colhidas de"):
            l = ("Regras de método que o time usa ao cruzar duas bases de dados. "
                 "Cada item nasceu de um erro real já cometido; aqui vai só o método, nenhum dado.")
        elif l.startswith("— ") and CITA.search(" " + l):
            continue
        else:
            l = CITA.sub("", l)
        out.append(l)
    open(path, "w", encoding="utf-8").write("\n".join(out))


ANDAIME_LINHA = re.compile(
    r"^#*\s*INVESTIGADOR REPORT|^={10,}\s*$|^\**(TIPO|DADO):|^\**Exige HITL|^\**Pendente para o Prime|^\**PENDENTE PARA O PRIME", re.I)
ANDAIME_SECAO = re.compile(r"^##\s+(GATE NECESS|PENDENTE PARA O PRIME)", re.I)
TROCAS = [
    (re.compile(r"^# GUARDIÃO VERDICT — "), "# Análise jurídica — "),
    (re.compile(r", sem envolver dado sensível"), ", sem envolver dado sensível"),
    (re.compile(r"/\* IMPRESSAO / PDF — R-PDF-INTEIRO-001 \(corte Enio[^)]*\)\."), "/* IMPRESSAO / PDF."),
    (re.compile(r"\s*\]*\)"), ""),
    (re.compile(r"assistente de código, com várias buscas em paralelo"), "assistente de código, com várias buscas em paralelo"),
    (re.compile(r"é zona sensível de segurança pública operacional"), "é zona sensível de segurança pública operacional"),
    (re.compile(r"; nenhum grafo/hash local aplicável \([^)]*\)"), ""),
]
RESTO_GERAL = re.compile(PROIBIDO.pattern + r"|Red Zone|HITL|\bPrime\b|PRIME\b|INVESTIGADOR REPORT|Guardião|corte Enio|53\.601|Neo4j|Cypher|SSOT", re.I)


def sanear_texto(txt):
    out, pulando = [], False
    for l in txt.split("\n"):
        if ANDAIME_SECAO.search(l):
            pulando = True; continue
        if pulando and (l.startswith("## ") or l.startswith("# ")):
            pulando = False
        if pulando or ANDAIME_LINHA.search(l):
            continue
        for rx, novo in TROCAS:
            l = rx.sub(novo, l)
        out.append(l)
    return re.sub(r"\n(---\n\s*){2,}", "\n---\n", "\n".join(out)).replace("", "")


def sanear_andaime(path):
    txt = open(path, encoding="utf-8").read()
    novo = sanear_texto(txt)
    if novo != txt:
        open(path, "w", encoding="utf-8").write(novo)


if __name__ == "__main__":
    import os, subprocess
    raiz = sys.argv[1]
    os.chdir(raiz)
    arqs = subprocess.check_output(["git", "ls-files"], text=True).split("\n")
    acha = lambda nome: next(a for a in arqs if a.endswith(nome))
    j, m = acha("fontes-verificadas.json"), acha("regras-de-cruzamento-de-dados.md")
    lac = [a for a in arqs if a.endswith(("lacunas-declaradas.json", "lacunas-do-critico.json"))]
    n = sanear_json(j)
    sanear_md(m)
    for x in lac:
        sanear_lacunas(x)
    texto = [a for a in arqs if a.endswith((".md", ".html", ".css", ".py")) and a != m]
    for a in texto:
        sanear_andaime(a)
    resto = 0
    for a in arqs:
        if not a or not a.endswith((".md", ".html", ".css", ".py", ".json", ".ts", ".sh", ".txt")):
            continue
        rx = INTERNO_LACUNA if a in lac else RESTO_GERAL
        for i, l in enumerate(open(a, encoding="utf-8", errors="replace"), 1):
            if rx.search(l):
                resto += 1
                print(f"RESTA {a}:{i}: {l.strip()[:150]}")
    print(f"entradas no JSON: {n} · arquivos varridos: {len([a for a in arqs if a])} · padrões restantes: {resto}")
    sys.exit(1 if resto else 0)
