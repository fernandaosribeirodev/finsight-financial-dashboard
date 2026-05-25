'use client';

import { useState, useEffect } from 'react';
import { CartaoCredito, NovoCartao } from '@/types';

export function useCartoes() {
  const [cartoes, setCartoes] = useState<CartaoCredito[]>([]);
  const [loadingCartoes, setLoadingCartoes] = useState(true);

  // 1. HIDRATAÇÃO SEGURA: Busca os cartões salvos no navegador ao abrir
  useEffect(() => {
    const dadosSalvos = localStorage.getItem('@FinSight:cartoes');
    if (dadosSalvos) {
      setCartoes(JSON.parse(dadosSalvos));
    }
    setLoadingCartoes(false);
  }, []);

  // 2. PERSISTÊNCIA: Salva no localStorage sempre que houver alteração
  useEffect(() => {
    if (!loadingCartoes) {
      localStorage.setItem('@FinSight:cartoes', JSON.stringify(cartoes));
    }
  }, [cartoes, loadingCartoes]);

  const adicionarCartao = async (novo: NovoCartao) => {
    const novoCartao = {
      ...novo,
      id: crypto.randomUUID(), // ID único gerado no navegador
      createdAt: new Date().toISOString(),
    } as CartaoCredito;
    
    setCartoes((prev) => [...prev, novoCartao]);
  };

  const deletarCartao = async (id: string) => {
    setCartoes((prev) => prev.filter((c) => c.id !== id));
  };

  const editarLimite = async (id: string, novoLimite: number) => {
    setCartoes((prev) => 
      prev.map((c) => c.id === id ? { ...c, limiteTotal: novoLimite } : c)
    );
  };

  return { 
    cartoes, 
    loadingCartoes, 
    adicionarCartao, 
    deletarCartao,
    editarLimite
  };
}