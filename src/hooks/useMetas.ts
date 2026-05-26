'use client';

import { useState, useEffect } from 'react';

export interface MetaFinanceira {
  id: string;
  titulo: string;
  valorAlvo: number;
  valorAtual: number;
  dataAlvo: string;
  icone: string;
}

export function useMetas() {
  const [metas, setMetas] = useState<MetaFinanceira[]>([]);
  const [loadingMetas, setLoadingMetas] = useState(true);

  useEffect(() => {
    const salvos = localStorage.getItem('@FinSight:metas');
    if (salvos) setMetas(JSON.parse(salvos));
    setLoadingMetas(false);
  }, []);

  useEffect(() => {
    if (!loadingMetas) localStorage.setItem('@FinSight:metas', JSON.stringify(metas));
  }, [metas, loadingMetas]);

  const adicionarMeta = async (nova: Omit<MetaFinanceira, 'id'>) => {
    setMetas(prev => [{ ...nova, id: crypto.randomUUID() }, ...prev]);
  };

  const editarMeta = async (id: string, dadosAtualizados: Partial<MetaFinanceira>) => {
    setMetas(prev => prev.map(m => m.id === id ? { ...m, ...dadosAtualizados } : m));
  };

  const deletarMeta = (id: string) => {
    setMetas(prev => prev.filter(m => m.id !== id));
  };

  const atualizarProgresso = async (id: string, novoValor: number) => {
    setMetas(prev => prev.map(m => m.id === id ? { ...m, valorAtual: novoValor } : m));
  };

  return { 
    metas, 
    loadingMetas, 
    adicionarMeta, 
    editarMeta, 
    deletarMeta, 
    atualizarProgresso 
  };
}