/* ==========================================================
   V5 — MOBILIDADE EM EVIDÊNCIA / RUA COM MEMÓRIA
   A IA sinaliza. A decisão final permanece humana.
========================================================== */

const memoriaMobilidade = {

    intervencao: 23,

    quaseAcidentes: 0,

    eventos: [],

    baseline: {
        fluxo: 24,
        espera: 48,
        fila: 16
    },

    atual: {
        fluxo: 24,
        espera: 48,
        fila: 16
    },

    leituras: 0
};


/* ==========================================================
   HORÁRIO
========================================================== */

function horaV5() {

    return new Date().toLocaleTimeString(
        "pt-BR",
        {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        }
    );
}


/* ==========================================================
   REGISTRAR EVENTO NA MEMÓRIA DA VIA
========================================================== */

function registrarEventoV5(
    tipo,
    mensagem,
    fonte = "SIMULAÇÃO"
) {

    memoriaMobilidade.eventos.unshift({

        hora: horaV5(),

        tipo: tipo,

        mensagem: mensagem,

        fonte: fonte

    });


    /*
       Mantemos os últimos 12 eventos
       visíveis na timeline.
    */

    memoriaMobilidade.eventos =
        memoriaMobilidade.eventos.slice(
            0,
            12
        );


    renderTimelineV5();
}


/* ==========================================================
   CALCULAR INDICADORES
========================================================== */

function calcularMetricasV5() {

    /*
       Soma os veículos registrados
       nas quatro vias.
    */

    const total = vias.reduce(

        (soma, via) => {

            return soma +
                Number(
                    dados[via].quantidade || 0
                );

        },

        0

    );


    /*
       Maior fila encontrada.
    */

    const maiorFila = Math.max(

        ...vias.map(

            via =>
                Number(
                    dados[via].quantidade || 0
                )

        )

    );


    /*
       Quantas vias apresentam
       retenção elevada.
    */

    const congestionadas =
        vias.filter(

            via =>
                [
                    "ALTO",
                    "CONGESTIONADO"
                ].includes(
                    dados[via].fluxo
                )

        ).length;


    /*
       Verifica emergência.
    */

    const emergencia =
        vias.some(

            via =>
                dados[via].fluxo ===
                "EMERGÊNCIA"

        );


    memoriaMobilidade.atual.fluxo =
        total;


    memoriaMobilidade.atual.fila =
        maiorFila;


    /*
       ESTIMATIVA PARA O MVP.

       Não representa medição real.
       É calculada para demonstrar
       como o sistema poderia reagir
       aos dados coletados.
    */

    memoriaMobilidade.atual.espera =
        Math.max(

            18,

            24 +

            maiorFila * 2 +

            congestionadas * 7 -

            (
                emergencia
                    ? 5
                    : 0
            )

        );


    memoriaMobilidade.leituras++;


    /*
       QUASE-ACIDENTES

       Nesta versão são eventos
       simulados.

       Futuramente podem vir de:
       sensores,
       câmeras processadas localmente,
       frenagens bruscas,
       relatos etc.
    */

    if (
        congestionadas >= 2 &&
        memoriaMobilidade.leituras % 3 === 0
    ) {

        memoriaMobilidade
            .quaseAcidentes++;

    }


    atualizarPainelV5();
}


/* ==========================================================
   CLASSIFICAR RESULTADO
========================================================== */

function classificarV5(
    antes,
    depois,
    inverso = false
) {

    /*
       Sem números suficientes:
    */

    if (
        !Number.isFinite(antes) ||
        !Number.isFinite(depois)
    ) {

        return [
            "DADOS INSUFICIENTES",
            "leitura-insuficiente"
        ];
    }


    const delta = (

        (
            depois -
            antes
        )

        /

        Math.max(
            Math.abs(antes),
            1
        )

    ) * 100;


    /*
       Variações menores que 5%
       não são tratadas automaticamente
       como melhora ou piora.
    */

    if (
        Math.abs(delta) < 5
    ) {

        return [
            "SEM ALTERAÇÃO RELEVANTE",
            "leitura-insuficiente"
        ];
    }


    /*
       Alguns indicadores são melhores
       quando diminuem.

       Exemplo:
       espera
       fila
    */

    const melhorou =
        inverso

            ? depois < antes

            : depois > antes;


    if (melhorou) {

        return [
            "MELHOROU",
            "leitura-melhorou"
        ];

    }


    return [
        "PIOROU",
        "leitura-piorou"
    ];
}


/* ==========================================================
   ATUALIZAR PAINEL
========================================================== */

function atualizarPainelV5() {

    const m =
        memoriaMobilidade;


    const el =
        id =>
            document.getElementById(id);


    /*
       Se o HTML da V5 ainda
       não estiver carregado,
       não gera erro.
    */

    if (!el("mFluxo")) {
        return;
    }


    /* ===============================
       INDICADORES
    =============================== */

    el("mFluxo").textContent =
        m.atual.fluxo;


    el("mEspera").textContent =
        m.atual.espera +
        " s";


    el("mFila").textContent =
        m.atual.fila;


    el("mQuase").textContent =
        m.quaseAcidentes;


    el("mIntervencao").textContent =
        "INTERVENÇÃO #" +

        String(
            m.intervencao
        ).padStart(
            3,
            "0"
        );


    /* ===============================
       ANTES × DEPOIS
    =============================== */

    const itens = [

        [
            "Fluxo",
            m.baseline.fluxo,
            m.atual.fluxo,
            false
        ],

        [
            "Espera média",
            m.baseline.espera,
            m.atual.espera,
            true
        ],

        [
            "Fila máxima",
            m.baseline.fila,
            m.atual.fila,
            true
        ],

        [
            "Quase-acidentes",
            "—",
            m.quaseAcidentes,
            null
        ]

    ];


    el(
        "comparacaoV5"
    ).innerHTML =

        itens.map(

            (
                [
                    nome,
                    antes,
                    depois,
                    inverso
                ]
            ) => {


                let classificacao;


                if (
                    inverso === null
                ) {

                    classificacao = [

                        "DADOS INSUFICIENTES",

                        "leitura-insuficiente"

                    ];

                }

                else {

                    classificacao =
                        classificarV5(

                            Number(antes),

                            Number(depois),

                            inverso

                        );

                }


                const unidade =

                    nome.includes(
                        "Espera"
                    )

                        ? " s"

                        : "";


                return `

                    <tr>

                        <td>
                            ${nome}
                        </td>

                        <td>
                            ${antes}
                            ${
                                antes === "—"
                                    ? ""
                                    : unidade
                            }
                        </td>

                        <td>
                            ${depois}${unidade}
                        </td>

                        <td
                            class="${classificacao[1]}"
                        >
                            ${classificacao[0]}
                        </td>

                    </tr>

                `;

            }

        ).join("");


    /* =====================================================
       IA — SENSIBILIZAÇÃO
    ===================================================== */

    const congestionadas =

        vias.filter(

            via =>

                [
                    "ALTO",
                    "CONGESTIONADO"
                ].includes(
                    dados[via].fluxo
                )

        );


    let texto;


    /*
       CASO 1
       CONGESTIONAMENTO
    */

    if (
        congestionadas.length
    ) {

        texto =

            `Atenção: ${congestionadas.join(", ")} ` +

            `apresenta(m) retenção acima do cenário de referência. ` +

            `A evidência sugere avaliar ciclo semafórico, ` +

            `horário de pico, pedestres e transporte coletivo ` +

            `antes de qualquer alteração permanente.`;

    }


    /*
       CASO 2
       SEGURANÇA
    */

    else if (
        m.quaseAcidentes > 0
    ) {

        texto =

            "O fluxo está estável, porém existem " +

            "eventos simulados de quase-acidente. " +

            "A segurança deve ser analisada antes " +

            "de otimizar somente velocidade ou capacidade.";

    }


    /*
       CASO 3
       SEM EVIDÊNCIA SUFICIENTE
    */

    else {

        texto =

            "Não há evidência suficiente de " +

            "deterioração relevante nesta leitura. " +

            "Continue coletando dados antes de " +

            "recomendar nova intervenção.";

    }


    el(
        "insightV5"
    ).textContent = texto;


    /* =====================================================
       CONFIANÇA DA ANÁLISE
    ===================================================== */

    el(
        "confiancaV5"
    ).textContent =

        m.leituras >= 8

            ? "MODERADA"

            : "BAIXA";
}


/* ==========================================================
   TIMELINE
========================================================== */

function renderTimelineV5() {

    const elemento =
        document.getElementById(
            "timelineV5"
        );


    if (!elemento) {
        return;
    }


    elemento.innerHTML =

        memoriaMobilidade
            .eventos
            .map(

                evento => `

                    <div>

                        <time>
                            ${evento.hora}
                        </time>

                        <p>

                            <b>
                                ${evento.tipo}
                            </b>

                            •

                            ${evento.mensagem}

                            <small>
                                [${evento.fonte}]
                            </small>

                        </p>

                    </div>

                `

            )
            .join("");
}


/* ==========================================================
   ABRIR MEMÓRIA DA VIA
========================================================== */

function abrirMemoriaV5() {

    calcularMetricasV5();


    const painel =
        document.getElementById(
            "memoriaV5"
        );


    painel.classList.add(
        "aberta"
    );


    painel.setAttribute(
        "aria-hidden",
        "false"
    );


    registrarEventoV5(

        "CONSULTA",

        "Painel de memória da via aberto para análise humana."

    );
}


/* ==========================================================
   FECHAR MEMÓRIA
========================================================== */

function fecharMemoriaV5() {

    const painel =
        document.getElementById(
            "memoriaV5"
        );


    painel.classList.remove(
        "aberta"
    );


    painel.setAttribute(
        "aria-hidden",
        "true"
    );
}


/* ==========================================================
   DECISÃO HUMANA
========================================================== */

function registrarDecisaoHumanaV5() {

    /*
       A IA não executa automaticamente
       uma mudança permanente.

       O usuário registra que houve
       avaliação humana.
    */

    memoriaMobilidade
        .intervencao++;


    /*
       O cenário atual vira
       o novo ponto de referência.

       Isso permite iniciar
       outro ciclo de melhoria.
    */

    memoriaMobilidade.baseline = {

        ...memoriaMobilidade.atual

    };


    registrarEventoV5(

        "DECISÃO HUMANA",

        "Nova análise registrada. " +
        "O cenário atual foi preservado " +
        "como referência para o próximo " +
        "ciclo antes × depois."

    );


    atualizarPainelV5();
}


/* ==========================================================
   OBSERVAR CENÁRIO
========================================================== */

function observarCenarioV5(
    nome
) {

    calcularMetricasV5();


    registrarEventoV5(

        "CENÁRIO",

        `${nome} observado: ` +

        `${memoriaMobilidade.atual.fluxo} veículos, ` +

        `fila máxima ${memoriaMobilidade.atual.fila}, ` +

        `espera estimada ` +

        `${memoriaMobilidade.atual.espera}s.`

    );
}


/* ==========================================================
   INTEGRAÇÃO COM OS CENÁRIOS EXISTENTES
========================================================== */

/*
   Não precisamos apagar as funções
   antigas:

   cenarioNormal()
   cenarioCongestionamento()
   cenarioEmergencia()

   A V5 envolve essas funções
   e registra o resultado na
   memória da via.
*/

[
    "cenarioNormal",

    "cenarioCongestionamento",

    "cenarioEmergencia"

].forEach(

    nome => {


        const original =
            window[nome];


        if (
            typeof original ===
            "function"
        ) {


            window[nome] =
                function(
                    ...args
                ) {


                    /*
                       Executa o comportamento
                       visual original.
                    */

                    const retorno =

                        original.apply(
                            this,
                            args
                        );


                    /*
                       Depois registra
                       o cenário.
                    */

                    setTimeout(

                        () => {


                            let titulo;


                            if (
                                nome ===
                                "cenarioNormal"
                            ) {

                                titulo =
                                    "TRÂNSITO NORMAL";

                            }


                            else if (
                                nome ===
                                "cenarioCongestionamento"
                            ) {

                                titulo =
                                    "CONGESTIONAMENTO";

                            }


                            else {

                                titulo =
                                    "EMERGÊNCIA";

                            }


                            observarCenarioV5(
                                titulo
                            );


                        },

                        350

                    );


                    return retorno;

                };

        }

    }

);


/* ==========================================================
   INICIALIZAÇÃO DA MEMÓRIA
========================================================== */

window.addEventListener(

    "load",

    () => {


        registrarEventoV5(

            "INÍCIO",

            "Sistema V5 iniciado. " +
            "Coleta demonstrativa identificada como SIMULAÇÃO."

        );


        /*
           Primeira leitura.
        */

        setTimeout(

            calcularMetricasV5,

            500

        );


        /*
           DADOS RESPONSIVOS

           A cada 5 segundos o sistema
           observa novamente o estado
           das quatro vias.
        */

        setInterval(

            calcularMetricasV5,

            5000

        );

    }

);