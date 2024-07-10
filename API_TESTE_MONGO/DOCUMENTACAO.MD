# FLUXO GERAL.

1 - API se conecta com CLP de cada smartSac via websocket.
2 - CLP envia parametros para API. ( 1- lote Iniciado / 2 - Bateladas completas / 4 - Verificar Status Online)
3 - A função [PROCESSA_PARAMETROS] é responsável por identificar e chamar as demais funções para gravação de dados e leitura de dados do CLP.

# CLASSES
[batelada-controler] [OPERAÇÕES_BANCO_DE_DADOS]
 * inserirBateladasNoLote                 - Utilizada para inserir no banco de dados os dadas daas bateladas no lote

[lote-controler] [OPERAÇÕES_BANCO_DE_DADOS]
 * atualizaStatusLoteIniciado             - Atualiza status de lote iniciado no banco de dados
 * finalizaLote                           - Atualiza status de lote finalizado no banco de dados
 * atualizaLoteAtual                      - Atualiza status de lote finalizado no banco de dados
 * atualizaStatusMaquina                  - Atualiza status de smart sac atual

# CONTROLLERS
[bateladas] [OPERAÇÕES_BATELADAS_BANCO_DE_DADOS]
 * POST /batelada/adicionar
 * GET  /batelada/buscarporlote
 * GET  /batelada/buscarpordata

[escreve-dados-plc]
 * POST /verificaPLC                     - Verifica os dados do PLC [PLC]
 * POST /finalizalote                    - Finaliza o lote no BANCO DE DADOS, e no PLC [PLC-DB]
 * POST /adicionaloteplc                 - Envia os dados selecionados no frontend para o PLC.[PLC]

[lote-atual] [LISTA_LOTE_ATUAL]
 * POST /loteatual/:id

[lotes] [ROTAS_CRUD_LOTES]
 * POST /lotes/listartodos
 * POST /lotes/listartodosclp
 * POST /lote/:id
 * GET  /lote/enviadoclp/:id
 * PUT  /lote/alterarstatus
 * GET  /lotes/consultarstatus
 * GET  /lotes/consultarstatuspordata
 * GET  /lotes/somavalores/:id
 * DEL  /lote

[users] [ROTAS_CRUD_USUARIO]
 * POST /user/adicionar
 * POST /user/login

# FUNCTIONS
[atualiza-plc-status-operacao-concluida]
 * Atualiza CLP que a leitura e processamento já foi executado.

[escreve-plc-unico-registro]
 * Escreve os dado no plc, de acordo com lote e dados vindos do frontend

[escreve-status-lote-finalizado]
 * Escreve os dado no plc, de acordo com lote e dados vindos do frontend

[escreve-status-online-plc]
 * Função para escreve no plc para monitorar se a comunição SOCKET está funcionando.

[get-data-bateladas]
 * Função que busca os dados armazenados no PLC para salvar no banco de dados.

[processa-parametros-plc]
 * Função principal, recebe os dados do PLC  e chama as demais funções.

# UTILS
[conect-opcua-server]
 * Função responsável pela conexão via OPCUA com o CLP das smartsSacs

[socketCliente1]
 * Função responsável pela conexão via SOCKET com o CLP das smartsSacs

 # .ENV
 * Arquivo com as configurações de servidor e banco de dados.