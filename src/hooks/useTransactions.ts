'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Transacao, NovaTransacao } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useMonth } from '@/contexts/MonthContext'; 

export function useTransactions() {
  const { user } = useAuth();
  const { activeMonth } = useMonth(); 
  
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);

  const [resumoFinanceiro, setResumoFinanceiro] = useState({
    entradas: 0,
    essenciais: 0,
    naoEssenciais: 0,
    sobra: 0,
    reservaIdeal: 0,
    gastosPorCartao: {} as Record<string, number>,
    faturasPorCartao: {} as Record<string, number> 
  });

  useEffect(() => {
    if (!user?.uid) {
      setTransacoes([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const q = query(collection(db, 'users', user.uid, 'transacoes'), orderBy('data', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dadosBrutos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Transacao[];

      let entradas = 0;
      let essenciais = 0;
      let naoEssenciais = 0;
      const gastosPorCartao: Record<string, number> = {};
      const faturasPorCartao: Record<string, number> = {};
      const transacoesDesteMes: Transacao[] = [];

      dadosBrutos.forEach((t) => {
        const valorTotal = Number(t.valor) || 0;
        const parcelas = Number(t.parcelas) || 1;
        const valorParcela = valorTotal / parcelas;

        const [anoStr, mesStr, diaStr] = t.data.split('-');
        const dataOriginal = new Date(Number(anoStr), Number(mesStr) - 1, Number(diaStr));

        // Analisando parcela por parcela no tempo
        for (let i = 0; i < parcelas; i++) {
          const dataProjetada = new Date(dataOriginal.getFullYear(), dataOriginal.getMonth() + i, 1);
          const mesProjetado = `${dataProjetada.getFullYear()}-${String(dataProjetada.getMonth() + 1).padStart(2, '0')}`;

          // LÓGICA CORRIGIDA: LIBERAÇÃO DE LIMITE INTELIGENTE
          // Se o mês da parcela for maior ou igual ao mês que estamos a ver, ela ainda é uma dívida!
          // Isso faz o limite ser libertado automaticamente nos meses futuros.
          if (t.metodoPagamento === 'CartaoCredito' && t.cartaoId) {
            // Comparamos strings de data (ex: "2026-08" >= "2026-05")
            if (mesProjetado >= activeMonth) {
              if (!gastosPorCartao[t.cartaoId]) gastosPorCartao[t.cartaoId] = 0;
              gastosPorCartao[t.cartaoId] += valorParcela;
            }
          }

          // Se a parcela cair EXATAMENTE no mês que o utilizador selecionou no Carrossel
          if (mesProjetado === activeMonth) {
            
            // 1. Soma na Fatura Deste Mês
            if (t.metodoPagamento === 'CartaoCredito' && t.cartaoId) {
              if (!faturasPorCartao[t.cartaoId]) faturasPorCartao[t.cartaoId] = 0;
              faturasPorCartao[t.cartaoId] += valorParcela;
            }

            // 2. Cria a Transação Visual para a Lista
            transacoesDesteMes.push({
              ...t,
              valor: valorParcela,
              titulo: parcelas > 1 ? `${t.titulo} (${i + 1}/${parcelas})` : t.titulo,
              id: parcelas > 1 ? `${t.id}-p${i+1}` : t.id
            });

            // 3. Impacta a "Sobra" Deste Mês
            if (t.tipo === 'Entrada') {
              entradas += valorParcela;
            } else {
              if (t.categoria === 'Essencial') essenciais += valorParcela;
              else if (t.categoria === 'Não Essencial') naoEssenciais += valorParcela;
            }
          }
        }
      });

      const sobra = entradas - (essenciais + naoEssenciais);
      const reservaIdeal = essenciais * 6;

      setResumoFinanceiro({ 
        entradas, 
        essenciais, 
        naoEssenciais, 
        sobra, 
        reservaIdeal, 
        gastosPorCartao,
        faturasPorCartao 
      });
      
      transacoesDesteMes.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
      
      setTransacoes(transacoesDesteMes);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid, activeMonth]);

  const adicionarTransacao = async (nova: NovaTransacao) => {
    if (!user?.uid) return;
    await addDoc(collection(db, 'users', user.uid, 'transacoes'), {
      ...nova,
      userId: user.uid,
      createdAt: new Date().toISOString()
    });
  };

  const deletarTransacao = async (id: string) => {
    if (!user?.uid) return;
    const idReal = id.split('-p')[0];
    await deleteDoc(doc(db, 'users', user.uid, 'transacoes', idReal));
  };

  return { transacoes, loading, resumoFinanceiro, adicionarTransacao, deletarTransacao };
}