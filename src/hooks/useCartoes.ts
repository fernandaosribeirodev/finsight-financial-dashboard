'use client';

import { useState, useEffect } from 'react';
import { CartaoCredito, NovoCartao } from '@/types';

export function useCartoes() {
  const [cartoes, setCartoes] = useState<CartaoCredito[]>([]);
  const [loadingCartoes, setLoadingCartoes] = useState(true);

  useEffect(() => {
    const dadosSalvos = localStorage.getItem('@FinSight:cartoes');
    if (dadosSalvos) setCartoes(JSON.parse(dadosSalvos));
    setLoadingCartoes(false);
  }, []);

  useEffect(() => {
    if (!loadingCartoes) localStorage.setItem('@FinSight:cartoes', JSON.stringify(cartoes));
  }, [cartoes, loadingCartoes]);

  const adicionarCartao = async (novo: NovoCartao) => {
    const novoCartao = {
      ...novo,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    } as CartaoCredito;
    setCartoes((prev) => [...prev, novoCartao]);
  };

  const editarCartao = async (id: string, dadosAtualizados: Partial<CartaoCredito>) => {
    setCartoes((prev) => prev.map((c) => c.id === id ? { ...c, ...dadosAtualizados } : c));
  };

  const deletarCartao = async (id: string) => {
    setCartoes((prev) => prev.filter((c) => c.id !== id));
  };

  return { cartoes, loadingCartoes, adicionarCartao, editarCartao, deletarCartao };
}