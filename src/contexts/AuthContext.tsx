'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/navigation';

// Definimos o que o nosso contexto vai entregar para o resto do site
interface AuthContextType {
  user: User | null;      // O usuário logado (ou null se estiver deslogado)
  loading: boolean;       // Diz se o Firebase ainda está checando a sessão
  logout: () => Promise<void>; // Função para deslogar de qualquer lugar do site
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Esse "onAuthStateChanged" é um olheiro do Firebase. 
    // Ele checa automaticamente se o usuário já tinha feito login antes,
    // mantendo a sessão salva mesmo se der F5 na página.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Criamos um Hook customizado para facilitar a chamada do contexto em outros arquivos
export const useAuth = () => useContext(AuthContext);