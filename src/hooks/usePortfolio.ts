'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AtivoInvestimento, NovoAtivo } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { buscarCotacoesMercado } from '@/services/marketDataService';

// Tipagem do ativo já com os cálculos de lucro/prejuízo fundidos
export interface AtivoEnriquecido extends AtivoInvestimento {
  precoAtual: number;
  saldoAtual: number;           // quantidade * precoAtual
  valorInvestido: number;       // quantidade * precoMedio
  lucroPrejuizoValor: number;   // saldoAtual - valorInvestido
  lucroPrejuizoPercent: number; // (lucroPrejuizoValor / valorInvestido) * 100
  variacaoDia: number;
  nomeEmpresa: string;
}

export function usePortfolio() {
  const { user } = useAuth();
  
  // 1. ESTADO LOCAL DO FIREBASE (O que o usuário comprou)
  const [ativosFirebase, setAtivosFirebase] = useState<AtivoInvestimento[]>([]);
  const [loadingFirebase, setLoadingFirebase] = useState(true);

  // Busca os dados do Firebase em tempo real
  useEffect(() => {
    if (!user?.uid) {
      setAtivosFirebase([]);
      setLoadingFirebase(false);
      return;
    }

    setLoadingFirebase(true);
    const q = query(collection(db, 'users', user.uid, 'investimentos'), orderBy('ticker', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dados = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AtivoInvestimento[];
      setAtivosFirebase(dados);
      setLoadingFirebase(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // 2. EXTRAÇÃO DE TICKERS ÚNICOS
  // Precisamos saber quais ativos o usuário tem para pedir apenas esses preços à API
  const tickersUnicos = useMemo(() => {
    return Array.from(new Set(ativosFirebase.map((ativo) => ativo.ticker)));
  }, [ativosFirebase]);

  // 3. REACT QUERY: INTEGRAÇÃO DE API COM CACHE
  // Só faz a requisição se o usuário tiver ativos (tickersUnicos.length > 0)
  const { data: cotacoesDeMercado, isLoading: loadingApi, isError } = useQuery({
    queryKey: ['marketData', tickersUnicos],
    queryFn: () => buscarCotacoesMercado(tickersUnicos),
    enabled: tickersUnicos.length > 0, 
  });

  // 4. ENGINE FINANCEIRA: FUNDINDO FIREBASE + API
  const { ativosEnriquecidos, resumoCarteira } = useMemo(() => {
    let totalInvestido = 0;
    let patrimonioTotal = 0;

    const enriquecidos: AtivoEnriquecido[] = ativosFirebase.map((ativo) => {
      // Procura a cotação atual na resposta da API
      const cotacao = cotacoesDeMercado?.find(c => c.ticker === ativo.ticker);
      
      const precoAtual = cotacao?.precoAtual || ativo.precoMedio; // Fallback para preço médio se a API falhar
      const variacaoDia = cotacao?.variacaoDia || 0;
      const nomeEmpresa = cotacao?.nomeEmpresa || ativo.ticker;

      const valorInvestido = ativo.quantidade * ativo.precoMedio;
      const saldoAtual = ativo.quantidade * precoAtual;
      const lucroPrejuizoValor = saldoAtual - valorInvestido;
      const lucroPrejuizoPercent = valorInvestido > 0 ? (lucroPrejuizoValor / valorInvestido) * 100 : 0;

      // Soma para o resumo geral da carteira
      totalInvestido += valorInvestido;
      patrimonioTotal += saldoAtual;

      return {
        ...ativo,
        precoAtual,
        saldoAtual,
        valorInvestido,
        lucroPrejuizoValor,
        lucroPrejuizoPercent,
        variacaoDia,
        nomeEmpresa
      };
    });

    const lucroTotalCarteira = patrimonioTotal - totalInvestido;
    const rentabilidadeTotalPercent = totalInvestido > 0 ? (lucroTotalCarteira / totalInvestido) * 100 : 0;

    return {
      ativosEnriquecidos: enriquecidos,
      resumoCarteira: {
        totalInvestido,
        patrimonioTotal,
        lucroTotalCarteira,
        rentabilidadeTotalPercent
      }
    };
  }, [ativosFirebase, cotacoesDeMercado]);

  // 5. FUNÇÕES CRUD
  const adicionarAtivo = async (novo: NovoAtivo) => {
    if (!user?.uid) return;
    await addDoc(collection(db, 'users', user.uid, 'investimentos'), {
      ...novo,
      userId: user.uid,
      createdAt: new Date().toISOString()
    });
  };

  const deletarAtivo = async (id: string) => {
    if (!user?.uid) return;
    await deleteDoc(doc(db, 'users', user.uid, 'investimentos', id));
  };

  return {
    ativos: ativosEnriquecidos,
    resumoCarteira,
    loading: loadingFirebase || (loadingApi && tickersUnicos.length > 0),
    isError,
    adicionarAtivo,
    deletarAtivo
  };
}