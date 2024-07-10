const prisma = require('../lib/prisma');

class LoteController {

  // utilizado quando o lote é iniciado pelo operador e é recebido parametro 1 do PLC
  async atualizaStatusLoteIniciado({ id: idLote, idPlc: idServidor,modoOperacao: modoOperacao,operador:operador  }) {
    const dataHoraAtual = new Date().toISOString();

    try {
      const lote = await prisma.lote.findUnique({
        where: { id: parseInt(idLote) },
      });

      if (!lote) {
        throw new Error('Lote não encontrado');
      }

      const updatedLote = await prisma.lote.update({
        where: { id: parseInt(idLote) },
        data: {
          dataHoraInicioLote: dataHoraAtual,
          status: 'Processo Iniciado',
          modoOperacao : parseInt(modoOperacao),
          idPlc: parseInt(idServidor),
          operador: operador
        },
      });

      return updatedLote;
    } catch (error) {
      console.error('Erro ao atualizar o lote:', error);
      throw new Error('Erro ao atualizar o lote');
    }
  }

  // Classe utilizada para finalizar o lote quando recebido parametro 3 do PLC, atualiza hora, peso total e quantidade de sacos
  async finalizaLote({ id: idLote }) {
    const dataHoraAtual = new Date().toISOString();

    try {
      const lote = await prisma.lote.findUnique({
        where: { id: parseInt(idLote) },
      });

      if (!lote) {
        throw new Error('Lote não encontrado');
      }

      const resultado = await prisma.$queryRaw`
          SELECT COUNT(*) AS quantidadeBateladas, ROUND(SUM(pesoBatelada), 2) AS pesoTotal
          FROM bateladas
          WHERE idLote = ${Number(idLote)}
        `;
      const { quantidadeBateladas, pesoTotal } = resultado[0];

      const updatedLote = await prisma.lote.update({
        where: { id: parseInt(idLote) },
        data: {
          dataHoraFinalLote: dataHoraAtual,
          status: 'Lote Finalizado',
          pesoLote: pesoTotal,
          qtdSaco: parseInt(quantidadeBateladas),
          // idPlc: parseInt(idServidor),
          consumed: true
        },
      });

      return updatedLote;
    } catch (error) {
      console.error('Erro ao atualizar o lote:', error);
      throw new Error('Erro ao atualizar o lote');
    }
  }

  async atualizaLoteAtual({ id: idLote, modoOperacao: modoOperacao, idPlc: idServidor }) {

    try {
      const lote = await prisma.lote.findUnique({
        where: { id: parseInt(idLote) },
      });

      if (!lote) {
        throw new Error('Lote não encontrado');
      }

      const resultado = await prisma.$queryRaw`
      SELECT COUNT(*) AS quantidadeBateladas, ROUND(SUM(pesoBatelada), 2) AS pesoTotal
      FROM bateladas
      WHERE idLote = ${Number(idLote)} and idPlc = ${Number(idServidor)}
    `;

      const pesoTotal = resultado[0].pesoTotal ? resultado[0].pesoTotal : 0;
      const updatedLoteAtual = await prisma.loteAtual.update({
        where: { id: parseInt(idServidor) },
        data: {
          idLote: parseInt(idLote),
          pesoLote: lote.pesoLoteProgramado,
          pesoAtual: pesoTotal ? pesoTotal : 0,
          producaoHoje: 0,
          producaoTotal: 0,
          modoOperacao: parseInt(modoOperacao),
          docReferencia: lote.docReferencia
        },
      });
      console.log(`Bateladas inseridas no Lote : ${idLote}`);
      return updatedLoteAtual;
    } catch (error) {
      console.error('Erro ao inserir bateladas e atualizar o lote:', error);
      throw new Error('Erro ao atualizar o lote atual');
    }
  }

  async atualizaStatusMaquina({ status: statusClp, idPlc: idServidor }) {
    try {
      const updatedStatusMaquina = await prisma.loteAtual.update({
        where: { id: parseInt(idServidor) },
        data: {
          statusEquipamento: statusClp,
        },
      });

      return updatedStatusMaquina;
    } catch (error) {
      console.error('Erro ao atualizar o lote:', error);
      throw new Error('Erro ao atualizar o lote atual');
    }
  }
}

module.exports = LoteController;
