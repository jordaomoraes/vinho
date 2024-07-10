
const LoteController = require('../classes/lote-controller');
const BateladasController = require('../classes/batelada-controller');
const loteController = new LoteController();
const bateladaController = new BateladasController();

const getDataBatelada = require('./get-data-bateladas');
const atualizaStatusOperacaoClp = require('./atualiza-plc-status-operacao-concluida')
const escreveStatusPlcOnline = require('./escreve-status-online-plc')

const processaParametroPLC = async (dadosRecebidos) => {

  // NOTE: operacaoExecutada === 1 -->  (`Operação : Lote Iniciado! - Lote ${idLote} - Operador ${operador}`);
  // NOTE: operacaoExecutada === 2 -->  (`Operação - Batelada de 1000, lote aberto - Lote ${idLote} - Operador ${operador}`);
  // NOTE: operacaoExecutada === 3 -->  (`Operação - Batelada de 1000, lote fechado - Lote ${idLote} - Operador ${operador}`);
  // NOTE: operacaoExecutada === 4 -->  (`Teste conexão( api retorna um status via opcua) - Lote ${idLote} - Operador ${operador}`);

  // console.log('Dados recebidos: ' + dadosRecebidos)
  let elementos = dadosRecebidos.split(',');
  const operacaoExecutada = elementos[1] ? elementos[1] : 0;
  const idLote = elementos[2] ? elementos[2] : 0
  const idServidor = elementos[3] ? elementos[3] : '1'
  const modoOperacao = elementos[4] ? elementos[4] : '0'
  const operador = elementos[5] ? elementos[5] : 'Sem Operador'

  try {
    if (operacaoExecutada === '1') {
      console.log();
      console.log(' Parametro 1 recebido, iniciando lote. ');
      try {
        await loteController.atualizaStatusLoteIniciado({ id: idLote, idPlc: idServidor, modoOperacao: modoOperacao, operador: operador });
        await loteController.atualizaLoteAtual({ id: idLote, idPlc: idServidor, modoOperacao: modoOperacao });

      } catch (error) {
        console.error("Erro ao atualizar Lote:", error.message);
        return ({ message: "Erro ao atualizar lote:" })
      }

    } else if (operacaoExecutada === '2') {
      console.log();
      console.log(`Parametro 2 recebido do plc ${idServidor}, atualizando dados do lote e inserindo bateladas.`);
      try {
        const valoresBatelada = await getDataBatelada({ idPlc: idServidor });
        if (valoresBatelada.statusLeituraPLC == false) {
          console.error(`Erro ao ler dados das bateladas da Smartsac ${idServidor}. Interropendo o fluxo de gravação.`);
          return ({ message: `Erro ao ler dados das bateladas da Smartsac ${idServidor}. Interropendo o fluxo de gravação.` })
        }
        await bateladaController.inserirBateladasNoLote({ id: idLote, bateladas: valoresBatelada, idPlc: idServidor })
        await loteController.atualizaLoteAtual({ id: idLote, idPlc: idServidor, modoOperacao: modoOperacao });
        await atualizaStatusOperacaoClp({ servidor: idServidor })

      } catch (error) {
        console.error(`Erro inesperado ao atualizar dados referente ao parametro 2 vindo da Smartsac ${idServidor}.`, error.message);
        return ({ message: "Erro ao atualizar bateladas" })
      }

    // } else if (operacaoExecutada === '3') {
    //   console.log();
    //   console.log(`Parametro 3 recebido do plc ${idServidor}, atualizando dados do lote e inserindo bateladas.`);
    //   try {
    //     const valoresBatelada = await getDataBatelada({ idPlc: idServidor });

    //     if (valoresBatelada.statusLeituraPLC == false) {
    //       console.error(`Erro ao ler dados das bateladas da Smartsac ${idServidor}. Interropendo o fluxo de gravação.`);
    //       return ({ message: `Erro ao ler dados das bateladas da Smartsac ${idServidor}. Interropendo o fluxo de gravação.` })
    //     }
    //     await bateladaController.inserirBateladasNoLote({ id: idLote, bateladas: valoresBatelada, idPlc: idServidor })
    //     await loteController.atualizaLoteAtual({ id: idLote, idPlc: idServidor, modoOperacao: modoOperacao });
    //     await loteController.finalizaLote({ id: idLote});
    //     await atualizaStatusOperacaoClp({ servidor: idServidor })

    //   } catch (error) {
    //     console.error(`Erro inesperado ao atualizar dados referente ao parametro 3 vindo da Smartsac ${idServidor}.`, error.message);
    //     return ({ message: "Erro ao atualizar bateladas e finalizar lote:" })
    //   }
    //
   } else if (operacaoExecutada === '4') {
      console.log();
      console.log('Parametro 4 recebido, informando status online.');
      try {
        await escreveStatusPlcOnline({ servidor: idServidor });
      } catch (error) {
        console.error("Erro ao informar status Online do PLC", error.message);
        return ({ message: "Erro ao informar status Online do PLC" })
      }
    }
    else if (operacaoExecutada === '5') {
      console.log();
      console.error(`Parametro 5 recebido do plc -->  ${idServidor} <-- Produção iniciada sem nenhuma OS selecionada.)`);
    } else {
      console.error(`Parametro recebido --> ${operacaoExecutada} <-- do PLC não é um parametro conhecido!`);

    }

  } catch (error) {
    console.error("Erro:", error.message);
    return ({ error: "Erro não identificado durante a operação" });
  }
};

module.exports = processaParametroPLC;
