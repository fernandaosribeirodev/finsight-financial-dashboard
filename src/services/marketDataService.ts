// src/services/marketDataService.ts

import { CotacaoAtivo } from '@/types';

// Um dicionário robusto de mock de mercado de alta fidelidade.
// Empresas reais usam isso como ambiente de "Staging" ou "Mock" para testes unitários.
const MOCK_MARKET_DATABASE: Record<string, Omit<CotacaoAtivo, 'ticker'>> = {
  PETR4: { nomeEmpresa: 'Petrobras S.A.', precoAtual: 38.42, variacaoDia: 1.45 },
  VALE3: { nomeEmpresa: 'Vale S.A.', precoAtual: 62.15, variacaoDia: -0.82 },
  ITUB4: { nomeEmpresa: 'Itaú Unibanco Holding S.A.', precoAtual: 32.90, variacaoDia: 0.25 },
  BBDC4: { nomeEmpresa: 'Banco Bradesco S.A.', precoAtual: 13.75, variacaoDia: -1.12 },
  MXRF11: { nomeEmpresa: 'Maxi Renda FII', precoAtual: 10.15, variacaoDia: 0.10 },
  HGLG11: { nomeEmpresa: 'CGHG Logística FII', precoAtual: 164.80, variacaoDia: 0.54 },
  XPLG11: { nomeEmpresa: 'XP Logística FII', precoAtual: 108.30, variacaoDia: -0.15 },
  IVVB11: { nomeEmpresa: 'iShares S&P 500 ETF', precoAtual: 295.40, variacaoDia: 2.10 },
  BOVA11: { nomeEmpresa: 'iShares Ibovespa ETF', precoAtual: 122.50, variacaoDia: 0.78 },
  BTC: { nomeEmpresa: 'Bitcoin (Crypto)', precoAtual: 345200.00, variacaoDia: 4.85 },
  ETH: { nomeEmpresa: 'Ethereum (Crypto)', precoAtual: 18450.00, variacaoDia: 3.20 },
};

/**
 * Busca cotações em tempo real da API de mercado.
 * @param tickers Array de strings com os códigos dos ativos (Ex: ['PETR4', 'MXRF11'])
 */
export async function buscarCotacoesMercado(tickers: string[]): Promise<CotacaoAtivo[]> {
  // 1. Simula um delay real de rede de 800ms para testar a experiência de Skeletons na UI
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (!tickers || tickers.length === 0) return [];

  // 2. Transforma tudo em caixa alta para evitar erros de digitação do usuário
  return tickers.map((tickerInput) => {
    const ticker = tickerInput.toUpperCase().trim();
    const dadosAtivo = MOCK_MARKET_DATABASE[ticker];

    if (dadosAtivo) {
      // Pequena flutuação aleatória para fazer os números mexerem de verdade (Efeito Fintech Dinâmico)
      const oscilacaoAleatoria = (Math.random() - 0.5) * 0.1; // Sobe ou desce até 0.05 centavos
      
      return {
        ticker,
        nomeEmpresa: dadosAtivo.nomeEmpresa,
        precoAtual: Number((dadosAtivo.precoAtual + oscilacaoAleatoria).toFixed(2)),
        variacaoDia: Number((dadosAtivo.variacaoDia + (oscilacaoAleatoria * 5)).toFixed(2)),
      };
    }

    // Fallback caso o usuário digite um ticker que não mapeamos no nosso banco de dados mockado
    return {
      ticker,
      nomeEmpresa: 'Ativo Não Listado / Outros',
      precoAtual: 50.00, // Preço genérico de fallback
      variacaoDia: 0.00,
    };
  });
}