'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function DemoPage() {
  const router = useRouter();

  useEffect(() => {
    // 1. Pega o mês atual para que os gráficos gerem dados corretos na tela
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mesNum = String(hoje.getMonth() + 1).padStart(2, '0');
    const mesAtual = `${ano}-${mesNum}`;

    // 2. Cria Cartões Realistas
    const mockCartoes = [
      {
        id: 'demo-card-1',
        nome: 'Black Premium',
        limiteTotal: 25000,
        diaVencimento: '10',
        bandeira: 'Mastercard',
        cor: '#1a1a1a', // Preto elegante
        createdAt: new Date().toISOString()
      },
      {
        id: 'demo-card-2',
        nome: 'Platinum Global',
        limiteTotal: 12000,
        diaVencimento: '25',
        bandeira: 'Visa',
        cor: '#4f46e5', // Indigo vibrante
        createdAt: new Date().toISOString()
      }
    ];

    // 3. Cria Transações Realistas
    const mockTransacoes = [
      {
        id: 'demo-tx-1',
        titulo: 'Salário Desenvolvedor Senior',
        valor: 14500,
        tipo: 'Entrada',
        categoria: 'Renda Fixa',
        tag: 'Salário',
        metodoPagamento: 'Pix/Dinheiro',
        data: `${mesAtual}-05`
      },
      {
        id: 'demo-tx-2',
        titulo: 'Aluguel & Condomínio',
        valor: 3500,
        tipo: 'Saida',
        categoria: 'Essencial',
        tag: 'Moradia',
        metodoPagamento: 'Pix/Dinheiro',
        data: `${mesAtual}-10`
      },
      {
        id: 'demo-tx-3',
        titulo: 'Supermercado Mensal',
        valor: 1850,
        tipo: 'Saida',
        categoria: 'Essencial',
        tag: 'Alimentação',
        metodoPagamento: 'CartaoCredito',
        cartaoId: 'demo-card-1',
        data: `${mesAtual}-12`
      },
      {
        id: 'demo-tx-4',
        titulo: 'Jantar Restaurante Fino',
        valor: 480,
        tipo: 'Saida',
        categoria: 'Não Essencial',
        tag: 'Lazer',
        metodoPagamento: 'CartaoCredito',
        cartaoId: 'demo-card-2',
        data: `${mesAtual}-15`
      },
      {
        id: 'demo-tx-5',
        titulo: 'Assinaturas (Netflix, Spotify)',
        valor: 120,
        tipo: 'Saida',
        categoria: 'Não Essencial',
        tag: 'Lazer',
        metodoPagamento: 'CartaoCredito',
        cartaoId: 'demo-card-1',
        data: `${mesAtual}-20`
      }
    ];

    // 4. Injeta a Mágica no Navegador do Utilizador
    localStorage.setItem('@FinSight:cartoes', JSON.stringify(mockCartoes));
    localStorage.setItem('@FinSight:transacoes', JSON.stringify(mockTransacoes));
    localStorage.setItem('@FinSight:tema', 'escuro'); // O modo Dark impressiona mais na Demo
    
    // 5. Espera 2 segundos para dar tempo de ler a mensagem e redireciona
    const timeout = setTimeout(() => {
      router.push('/app');
    }, 2000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-foreground">
      <Loader2 className="animate-spin text-primary mb-6" size={56} />
      <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-center px-4">
        Preparando o seu ambiente de demonstração...
      </h1>
      <p className="text-foreground/50 mt-3 text-center px-4 max-w-md">
        Estamos a injetar dados financeiros fictícios e a configurar a inteligência da interface para si.
      </p>
    </div>
  );
}