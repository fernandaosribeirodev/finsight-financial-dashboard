'use client';

import { useState, useEffect, useMemo } from 'react';
import { useMonth } from '@/contexts/MonthContext';

export interface Transacao {
  id: string;
  titulo: string;
  valor: number;
  tipo: 'Entrada' | 'Saida';
  categoria: string;
  tag: string;
  metodoPagamento: string;
  data: string;
  cartaoId?: string; // <-- O TypeScript precisava disto para ligar ao cartão!
}

export function useTransactions() {
  const { activeMonth } = useMonth();
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. HIDRATAÇÃO SEGURA
  useEffect(() => {
    const dadosSalvos = localStorage.getItem('@FinSight:transacoes');
    if (dadosSalvos) {
      setTransacoes(JSON.parse(dadosSalvos));
    }
    setLoading(false);
  }, []);

  // 2. PERSISTÊNCIA NO LOCALSTORAGE
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('@FinSight:transacoes', JSON.stringify(transacoes));
    }
  }, [transacoes, loading]);

  // 3. FILTRO DO CARROSSEL DE MESES
  const transacoesDoMes = useMemo(() => {
    if (!activeMonth) return [];
    return transacoes.filter((t) => t.data.startsWith(activeMonth));
  }, [transacoes, activeMonth]);

  // 4. MOTOR DE CÁLCULO (Agora com os Cartões de Crédito integrados!)
  const resumoFinanceiro = useMemo(() => {
    let entradas = 0;
    let essenciais = 0;
    let naoEssenciais = 0;
    const gastosPorCartao: Record<string, number> = {};
    const faturasPorCartao: Record<string, number> = {};

    // A) O Limite dos Cartões considera todas as compras (histórico completo)
    transacoes.forEach((t) => {
      if (t.tipo === 'Saida' && t.metodoPagamento === 'CartaoCredito' && t.cartaoId) {
        gastosPorCartao[t.cartaoId] = (gastosPorCartao[t.cartaoId] || 0) + t.valor;
      }
    });

    // B) Entradas, despesas e faturas apenas do Mês Ativo no ecrã
    transacoesDoMes.forEach((t) => {
      if (t.tipo === 'Entrada') {
        entradas += t.valor;
      } else if (t.tipo === 'Saida') {
        if (t.categoria === 'Essencial') {
          essenciais += t.valor;
        } else {
          naoEssenciais += t.valor;
        }
        
        // Fatura apenas do mês selecionado
        if (t.metodoPagamento === 'CartaoCredito' && t.cartaoId) {
          faturasPorCartao[t.cartaoId] = (faturasPorCartao[t.cartaoId] || 0) + t.valor;
        }
      }
    });

    const sobra = entradas - (essenciais + naoEssenciais);
    const reservaIdeal = essenciais * 6;

    // Agora o React devolve tudo o que a página de Cartões precisava
    return { entradas, essenciais, naoEssenciais, sobra, reservaIdeal, gastosPorCartao, faturasPorCartao };
  }, [transacoes, transacoesDoMes]);

  // 5. AÇÕES
  const adicionarTransacao = async (nova: Omit<Transacao, 'id'>) => {
    const novaTransacao: Transacao = {
      ...nova,
      id: crypto.randomUUID(),
    };
    setTransacoes((prev) => [novaTransacao, ...prev]);
  };

  const deletarTransacao = (id: string) => {
    setTransacoes((prev) => prev.filter((t) => t.id !== id));
  };

  return {
    transacoes: transacoesDoMes,
    loading,
    resumoFinanceiro,
    adicionarTransacao,
    deletarTransacao
  };
}