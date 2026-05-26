'use client';

import { useState, useEffect, useMemo } from 'react';

export interface Ativo {
  id: string;
  ticker: string;
  quantidade: number;
  precoMedio: number;
  tipoAtivo: 'Ações' | 'FIIs' | 'Renda Fixa' | 'Cripto';
  dataUltimaCompra: string;
}

export function usePortfolio() {
  const [ativos, setAtivos] = useState<Ativo[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. CARREGA OS DADOS SALVOS
  useEffect(() => {
    const dadosSalvos = localStorage.getItem('@FinSight:portfolio');
    if (dadosSalvos) {
      setAtivos(JSON.parse(dadosSalvos));
    }
    setLoading(false);
  }, []);

  // 2. SALVA NO NAVEGADOR (PERSISTÊNCIA)
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('@FinSight:portfolio', JSON.stringify(ativos));
    }
  }, [ativos, loading]);

  // 3. CÁLCULO DA CARTEIRA (Simulando o preço atual para a interface funcionar)
  const ativosCalculados = useMemo(() => {
    return ativos.map(ativo => {
      const custoTotal = ativo.quantidade * ativo.precoMedio;
      // Mock: Simulando que o ativo valorizou 5% (Num app real, viria de uma API de bolsa)
      const saldoAtual = custoTotal * 1.05; 
      return {
        ...ativo,
        saldoAtual,
        lucroPrejuizoValor: saldoAtual - custoTotal,
        lucroPrejuizoPercent: 5
      };
    });
  }, [ativos]);

  const resumoCarteira = useMemo(() => {
    const totalInvestido = ativos.reduce((acc, a) => acc + (a.quantidade * a.precoMedio), 0);
    const patrimonioTotal = ativosCalculados.reduce((acc, a) => acc + a.saldoAtual, 0);
    const lucroTotalCarteira = patrimonioTotal - totalInvestido;
    const rentabilidadeTotalPercent = totalInvestido > 0 ? (lucroTotalCarteira / totalInvestido) * 100 : 0;
    
    return { totalInvestido, patrimonioTotal, lucroTotalCarteira, rentabilidadeTotalPercent };
  }, [ativos, ativosCalculados]);

  // 4. FUNÇÕES DE AÇÃO
  const adicionarAtivo = async (novo: Omit<Ativo, 'id'>) => {
    setAtivos(prev => [{ ...novo, id: crypto.randomUUID() }, ...prev]);
  };

  const editarAtivo = async (id: string, dadosAtualizados: Partial<Ativo>) => {
    setAtivos(prev => prev.map(a => a.id === id ? { ...a, ...dadosAtualizados } : a));
  };

  const deletarAtivo = (id: string) => {
    setAtivos(prev => prev.filter(a => a.id !== id));
  };

  return { 
    ativos: ativosCalculados, 
    resumoCarteira, 
    loading, 
    isError: false, 
    adicionarAtivo, 
    editarAtivo, 
    deletarAtivo 
  };
}