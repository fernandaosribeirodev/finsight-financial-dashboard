
// TRANSAÇÕES 
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
  valorParcela?: number;      
  mesInicialFatura?: string;  
  
  createdAt: string;
}

export type NovaTransacao = Omit<Transacao, 'id' | 'createdAt' | 'userId'>;
// METAS FINANCEIRAS

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

// CARTÕES DE CRÉDITO

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

// INVESTIMENTOS (CARTEIRA DE ATIVOS) - NOVO!

export interface AtivoInvestimento {
  id: string;
  userId: string;
  ticker: string;             // Ex: PETR4, MXRF11, IVVB11
  nomeEmpresa?: string;       // Ex: Petrobras PN
  quantidade: number;         // Quantidade total acumulada
  precoMedio: number;         // Preço médio pago por cota
  tipoAtivo: 'Ações' | 'FIIs' | 'ETFs' | 'Cripto' | 'Renda Fixa';
  dataUltimaCompra: string;   // Formato "YYYY-MM-DD"
  createdAt: string;
}

export type NovoAtivo = Omit<AtivoInvestimento, 'id' | 'createdAt' | 'userId'>;

// Interface para as cotações que chegam da API externa em tempo real
export interface CotacaoAtivo {
  ticker: string;
  nomeEmpresa: string;
  precoAtual: number;
  variacaoDia: number; // Percentual de subida ou descida (Ex: 1.5 ou -0.8)
}