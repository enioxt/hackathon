/* ==========================================================
   SEMÁFORO INTELIGENTE — ALAVANC TECH
   V4 — SIMULAÇÃO DE MOBILIDADE URBANA
========================================================== */


/* ==========================================================
   CONFIGURAÇÕES GERAIS
========================================================== */

const vias = ["A", "B", "C", "D"];

const dados = {
    A: { quantidade: 7, fluxo: "NORMAL" },
    B: { quantidade: 6, fluxo: "NORMAL" },
    C: { quantidade: 5, fluxo: "NORMAL" },
    D: { quantidade: 6, fluxo: "NORMAL" }
};

let timersCenario = [];
let timersDemo = [];

let demoAtivo = false;


/* ==========================================================
   ELEMENTOS
========================================================== */

const cruzamento = document.getElementById("cruzamento");

const decisao = document.getElementById("decisao");

const alerta = document.getElementById("alertaSistema");

const ambulancia = document.getElementById("ambulancia");


/* ==========================================================
   CONTROLE DE TEMPO
========================================================== */

function esperar(funcao, tempo) {

    const timer = setTimeout(funcao, tempo);

    timersCenario.push(timer);
}


function esperarDemo(funcao, tempo) {

    const timer = setTimeout(funcao, tempo);

    timersDemo.push(timer);
}


function limparTimersCenario() {

    timersCenario.forEach(clearTimeout);

    timersCenario = [];
}


function pararDemo() {

    timersDemo.forEach(clearTimeout);

    timersDemo = [];

    demoAtivo = false;
}


function prepararCenario(manterDemo = false) {

    limparTimersCenario();

    if (!manterDemo) {
        pararDemo();
    }

    removerCorredor();

    resetarAmbulancia();
}


/* ==========================================================
   SEMÁFOROS
========================================================== */

function apagarSemaforo(via) {

    const vermelho =
        document.getElementById("vermelho" + via);

    const amarelo =
        document.getElementById("amarelo" + via);

    const verde =
        document.getElementById("verde" + via);


    vermelho.style.background = "#38151a";
    amarelo.style.background = "#403917";
    verde.style.background = "#103724";


    vermelho.style.boxShadow = "none";
    amarelo.style.boxShadow = "none";
    verde.style.boxShadow = "none";
}


function setSignal(via, cor) {

    apagarSemaforo(via);

    const luz =
        document.getElementById(cor + via);


    if (cor === "vermelho") {

        luz.style.background = "#ff3545";

        luz.style.boxShadow =
            "0 0 7px #ff3545, 0 0 18px rgba(255,53,69,.65)";
    }


    if (cor === "amarelo") {

        luz.style.background = "#ffd43b";

        luz.style.boxShadow =
            "0 0 7px #ffd43b, 0 0 18px rgba(255,212,59,.55)";
    }


    if (cor === "verde") {

        luz.style.background = "#00ed8a";

        luz.style.boxShadow =
            "0 0 7px #00ed8a, 0 0 18px rgba(0,237,138,.55)";
    }
}


function todosVermelhos() {

    vias.forEach(via => {
        setSignal(via, "vermelho");
    });
}


function liberarSomente(via) {

    vias.forEach(v => {

        if (v === via) {

            setSignal(v, "verde");

        } else {

            setSignal(v, "vermelho");
        }

    });
}


function liberarEixoHorizontal() {

    setSignal("A", "verde");
    setSignal("C", "verde");

    setSignal("B", "vermelho");
    setSignal("D", "vermelho");
}


function liberarEixoVertical() {

    setSignal("B", "verde");
    setSignal("D", "verde");

    setSignal("A", "vermelho");
    setSignal("C", "vermelho");
}


function amareloHorizontal() {

    setSignal("A", "amarelo");
    setSignal("C", "amarelo");

    setSignal("B", "vermelho");
    setSignal("D", "vermelho");
}


function amareloVertical() {

    setSignal("B", "amarelo");
    setSignal("D", "amarelo");

    setSignal("A", "vermelho");
    setSignal("C", "vermelho");
}


/* ==========================================================
   DASHBOARD
========================================================== */

function atualizarVia(via, quantidade, fluxo) {

    dados[via].quantidade = quantidade;
    dados[via].fluxo = fluxo;


    document.getElementById(
        "veiculos" + via
    ).textContent = quantidade;


    const status =
        document.getElementById(
            "fluxo" + via
        );


    status.textContent = fluxo;


    if (
        fluxo === "ALTO" ||
        fluxo === "CONGESTIONADO"
    ) {

        status.style.color = "#ff5363";

        status.style.background =
            "rgba(255,53,69,.14)";
    }

    else if (fluxo === "EMERGÊNCIA") {

        status.style.color = "#ffd43b";

        status.style.background =
            "rgba(255,212,59,.14)";
    }

    else if (fluxo === "BAIXO") {

        status.style.color = "#67d8ff";

        status.style.background =
            "rgba(0,183,255,.10)";
    }

    else {

        status.style.color = "#00ed8a";

        status.style.background =
            "rgba(0,237,138,.09)";
    }
}


/* ==========================================================
   TIPOS DE VEÍCULOS
========================================================== */

function escolherVeiculo(indice, via, congestionado = false) {

    /*
       Mistura proposital para mostrar que
       o sistema reconhece diferentes modais.
    */


    if (congestionado && indice === 2) {

        return {
            emoji: "🚌",
            classe: "veiculo-onibus",
            tipo: "onibus"
        };
    }


    if (indice === 4) {

        return {
            emoji: "🏍️",
            classe: "veiculo-moto",
            tipo: "moto"
        };
    }


    if (
        congestionado &&
        indice === 5
    ) {

        return {
            emoji: "🚚",
            classe: "veiculo-carga",
            tipo: "carga"
        };
    }


    const carros = [
        "🚗",
        "🚙",
        "🚕"
    ];


    return {
        emoji: carros[indice % carros.length],
        classe: "",
        tipo: "carro"
    };
}


/* ==========================================================
   POSICIONAMENTO DOS VEÍCULOS
========================================================== */

function criarVeiculos(
    via,
    quantidade,
    congestionado = false
) {

    const container =
        document.getElementById(
            "carros" + via
        );


    container.innerHTML = "";


    /*
       O painel pode mostrar 20 veículos,
       mas não precisamos desenhar 20 emojis.
    */

    const maximoVisual =
        congestionado ? 10 : 7;

    const totalVisual =
        Math.min(
            quantidade,
            maximoVisual
        );


    const largura =
        cruzamento.clientWidth;

    const altura =
        cruzamento.clientHeight;


    const centroX =
        largura / 2;

    const centroY =
        altura / 2;


    for (
        let i = 0;
        i < totalVisual;
        i++
    ) {

        const veiculo =
            document.createElement("div");


        const tipo =
            escolherVeiculo(
                i,
                via,
                congestionado
            );


        veiculo.classList.add("carro");

        veiculo.classList.add(
            "carro-" + via
        );


        if (tipo.classe) {

            veiculo.classList.add(
                tipo.classe
            );
        }


        veiculo.dataset.via = via;

        veiculo.dataset.indice = i;

        veiculo.dataset.tipo =
            tipo.tipo;


        veiculo.textContent =
            tipo.emoji;


        /*
           Alternância das duas faixas.

           faixa 0 = mais próxima do eixo
           faixa 1 = faixa externa
        */

        const faixa =
            i % 2;


        veiculo.dataset.faixa =
            faixa;


        const fila =
            Math.floor(i / 2);


        /* =================================================
           VIA A
           OESTE → LESTE
        ================================================= */

        if (via === "A") {

            const x =
                centroX -
                190 -
                (fila * 58);


            const y =
                faixa === 0
                    ? centroY + 25
                    : centroY + 82;


            veiculo.style.left =
                x + "px";

            veiculo.style.top =
                y + "px";


            /*
               Corrige orientação do emoji.
               Frente apontada para →
            */

            veiculo.style.transform =
                "scaleX(-1)";
        }


        /* =================================================
           VIA C
           LESTE → OESTE
        ================================================= */

        if (via === "C") {

            const x =
                centroX +
                155 +
                (fila * 58);


            const y =
                faixa === 0
                    ? centroY - 48
                    : centroY - 105;


            veiculo.style.left =
                x + "px";

            veiculo.style.top =
                y + "px";


            veiculo.style.transform =
                "scaleX(1)";
        }


        /* =================================================
           VIA B
           NORTE → SUL
        ================================================= */

        if (via === "B") {

            const x =
                faixa === 0
                    ? centroX + 25
                    : centroX + 82;


            const y =
                centroY -
                190 -
                (fila * 58);


            veiculo.style.left =
                x + "px";

            veiculo.style.top =
                y + "px";


            veiculo.style.transform =
                "rotate(90deg) scaleX(-1)";
        }


        /* =================================================
           VIA D
           SUL → NORTE
        ================================================= */

        if (via === "D") {

            const x =
                faixa === 0
                    ? centroX - 48
                    : centroX - 105;


            const y =
                centroY +
                155 +
                (fila * 58);


            veiculo.style.left =
                x + "px";

            veiculo.style.top =
                y + "px";


            veiculo.style.transform =
                "rotate(-90deg) scaleX(-1)";
        }


        container.appendChild(
            veiculo
        );
    }


    /* =====================================================
       INDICADOR +X
    ===================================================== */

    if (
        quantidade >
        maximoVisual
    ) {

        const extra =
            document.createElement("div");


        extra.className =
            "contador-extra";


        extra.textContent =
            "+" +
            (
                quantidade -
                maximoVisual
            );


        extra.style.position =
            "absolute";

        extra.style.zIndex =
            "32";

        extra.style.padding =
            "4px 7px";

        extra.style.borderRadius =
            "12px";

        extra.style.background =
            "#ff3b4d";

        extra.style.color =
            "#fff";

        extra.style.fontSize =
            "8px";

        extra.style.fontWeight =
            "900";

        extra.style.boxShadow =
            "0 0 12px rgba(255,59,77,.45)";


        if (via === "A") {

            extra.style.left =
                "9px";

            extra.style.top =
                (centroY + 75) +
                "px";
        }


        if (via === "C") {

            extra.style.right =
                "9px";

            extra.style.top =
                (centroY - 102) +
                "px";
        }


        if (via === "B") {

            extra.style.left =
                (centroX + 76) +
                "px";

            extra.style.top =
                "9px";
        }


        if (via === "D") {

            extra.style.left =
                (centroX - 103) +
                "px";

            extra.style.bottom =
                "9px";
        }


        container.appendChild(
            extra
        );
    }
}


/* ==========================================================
   DESENHAR TRÂNSITO
========================================================== */

function desenharTransito(
    congestionamentoA = false
) {

    criarVeiculos(
        "A",
        dados.A.quantidade,
        congestionamentoA
    );


    criarVeiculos(
        "B",
        dados.B.quantidade
    );


    criarVeiculos(
        "C",
        dados.C.quantidade
    );


    criarVeiculos(
        "D",
        dados.D.quantidade
    );
}


/* ==========================================================
   MOVIMENTAÇÃO DOS VEÍCULOS
========================================================== */

function movimentarVia(
    via,
    limite = 99
) {

    const carros =
        Array.from(
            document.querySelectorAll(
                "#carros" +
                via +
                " .carro"
            )
        );


    const largura =
        cruzamento.clientWidth;

    const altura =
        cruzamento.clientHeight;


    carros
        .slice(0, limite)
        .forEach(
            (carro, indice) => {

                setTimeout(() => {

                    carro.style.transition =
                        "transform 3s linear, opacity .45s";


                    /* VIA A → */

                    if (via === "A") {

                        carro.style.transform =
                            `translateX(${largura + 350}px) scaleX(-1)`;
                    }


                    /* VIA C ← */

                    if (via === "C") {

                        carro.style.transform =
                            `translateX(-${largura + 350}px) scaleX(1)`;
                    }


                    /* VIA B ↓ */

                    if (via === "B") {

                        carro.style.transform =
                            `translateY(${altura + 350}px) rotate(90deg) scaleX(-1)`;
                    }


                    /* VIA D ↑ */

                    if (via === "D") {

                        carro.style.transform =
                            `translateY(-${altura + 350}px) rotate(-90deg) scaleX(-1)`;
                    }


                    setTimeout(() => {

                        carro.style.opacity =
                            "0";

                    }, 2600);


                }, indice * 260);
            }
        );
}


/* ==========================================================
   MOVIMENTAR DOIS SENTIDOS
========================================================== */

function movimentarHorizontal() {

    movimentarVia("A");
    movimentarVia("C");
}


function movimentarVertical() {

    movimentarVia("B");
    movimentarVia("D");
}


/* ==========================================================
   CORREDOR DE EMERGÊNCIA
========================================================== */

function criarCorredor() {

    removerCorredor();


    const corredor =
        document.createElement("div");


    corredor.id =
        "corredorEmergencia";


    corredor.className =
        "corredor-emergencia";


    /*
       Emergência entrando pela VIA A.
       Corredor horizontal.
    */

    corredor.style.left =
        "0";

    corredor.style.top =
        "calc(50% + 12px)";

    corredor.style.width =
        "100%";

    corredor.style.height =
        "55px";


    cruzamento.appendChild(
        corredor
    );


    requestAnimationFrame(() => {

        corredor.classList.add(
            "ativo"
        );
    });
}


function removerCorredor() {

    const corredor =
        document.getElementById(
            "corredorEmergencia"
        );


    if (corredor) {

        corredor.remove();
    }
}


/* ==========================================================
   CARROS ABREM PARA A LATERAL
========================================================== */

function abrirCorredorEmergencia() {

    const carros =
        document.querySelectorAll(
            "#carrosA .carro"
        );


    carros.forEach(carro => {

        const faixa =
            Number(
                carro.dataset.faixa
            );


        carro.classList.add(
            "abrindo-corredor"
        );


        /*
           Os carros da faixa interna
           sobem um pouco.

           Os carros da faixa externa
           descem um pouco.

           Isso abre espaço no centro.
        */

        if (faixa === 0) {

            carro.style.top =
                (
                    parseFloat(
                        carro.style.top
                    ) - 19
                ) + "px";
        }

        else {

            carro.style.top =
                (
                    parseFloat(
                        carro.style.top
                    ) + 18
                ) + "px";
        }

    });
}


/* ==========================================================
   ALGUNS CARROS ESCOAM PARA ABRIR ESPAÇO
========================================================== */

function escoarFrenteEmergencia() {

    const carros =
        Array.from(
            document.querySelectorAll(
                "#carrosA .carro"
            )
        );


    /*
       Apenas os primeiros veículos
       avançam.

       Assim não parece que todo o trânsito
       simplesmente desapareceu.
    */

    carros
        .slice(0, 4)
        .forEach(
            (carro, indice) => {

                setTimeout(() => {

                    const largura =
                        cruzamento.clientWidth;


                    carro.style.transition =
                        "transform 2.2s linear, opacity .4s";


                    carro.style.transform =
                        `translateX(${largura + 300}px) scaleX(-1)`;


                    setTimeout(() => {

                        carro.style.opacity =
                            "0";

                    }, 1800);


                }, indice * 220);
            }
        );
}


/* ==========================================================
   AMBULÂNCIA
========================================================== */

function resetarAmbulancia() {

    ambulancia.className =
        "ambulancia";


    ambulancia.style.transition =
        "none";


    ambulancia.style.opacity =
        "0";


    ambulancia.style.left =
        "-70px";


    ambulancia.style.top =
        "calc(50% + 30px)";


    /*
       Ambulância apontada para →
    */

    ambulancia.style.transform =
        "scaleX(-1)";
}


function posicionarAmbulancia() {

    ambulancia.className =
        "ambulancia detectada";


    ambulancia.style.transition =
        "none";


    ambulancia.style.left =
        "18px";


    ambulancia.style.top =
        "calc(50% + 30px)";


    ambulancia.style.transform =
        "scaleX(-1)";


    ambulancia.style.opacity =
        "1";
}


function atravessarAmbulancia() {

    const largura =
        cruzamento.clientWidth;


    ambulancia.style.transition =
        "left 3.5s linear";


    ambulancia.style.left =
        (largura + 80) +
        "px";
}


/* ==========================================================
   CENÁRIO NORMAL
========================================================== */

function cenarioNormal(
    manterDemo = false
) {

    prepararCenario(
        manterDemo
    );


    atualizarVia(
        "A",
        7,
        "NORMAL"
    );

    atualizarVia(
        "B",
        6,
        "NORMAL"
    );

    atualizarVia(
        "C",
        5,
        "NORMAL"
    );

    atualizarVia(
        "D",
        6,
        "NORMAL"
    );


    desenharTransito();


    todosVermelhos();


    alerta.textContent =
        "📡 FLUXO EQUILIBRADO — CICLO NORMAL";


    decisao.innerHTML =
        "🧠 Fluxo equilibrado nas quatro vias.<br>" +
        "Alternando os eixos com segurança.";


    /* =====================================================
       HORIZONTAL
    ===================================================== */

    esperar(() => {

        liberarEixoHorizontal();


        alerta.textContent =
            "🟢 EIXO HORIZONTAL LIBERADO";


        decisao.innerHTML =
            "🚗 Vias A e C liberadas.<br>" +
            "B e D permanecem protegidas.";


        movimentarHorizontal();

    }, 700);


    /* =====================================================
       AMARELO
    ===================================================== */

    esperar(() => {

        amareloHorizontal();


        alerta.textContent =
            "🟡 TRANSIÇÃO DE SEGURANÇA";

    }, 4300);


    /* =====================================================
       TODOS VERMELHOS
    ===================================================== */

    esperar(() => {

        todosVermelhos();

    }, 5000);


    /* =====================================================
       REDESENHA FILA VERTICAL
    ===================================================== */

    esperar(() => {

        criarVeiculos(
            "B",
            dados.B.quantidade
        );

        criarVeiculos(
            "D",
            dados.D.quantidade
        );


        liberarEixoVertical();


        alerta.textContent =
            "🟢 EIXO VERTICAL LIBERADO";


        decisao.innerHTML =
            "🚗 Vias B e D liberadas.<br>" +
            "A e C permanecem protegidas.";


        movimentarVertical();

    }, 5600);


    /* =====================================================
       FINALIZA
    ===================================================== */

    esperar(() => {

        amareloVertical();

    }, 9000);


    esperar(() => {

        todosVermelhos();


        alerta.textContent =
            "📡 CICLO CONCLUÍDO — RECALCULANDO";

    }, 9700);
}


/* ==========================================================
   CENÁRIO DE CONGESTIONAMENTO
========================================================== */

function cenarioCongestionamento(
    manterDemo = false
) {

    prepararCenario(
        manterDemo
    );


    atualizarVia(
        "A",
        22,
        "CONGESTIONADO"
    );

    atualizarVia(
        "B",
        5,
        "NORMAL"
    );

    atualizarVia(
        "C",
        4,
        "NORMAL"
    );

    atualizarVia(
        "D",
        6,
        "NORMAL"
    );


    desenharTransito(true);


    todosVermelhos();


    alerta.textContent =
        "📹 CÂMERAS DETECTANDO VOLUME DE TRÁFEGO";


    decisao.innerHTML =
        "📊 A=22 • B=5 • C=4 • D=6<br>" +
        "Analisando densidade das quatro vias...";


    /* =====================================================
       IA DETECTA
    ===================================================== */

    esperar(() => {

        alerta.textContent =
            "🚨 ALTO FLUXO DETECTADO NA VIA A";


        decisao.innerHTML =
            "🧠 VIA A apresenta maior demanda.<br>" +
            "Calculando extensão do tempo verde.";

    }, 1400);


    /* =====================================================
       IA DECIDE
    ===================================================== */

    esperar(() => {

        alerta.textContent =
            "⚙️ IA: PRIORIDADE ADAPTATIVA CALCULADA";


        decisao.innerHTML =
            "⚙️ Decisão: ampliar abertura da VIA A.<br>" +
            "Ônibus, motos e carros serão escoados.";

    }, 2800);


    /* =====================================================
       VERDE
    ===================================================== */

    esperar(() => {

        liberarSomente("A");


        alerta.textContent =
            "🟢 VIA A — TEMPO VERDE AMPLIADO";


        decisao.innerHTML =
            "🟢 Prioridade ativa.<br>" +
            "🚗 🏍️ 🚌 🚚 Fila em escoamento.";


        movimentarVia(
            "A",
            8
        );

    }, 4000);


    /* =====================================================
       REDUÇÃO DA FILA
    ===================================================== */

    esperar(() => {

        atualizarVia(
            "A",
            13,
            "ALTO"
        );


        alerta.textContent =
            "📉 FILA REDUZIDA: 22 → 13";


        decisao.innerHTML =
            "📉 A fila está diminuindo.<br>" +
            "IA mantém o verde por mais tempo.";

    }, 7000);


    /* =====================================================
       SEGUNDA LEVA
    ===================================================== */

    esperar(() => {

        criarVeiculos(
            "A",
            7,
            true
        );


        movimentarVia(
            "A",
            5
        );


        alerta.textContent =
            "🟢 VERDE ESTENDIDO — SEGUNDA LEVA";

    }, 7700);


    /* =====================================================
       NORMALIZAÇÃO
    ===================================================== */

    esperar(() => {

        atualizarVia(
            "A",
            7,
            "NORMAL"
        );


        alerta.textContent =
            "✅ VIA A: 22 → 7 VEÍCULOS";


        decisao.innerHTML =
            "✅ Congestionamento reduzido.<br>" +
            "🧠 Fluxo voltou ao nível operacional.";

    }, 10500);


    esperar(() => {

        amareloHorizontal();

    }, 11200);


    esperar(() => {

        todosVermelhos();


        criarVeiculos(
            "A",
            7
        );


        alerta.textContent =
            "📡 SISTEMA RECALCULANDO O PRÓXIMO CICLO";

    }, 12000);
}


/* ==========================================================
   CENÁRIO DE EMERGÊNCIA
========================================================== */

function cenarioEmergencia(
    manterDemo = false
) {

    prepararCenario(
        manterDemo
    );


    /*
       Criamos trânsito intenso na mesma direção
       da ambulância.
    */

    atualizarVia(
        "A",
        14,
        "EMERGÊNCIA"
    );

    atualizarVia(
        "B",
        6,
        "NORMAL"
    );

    atualizarVia(
        "C",
        5,
        "NORMAL"
    );

    atualizarVia(
        "D",
        7,
        "NORMAL"
    );


    desenharTransito(true);


    todosVermelhos();


    posicionarAmbulancia();


    alerta.textContent =
        "🚑 VEÍCULO DE EMERGÊNCIA DETECTADO — VIA A";


    decisao.innerHTML =
        "🚑 Emergência identificada.<br>" +
        "🧠 Calculando corredor prioritário.";


    /* =====================================================
       IA ANALISA
    ===================================================== */

    esperar(() => {

        alerta.textContent =
            "🧠 IA ANALISANDO ROTA DA AMBULÂNCIA";


        decisao.innerHTML =
            "📹 Câmeras identificaram a emergência.<br>" +
            "⚠️ Preparando intervenção no tráfego.";

    }, 1200);


    /* =====================================================
       CARROS ABREM LATERALMENTE
    ===================================================== */

    esperar(() => {

        criarCorredor();


        abrirCorredorEmergencia();


        alerta.textContent =
            "↔️ VEÍCULOS ABRINDO CORREDOR";


        decisao.innerHTML =
            "🚗 ↔️ 🚗 Veículos deslocando-se lateralmente.<br>" +
            "Criando espaço para o atendimento.";

    }, 2600);


    /* =====================================================
       CRUZAMENTO PROTEGIDO
    ===================================================== */

    esperar(() => {

        todosVermelhos();


        alerta.textContent =
            "🔴 FLUXOS CONFLITANTES BLOQUEADOS";


        decisao.innerHTML =
            "🔴 B, C e D protegidas.<br>" +
            "Preparando abertura exclusiva da VIA A.";

    }, 3900);


    /* =====================================================
       VIA A FICA VERDE
    ===================================================== */

    esperar(() => {

        liberarSomente("A");


        alerta.textContent =
            "🟢 VIA A LIBERADA — CORREDOR VERDE";


        decisao.innerHTML =
            "🟢 Sinal verde para a rota da emergência.<br>" +
            "Alguns veículos avançam para liberar espaço.";

    }, 5000);


    /* =====================================================
       ALGUNS CARROS AVANÇAM
    ===================================================== */

    esperar(() => {

        escoarFrenteEmergencia();


        atualizarVia(
            "A",
            10,
            "EMERGÊNCIA"
        );


        alerta.textContent =
            "🚗 VEÍCULOS À FRENTE ESCOANDO";

    }, 5500);


    /* =====================================================
       AMBULÂNCIA AVANÇA
    ===================================================== */

    esperar(() => {

        alerta.textContent =
            "🚑 AMBULÂNCIA EM DESLOCAMENTO";


        decisao.innerHTML =
            "🚑 Corredor prioritário ativo.<br>" +
            "Passagem de emergência em andamento.";


        atravessarAmbulancia();

    }, 7200);


    /* =====================================================
       PASSAGEM CONCLUÍDA
    ===================================================== */

    esperar(() => {

        atualizarVia(
            "A",
            8,
            "NORMAL"
        );


        alerta.textContent =
            "✅ AMBULÂNCIA ATRAVESSOU O CRUZAMENTO";


        decisao.innerHTML =
            "✅ Emergência liberada.<br>" +
            "🧠 Sistema iniciando normalização.";

    }, 10800);


    /* =====================================================
       FECHA A VIA
    ===================================================== */

    esperar(() => {

        setSignal(
            "A",
            "amarelo"
        );


        alerta.textContent =
            "🟡 NORMALIZANDO O CRUZAMENTO";

    }, 11600);


    /* =====================================================
       RETORNO
    ===================================================== */

    esperar(() => {

        todosVermelhos();


        removerCorredor();


        resetarAmbulancia();


        criarVeiculos(
            "A",
            8
        );


        alerta.textContent =
            "📡 TRÂNSITO RETORNANDO À OPERAÇÃO NORMAL";


        decisao.innerHTML =
            "🧠 Prioridade encerrada.<br>" +
            "Ciclo semafórico sendo recalculado.";

    }, 12500);
}


/* ==========================================================
   DEMONSTRAÇÃO AUTOMÁTICA
========================================================== */

function demonstracaoAutomatica() {

    limparTimersCenario();

    pararDemo();

    demoAtivo = true;


    alerta.textContent =
        "▶ DEMONSTRAÇÃO INTELIGENTE INICIADA";


    decisao.innerHTML =
        "🧠 Acompanhe três situações:<br>" +
        "Normal → Congestionamento → Emergência";


    /*
       1 — NORMAL
    */

    cenarioNormal(true);


    /*
       2 — CONGESTIONAMENTO
    */

    esperarDemo(() => {

        cenarioCongestionamento(true);

    }, 11000);


    /*
       3 — EMERGÊNCIA
    */

    esperarDemo(() => {

        cenarioEmergencia(true);

    }, 24500);


    /*
       FINAL
    */

    esperarDemo(() => {

        demoAtivo = false;


        alerta.textContent =
            "✅ DEMONSTRAÇÃO CONCLUÍDA";


        decisao.innerHTML =
            "🚦 Fluxo normal • Alto tráfego • Emergência<br>" +
            "🧠 Sistema adaptou o cruzamento a cada cenário.";

    }, 38500);
}


/* ==========================================================
   REDIMENSIONAMENTO
========================================================== */

let resizeTimer;


window.addEventListener(
    "resize",
    () => {

        clearTimeout(
            resizeTimer
        );


        resizeTimer =
            setTimeout(() => {

                /*
                   Só redesenhamos se não houver
                   uma animação importante acontecendo.
                */

                if (!demoAtivo) {

                    desenharTransito(
                        dados.A.fluxo ===
                        "CONGESTIONADO"
                    );
                }

            }, 300);
    }
);


/* ==========================================================
   INICIALIZAÇÃO
========================================================== */

function iniciarSistema() {

    todosVermelhos();


    atualizarVia(
        "A",
        7,
        "NORMAL"
    );

    atualizarVia(
        "B",
        6,
        "NORMAL"
    );

    atualizarVia(
        "C",
        5,
        "NORMAL"
    );

    atualizarVia(
        "D",
        6,
        "NORMAL"
    );


    desenharTransito();


    resetarAmbulancia();


    alerta.textContent =
        "📡 SISTEMA PRONTO — MONITORANDO AS QUATRO VIAS";


    decisao.innerHTML =
        "🧠 Monitorando as quatro vias.<br>" +
        "Aguardando alteração no fluxo.";
}


/* ==========================================================
   START
========================================================== */

iniciarSistema();