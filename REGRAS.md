# Regras do FILTER

1. **Só dado público ou entregue ao time.** Nada de dado policial, nem agregado dele. Acidentes vêm do Estado (SEJUSP-MG, dados abertos).
2. **Todo número com origem.** Fonte, data, arquivo ou comando. Número sem origem não entra em slide nem em fala.
3. **Universo declarado.** "X de Y", nunca só X. Se não medimos, dizemos "não medido", não "zero".
4. **Sem absolutos.** Nada de "100%", "único", "garantido", "revolucionário".
5. **Vídeo é fonte, não acervo nosso.** Quadros podem ser processados temporariamente para extrair medidas. O fluxo padrão não faz OCR de placa nem reconhecimento facial e não persiste frames; retenção visual é exceção governada.
6. **Localização de pessoa é opt-in e agregada.** Célula de mapa, nunca trajeto individual. CPF e telefone nunca saem do app da prefeitura.
7. **Cruzar bases exige âncora.** Ver `docs/regras-de-cruzamento-de-dados.md`: dois identificadores só se casam quando pertencem ao mesmo domínio; correlação de horário não é causa.
8. **Antes e depois, sempre.** Toda intervenção proposta declara a linha de base (o "antes", com data) e como o "depois" será medido.
9. **Processar onde o dado já está.** Usar VMS/NVR, rede, armazenamento e sistemas que a cidade já possui antes de propor sensor, cloud, streaming, storage ou hardware novo. Tempo real só é requisito se o caso de uso provar que precisa.
10. **Publicar é decisão do time.** Site, repositório, imprensa, redes: ninguém publica sozinho. Autoria de cada contribuição fica registrada (ver `commons/POLITICA.md`).

11. **MEDIDO não é VALIDADO.** Resultado de modelo sobre vídeo real continua marcado com seu estado de validação humana.
12. **Preço vem depois do benchmark.** Custos e oferta recorrente nascem de integração, RTF, volume, recursos, validação, segurança/governança, suporte e licença reais — não de uma tabela de hackathon.
