'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartoes } from '@/hooks/useCartoes';
import { useTransactions } from '@/hooks/useTransactions'; 
import { useSettings } from '@/contexts/SettingsContext'; // 1. Hook Global de Traduções
import { CartaoModal } from '@/components/cartoes/CartaoModal';
import { MonthCarousel } from '@/components/layout/MonthCarousel';
import { Plus, Trash2, CreditCard, AlertCircle, Calendar, FileText } from 'lucide-react';

export default function CartoesPage() {
  const { cartoes, loadingCartoes, adicionarCartao, deletarCartao } = useCartoes();
  const { resumoFinanceiro } = useTransactions(); 
  const { traduzir, isMounted } = useSettings(); // 2. Funções do Dicionário
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Evita flash de conteúdo antes de carregar o idioma salvo
  if (!isMounted) return null;

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      {/* CABEÇALHO COM O CARROSSEL E TRADUÇÃO */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            {/* 3. Traduzindo os Textos Principais */}
            <h2 className="text-3xl font-display font-bold tracking-tight">{traduzir('cartoes')}</h2>
            <p className="text-foreground/50">Gerencie seus limites e preveja faturas futuras.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-foreground text-background px-6 py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-md focus-ring"
          >
            <Plus size={18} /> Novo Cartão
          </button>
        </div>
        
        <MonthCarousel />
      </section>

      {loadingCartoes ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <div key={i} className="h-64 glass rounded-3xl animate-pulse" />)}
        </div>
      ) : cartoes.length === 0 ? (
        <div className="glass rounded-3xl p-16 text-center flex flex-col items-center border-dashed border-2">
          <CreditCard size={48} className="text-foreground/20 mb-4" />
          <h3 className="text-xl font-bold mb-2">Nenhum cartão cadastrado</h3>
          <p className="text-foreground/50 max-w-md mb-6">Cadastre seus cartões de crédito para acompanhar faturas e evitar que os juros destruam seu orçamento.</p>
          <button onClick={() => setIsModalOpen(true)} className="bg-foreground text-background px-6 py-2.5 rounded-full font-bold text-sm">Adicionar Cartão</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {cartoes.map((cartao) => {
              // PROTEÇÃO ANTI-CRASH E ACESSO SEGURO
              const limiteUsado = resumoFinanceiro?.gastosPorCartao?.[cartao.id] || 0; 
              const faturaDoMes = resumoFinanceiro?.faturasPorCartao?.[cartao.id] || 0; 
              
              const limiteDisponivel = cartao.limiteTotal - limiteUsado;
              const percentualUso = cartao.limiteTotal > 0 ? (limiteUsado / cartao.limiteTotal) * 100 : 0;

              let corBarra = 'bg-success';
              if (percentualUso > 50) corBarra = 'bg-warning';
              if (percentualUso > 80) corBarra = 'bg-destructive';

              return (
                <motion.div key={cartao.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="glass p-1 rounded-3xl border border-border group relative">
                  
                  {/* O Cartão Visual */}
                  <div 
                    className="w-full h-44 rounded-[1.3rem] p-5 flex flex-col justify-between text-white shadow-md relative overflow-hidden transition-transform duration-300 hover:scale-[1.02]"
                    style={{ backgroundColor: cartao.cor }}
                  >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                    
                    <div className="flex justify-between items-start relative z-10">
                      <div>
                        <h3 className="font-bold tracking-wider text-lg">{cartao.nome}</h3>
                        <p className="text-xs opacity-70 mt-0.5 flex items-center gap-1">
                          <Calendar size={12} /> Vence dia {cartao.diaVencimento}
                        </p>
                      </div>
                      <span className="font-display italic font-bold text-lg opacity-90">{cartao.bandeira}</span>
                    </div>

                    <div className="relative z-10 flex justify-between items-end">
                      <div>
                        <p className="text-[10px] uppercase opacity-70 mb-0.5 font-bold tracking-widest">Limite Disponível</p>
                        <p className="font-display font-bold text-2xl">{formatarMoeda(limiteDisponivel)}</p>
                      </div>
                      <button onClick={() => deletarCartao(cartao.id)} className="p-2 bg-black/20 hover:bg-red-500/80 rounded-xl backdrop-blur-md transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Dashboard Interno do Cartão */}
                  <div className="p-5 pt-4 space-y-4">
                    
                    <div className="flex items-center justify-between p-3 rounded-xl bg-foreground/5 border border-border">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-foreground/50" />
                        <span className="text-xs font-bold uppercase tracking-wider text-foreground/60">Fatura Prevista</span>
                      </div>
                      <span className="font-display font-bold text-lg">{formatarMoeda(faturaDoMes)}</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">Uso do Limite Total</span>
                        <span className={`text-xs font-bold ${percentualUso > 80 ? 'text-destructive' : percentualUso > 50 ? 'text-warning' : 'text-success'}`}>
                          {percentualUso.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-foreground/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(percentualUso, 100)}%` }} transition={{ duration: 1 }} className={`h-full rounded-full ${corBarra}`} />
                      </div>
                      <div className="flex justify-between text-[10px] font-bold text-foreground/40">
                        <span>Comprometido: {formatarMoeda(limiteUsado)}</span>
                        <span>Total: {formatarMoeda(cartao.limiteTotal)}</span>
                      </div>
                    </div>

                    {percentualUso > 80 && (
                      <div className="p-3 bg-destructive/10 text-destructive rounded-xl text-xs font-medium flex items-start gap-2">
                        <AlertCircle size={14} className="shrink-0 mt-0.5" />
                        <p>Seu uso está acima de 80%. Risco alto de endividamento.</p>
                      </div>
                    )}
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <CartaoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={async (data) => await adicionarCartao(data)} />
    </div>
  );
}