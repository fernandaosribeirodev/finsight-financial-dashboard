'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MetaFinanceira, NovaMeta } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export function useMetas() {
  const { user } = useAuth();
  const [metas, setMetas] = useState<MetaFinanceira[]>([]);
  const [loadingMetas, setLoadingMetas] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setMetas([]);
      setLoadingMetas(false);
      return;
    }

    setLoadingMetas(true);
    
    // Busca as metas do usuário
    const q = query(
      collection(db, 'users', user.uid, 'metas'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dados = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MetaFinanceira[];

      setMetas(dados);
      setLoadingMetas(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const adicionarMeta = async (nova: NovaMeta) => {
    if (!user?.uid) return;
    
    await addDoc(collection(db, 'users', user.uid, 'metas'), {
      ...nova,
      userId: user.uid,
      createdAt: new Date().toISOString()
    });
  };

  const atualizarProgresso = async (id: string, novoValor: number) => {
    if (!user?.uid) return;
    await updateDoc(doc(db, 'users', user.uid, 'metas', id), {
      valorAtual: novoValor
    });
  };

  const deletarMeta = async (id: string) => {
    if (!user?.uid) return;
    await deleteDoc(doc(db, 'users', user.uid, 'metas', id));
  };

  return { 
    metas, 
    loadingMetas, 
    adicionarMeta, 
    atualizarProgresso,
    deletarMeta 
  };
}