# NOVAS FUNÇOES
[FLUXO-GERAL]
Criar através da Store Procedures as ordens de produção, que serão exibidas na interface web e enviadas para o CLP.
As ordens são criadas pelo sistema da exportadora.

# Na página web, adicionar as funcionalidades.

[] Criar nova aba para acessar as configurações de cada balança
[] Espelhar a tela de configurações da balança[DEFINIR-CAMPOS]

[IMPORTANTE]
As páginas que irão exibir os status das balanças deveram estar espelhados e exibir as informações em tempo real.

[] Ler e editar os dados do CLP através da web [DEFINIR_CAMPOS_E_VARIAVEIS]

[] Pode ligar e desligar o fluxo pela tela web

[] Ler em tempo real o status da balança (criar um rotina com tempo configuravel para leitura)

[] Criar tela ( dados armazenados em banco de dados ) com configurações para o sistema(TEMPO DE LEITURA, ENDEREÇOS MODBUS DA BALANÇA, ENDEREÇOS DE OPCUA, ENDEREÇOS DO SOCKET E TEMPOS DE LEITURA DO SOCKET)

Acionar esse rotina assim que abrir a tela de configuração da balança.

# IDEIAS - SUGESTÕES

[] Abrir a tela de cada balança, após  os dados serem enviados para o CLP, para que alguns detalhes possam ser ajustados e posteriormente a balança seja ligada.
[] Verificar a disponiblidade da balança ao enviar os dados ( se está parada, ligada) - [DEFINIR-MELHOR-OS-CRITÉRIOS]
