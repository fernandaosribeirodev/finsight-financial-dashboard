'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CartaoCredito, NovoCartao } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export function useCartoes() {
  const { user } = useAuth();
  const [cartoes, setCartoes] = useState<CartaoCredito[]>([]);
  const [loadingCartoes, setLoadingCartoes] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setCartoes([]);
      setLoadingCartoes(false);
      return;
    }

    setLoadingCartoes(true);
    
    const q = query(
      collection(db, 'users', user.uid, 'cartoes'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dados = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CartaoCredito[];

      setCartoes(dados);
      setLoadingCartoes(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const adicionarCartao = async (novo: NovoCartao) => {
    if (!user?.uid) return;
    
    await addDoc(collection(db, 'users', user.uid, 'cartoes'), {
      ...novo,
      userId: user.uid,
      createdAt: new Date().toISOString()
    });
  };

  const deletarCartao = async (id: string) => {
    if (!user?.uid) return;
    await deleteDoc(doc(db, 'users', user.uid, 'cartoes', id));
  };

  const editarLimite = async (id: string, novoLimite: number) => {
    if (!user?.uid) return;
    await updateDoc(doc(db, 'users', user.uid, 'cartoes', id), {
      limiteTotal: novoLimite
    });
  };

  return { 
    cartoes, 
    loadingCartoes, 
    adicionarCartao, 
    deletarCartao,
    editarLimite
  };
}