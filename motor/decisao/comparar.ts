// Compara os motores nos mesmos cenários rotulados. Uso: JEV_KEY=... bun comparar.ts
import { decidir } from "./decisao.ts"; import { contratoEvento, motorRegras } from "./evento-de-transito.ts"; import { criarMotorJev, usoJev } from "./motor-jev.ts"; import { writeFileSync } from "node:fs";
type C = { rotulo: "fila_anormal" | "veiculo_parado" | "contramao" | "nada" | "duvidoso"; e: Record<string, number> };
const c = (rotulo: C["rotulo"], fila: number, hab: number, parado: number, fluxo: number, oposto: number): C => ({ rotulo, e: { fila_m: fila, fila_habitual_m: hab, maior_tempo_parado_s: parado, veiculos_por_min: fluxo, cruzamentos_sentido_oposto: oposto } });
// rótulos escritos ANTES de rodar qualquer motor; "duvidoso" = o certo é abster-se
const casos: C[] = [ c("nada",12,14,8,11,0), c("nada",20,18,15,9,0), c("nada",5,6,4,14,0), c("nada",30,28,22,8,0), c("nada",16,15,30,10,0), c("nada",9,10,12,6,0),
  c("fila_anormal",64,15,20,9,0), c("fila_anormal",90,20,35,7,0), c("fila_anormal",48,12,18,10,0), c("fila_anormal",120,30,40,5,0), c("fila_anormal",55,14,25,8,0), c("fila_anormal",70,18,28,6,0),
  c("veiculo_parado",16,15,170,10,0), c("veiculo_parado",14,14,240,12,0), c("veiculo_parado",22,18,300,9,0), c("veiculo_parado",10,12,150,11,0), c("veiculo_parado",18,16,420,8,0),
  c("contramao",12,14,8,11,1), c("contramao",20,18,10,9,2), c("contramao",15,15,12,7,1), c("contramao",25,20,18,10,3),
  c("duvidoso",25,15,50,6,0), c("duvidoso",28,18,65,5,0), c("duvidoso",24,14,58,7,0) ];
async function rodar(nome: string, motor: Parameters<typeof decidir>[2]) { let certo = 0, abst = 0, errado = 0; const erros: string[] = []; const t0 = performance.now();
  for (const k of casos) { const r = (await decidir(contratoEvento, k.e, motor)).respostas.o_que_e; if (k.rotulo === "duvidoso") { if (r.abstencao) { certo++; abst++; } else { errado++; erros.push(`duvidoso→${r.escolhida} (${r.confianca})`); } } else if (r.abstencao) { abst++; erros.push(`${k.rotulo}→não sei`); } else if (r.escolhida === k.rotulo) certo++; else { errado++; erros.push(`${k.rotulo}→${r.escolhida}`); } }
  return { motor: nome, casos: casos.length, certos: certo, errados: errado, abstencoes: abst, ms_total: Math.round(performance.now() - t0), erros }; }
const regras = await rodar("regras-v1", motorRegras), jev = await rodar("jev-latest", criarMotorJev(contratoEvento.perguntas));
const ms = [...usoJev.ms].sort((a, b) => a - b), med = ms.length ? Math.round(ms[Math.floor(ms.length / 2)]) : null;
const saida = { quando: new Date().toISOString(), regras, jev, jev_uso: { chamadas: usoJev.chamadas, tokens_entrada: usoJev.tokens_entrada, tokens_por_decisao: Math.round(usoJev.tokens_entrada / Math.max(1, usoJev.chamadas)), ms_mediana: med, ms_min: ms.length ? Math.round(ms[0]) : null, ms_max: ms.length ? Math.round(ms[ms.length - 1]) : null } };
writeFileSync(import.meta.dir + "/comparacao-resultado.json", JSON.stringify(saida, null, 1)); console.log(JSON.stringify(saida, null, 1));
