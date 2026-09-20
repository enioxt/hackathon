#!/usr/bin/env python3
"""anotar-imagem.py — pega uma imagem (gerada por IA ou foto) e desenha por cima o que o NOSSO leitor detecta de verdade:
caixa por tipo, rótulo, contagem e selos. Saída: PNG pronto para a landing e para o painel + JSON com as caixas.
Uso:  python3 anotar-imagem.py entrada.png [saida.png] [--ilustrativa] [--imgsz 1280] [--conf 0.3]
Borra pessoas (caixa inteira) e a metade de baixo dos veículos (onde fica a placa) ANTES de desenhar."""
import sys, json, os, argparse, cv2
from ultralytics import YOLO
ALVO = {0: "pedestre", 1: "bicicleta", 2: "automóvel", 3: "moto", 5: "ônibus", 7: "caminhão"}
COR = {"automóvel": (255, 190, 120), "moto": (61, 163, 232), "ônibus": (107, 158, 46), "caminhão": (200, 130, 190), "bicicleta": (220, 200, 60), "pedestre": (245, 245, 245)}  # BGR
ap = argparse.ArgumentParser(); ap.add_argument("entrada"); ap.add_argument("saida", nargs="?"); ap.add_argument("--ilustrativa", action="store_true"); ap.add_argument("--imgsz", type=int, default=1280); ap.add_argument("--conf", type=float, default=0.3); a = ap.parse_args()
img = cv2.imread(a.entrada)
if img is None: sys.exit(f"[ERRO] não consegui abrir {a.entrada}")
H, W = img.shape[:2]; esc = max(1.0, W / 1600)
aqui = os.path.dirname(os.path.abspath(__file__)); peso = os.path.join(aqui, "yolo11n.pt")
r = YOLO(peso if os.path.exists(peso) else "yolo11n.pt")(img, imgsz=a.imgsz, conf=a.conf, verbose=False)[0]
cx = []
for b in r.boxes:
    c = int(b.cls[0]); 
    if c not in ALVO: continue
    x1, y1, x2, y2 = [int(v) for v in b.xyxy[0]]; cx.append((ALVO[c], float(b.conf[0]), x1, y1, x2, y2))
for t, _, x1, y1, x2, y2 in cx:   # privacidade antes de desenhar
    ya = y1 if t == "pedestre" else y1 + (y2 - y1) // 2
    roi = img[ya:y2, x1:x2]
    if roi.size: k = max(15, (max(x2 - x1, y2 - ya) // 3) | 1); img[ya:y2, x1:x2] = cv2.GaussianBlur(roi, (k, k), 0)
cont = {}
for i, (t, cf, x1, y1, x2, y2) in enumerate(sorted(cx, key=lambda v: v[2])):
    cont[t] = cont.get(t, 0) + 1; cor = COR[t]
    cv2.rectangle(img, (x1, y1), (x2, y2), cor, max(2, int(2 * esc)))
    rot = f"{t} #{i + 1} {int(cf * 100)}%"; fs = 0.45 * esc; (tw, th), _ = cv2.getTextSize(rot, cv2.FONT_HERSHEY_SIMPLEX, fs, 1)
    yy = y1 - 4 if y1 - th - 6 > 0 else y2 + th + 4
    cv2.rectangle(img, (x1, yy - th - 4), (x1 + tw + 6, yy + 2), (20, 27, 40), -1); cv2.putText(img, rot, (x1 + 3, yy - 2), cv2.FONT_HERSHEY_SIMPLEX, fs, cor, 1, cv2.LINE_AA)
linhas = [f"{k}: {v}" for k, v in sorted(cont.items(), key=lambda kv: -kv[1])] or ["nenhum veículo detectado"]
fs = 0.6 * esc; alt = int(26 * esc); larg = int(250 * esc); topo = int(14 * esc)
painel = img.copy(); cv2.rectangle(painel, (W - larg - topo, topo), (W - topo, topo + alt * (len(linhas) + 2)), (25, 34, 50), -1); img = cv2.addWeighted(painel, 0.82, img, 0.18, 0)
cv2.putText(img, "CONTAGEM POR TIPO", (W - larg, topo + alt), cv2.FONT_HERSHEY_SIMPLEX, fs * 0.8, (61, 163, 232), 1, cv2.LINE_AA)
for j, l in enumerate(linhas): cv2.putText(img, l, (W - larg, topo + alt * (j + 2)), cv2.FONT_HERSHEY_SIMPLEX, fs, (245, 245, 245), 1, cv2.LINE_AA)
rod = ("imagem ilustrativa gerada por IA · " if a.ilustrativa else "") + "deteccao feita de verdade pelo leitor · sem rosto · sem placa"
cv2.rectangle(img, (0, H - int(30 * esc)), (W, H), (20, 27, 40), -1); cv2.putText(img, rod, (int(12 * esc), H - int(10 * esc)), cv2.FONT_HERSHEY_SIMPLEX, fs * 0.8, (230, 236, 245), 1, cv2.LINE_AA)
saida = a.saida or os.path.splitext(a.entrada)[0] + "-anotada.png"; cv2.imwrite(saida, img)
json.dump({"entrada": os.path.basename(a.entrada), "largura": W, "altura": H, "contagem": cont, "caixas": [{"tipo": t, "confianca": round(c, 3), "x1": x1, "y1": y1, "x2": x2, "y2": y2} for t, c, x1, y1, x2, y2 in cx]}, open(os.path.splitext(saida)[0] + ".json", "w"), ensure_ascii=False, indent=1)
print(f"{len(cx)} objetos · {cont} → {saida}")
