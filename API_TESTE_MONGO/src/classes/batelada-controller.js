const prisma = require('../lib/prisma');

// classe usada para inserir bateladas lidas do CLP automaticamente quando é informado parametro 2 ou 3
class BateladasController {
  async inserirBateladasNoLote({ id: idLote, bateladas: valoresBatelada, idPlc: idServidor }) {
    console.log(`Iniciando rotina para atualizar bateladas da smartSac ${idServidor} no lote ${idLote}...`);
    const loteid = parseInt(idLote)

    try {
      for (const pesoBatelada of valoresBatelada.dadosPlc) {
        if (pesoBatelada !== 0) {
          await prisma.batelada.create({
            data: {
              lote: {
                connect: {
                  id: loteid
                }
              },
              pesoBatelada,
              dataBatelada: new Date(),
              idPlc: Number(idServidor)
            },
          });
        }
      }
      console.log(`Bateladas da smartSac ${idServidor} e lote ${idLote} atualizadas com sucesso!`);
      return ({ message: `Batelada Atualizadas no lote ${idLote} ` });
    } catch (error) {
      console.error('Bateladas da smartSac ${idServidor} e lote ${idLote} - Erro ao atualizar :', error);
      throw new Error('Erro ao atualizar o lote');
    }
  }
}

module.exports = BateladasController;
