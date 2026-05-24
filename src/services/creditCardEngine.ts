// src/services/creditCardEngine.ts

import { Transacao } from '@/types'; // Importamos a interface oficial correta

interface CreditCardMetrics {
  faturaAtual: number;
  limiteComprometido: number;
  limiteDisponivel: number;
  percentualUsoLimite: number;
  alertas: string[];
}

export function calcularMetricasDoCartao(
  transacoes: Transacao[], // Usamos Transacao em vez do tipo antigo
  mesAtivo: string, // Formato "YYYY-MM"
  limiteTotal: number
): CreditCardMetrics {
  let faturaAtual = 0;
  let limiteComprometido = 0;
  const alertas: string[] = [];

  // Filtramos preventivamente para garantir que só processamos compras no crédito
  const transacoesCartao = transacoes.filter(t => t.metodoPagamento === 'CartaoCredito');

  transacoesCartao.forEach((t) => {
    // Extraímos os dados com fallback seguro (já que marcamos como opcionais '?')
    const parcelas = t.parcelas || 1;
    const valorParcela = t.valorParcela || (t.valor / parcelas);
    
    // Se a transação não tiver o mesInicialFatura salvo, usamos o mês da data da compra ("YYYY-MM-DD" -> "YYYY-MM")
    const mesInicialFatura = t.mesInicialFatura || t.data.substring(0, 7); 

    const [anoInicial, mesInicial] = mesInicialFatura.split('-').map(Number);
    const [anoAtivo, mesAtivoNum] = mesAtivo.split('-').map(Number);

    // Quantos meses se passaram desde a compra até o mês que o utilizador está a visualizar?
    const mesesPassados = (anoAtivo - anoInicial) * 12 + (mesAtivoNum - mesInicial);

    // 1. CÁLCULO DA FATURA DO MÊS
    // Se o mês atual cai dentro do período de parcelamento (ex: mês 0 até mês 6 para 7 parcelas)
    if (mesesPassados >= 0 && mesesPassados < parcelas) {
      faturaAtual += valorParcela;
    }

    // 2. CÁLCULO DO LIMITE COMPROMETIDO (O Saldo Devedor real daquele mês em diante)
    // Quantas parcelas ainda faltam pagar DESTE mês em diante?
    if (mesesPassados < parcelas) {
      const parcelasRestantes = mesesPassados < 0 ? parcelas : parcelas - mesesPassados;
      limiteComprometido += (parcelasRestantes * valorParcela);
    }
  });

  const limiteDisponivel = Math.max(0, limiteTotal - limiteComprometido);
  const percentualUsoLimite = limiteTotal > 0 ? (limiteComprometido / limiteTotal) * 100 : 0;

  // 3. IA DE ALERTAS INTELIGENTES
  if (percentualUsoLimite > 90) {
    alertas.push(`Seu cartão estará ${percentualUsoLimite.toFixed(0)}% comprometido neste mês. Risco de recusa de compras.`);
  } else if (percentualUsoLimite > 75) {
    alertas.push("Atenção: Seu limite disponível está baixo para emergências.");
  }

  // Alerta de parcelas longas
  if (faturaAtual > (limiteTotal * 0.4)) {
    alertas.push("Você tem muitas parcelas acumuladas pesando na fatura deste mês.");
  }

  return {
    faturaAtual,
    limiteComprometido,
    limiteDisponivel,
    percentualUsoLimite,
    alertas
  };
}