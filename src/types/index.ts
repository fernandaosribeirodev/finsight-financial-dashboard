
export interface Transacao {
  id: string;
  userId: string;
  titulo: string;
  valor: number; // Se for Cartão, representa o Valor TOTAL da compra
  tipo: 'Entrada' | 'Saida';
  categoria: 'Essencial' | 'Não Essencial' | null;
  tag: string;
  data: string; // Formato: "YYYY-MM-DD"
  
  // --- INTEGRAÇÃO COM CARTÕES (FINTECH ENGINE) ---
  metodoPagamento?: 'Pix/Dinheiro' | 'CartaoCredito';
  cartaoId?: string | null;
  parcelas?: number;
  valorParcela?: number;      // NOVO: Facilita o cálculo do motor
  mesInicialFatura?: string;  // NOVO: "YYYY-MM" para saber quando começa a cobrar
  
  createdAt: string;
}

export type NovaTransacao = Omit<Transacao, 'id' | 'createdAt' | 'userId'>;

export interface MetaFinanceira {
  id: string;
  userId: string;
  titulo: string;
  valorAlvo: number;
  valorAtual: number;
  dataAlvo: string;
  icone: string;
  createdAt: string;
}

export type NovaMeta = Omit<MetaFinanceira, 'id' | 'createdAt' | 'userId'>;


export interface CartaoCredito {
  id: string;
  userId: string;
  nome: string;           
  bandeira: 'Mastercard' | 'Visa' | 'Elo' | 'Amex' | 'Outra';
  limiteTotal: number;
  diaFechamento: number;  
  diaVencimento: number;  
  cor: string;            
  createdAt: string;
}

export type NovoCartao = Omit<CartaoCredito, 'id' | 'createdAt' | 'userId'>;