'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartoes } from '@/hooks/useCartoes';
import { useTransactions } from '@/hooks/useTransactions'; 
import { useSettings } from '@/contexts/SettingsContext';
import { MonthCarousel } from '@/components/layout/MonthCarousel';
import { Plus, Trash2, Edit2, CreditCard, Calendar, FileText, X } from 'lucide-react';

export default function CartoesPage() {
  const { cartoes, loadingCartoes, adicionarCartao, editarCartao, deletarCartao } = useCartoes();
  const { resumoFinanceiro } = useTransactions(); 
  const { traduzir, isMounted } = useSettings();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cartaoEmEdicao, setCartaoEmEdicao] = useState<any>(null);

  if (!isMounted) return null;

  const formatarMoeda = (valor: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

  const abrirModalNovo = () => { setCartaoEmEdicao(null); setIsModalOpen(true); };
  const abrirModalEditar = (cartao: any) => { setCartaoEmEdicao(cartao); setIsModalOpen(true); };

  // Função 100% tipada para agradar o TypeScript e o Banco de Dados
  const handleSalvarCartao = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Calcula o fechamento automaticamente (7 dias antes do vencimento)
    const vencimento = Number(formData.get('diaVencimento'));
    const fechamento = vencimento - 7 > 0 ? vencimento - 7 : 25;

    const payload = {
      nome: formData.get('nome') as string,
      limiteTotal: Number(formData.get('limiteTotal')),
      diaVencimento: vencimento,
      diaFechamento: fechamento,
      bandeira: formData.get('bandeira') as "Mastercard" | "Visa" | "Elo" | "Amex" | "Outra",
      cor: formData.get('cor') as string,
    };

    if (cartaoEmEdicao) {
      await editarCartao(cartaoEmEdicao.id, payload);
    } else {
      await adicionarCartao(payload);
    }
    
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      <section className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold tracking-tight">{traduzir('cartoes')}</h2>
            <p className="text-foreground/50">Gerencie seus limites e preveja faturas futuras.</p>
          </div>
          <button onClick={abrirModalNovo} className="bg-foreground text-background px-6 py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] shadow-md focus-ring">
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
          <button onClick={abrirModalNovo} className="bg-foreground text-background px-6 py-2.5 mt-4 rounded-full font-bold text-sm">Adicionar Cartão</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {cartoes.map((cartao) => {
              const limiteUsado = resumoFinanceiro?.gastosPorCartao?.[cartao.id] || 0; 
              const faturaDoMes = resumoFinanceiro?.faturasPorCartao?.[cartao.id] || 0; 
              const limiteDisponivel = cartao.limiteTotal - limiteUsado;
              const percentualUso = cartao.limiteTotal > 0 ? (limiteUsado / cartao.limiteTotal) * 100 : 0;
              let corBarra = percentualUso > 80 ? 'bg-destructive' : percentualUso > 50 ? 'bg-warning' : 'bg-success';

              return (
                <motion.div key={cartao.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="glass p-1 rounded-3xl border border-border group relative">
                  <div className="w-full h-44 rounded-[1.3rem] p-5 flex flex-col justify-between text-white shadow-md relative overflow-hidden" style={{ backgroundColor: cartao.cor }}>
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                    
                    <div className="flex justify-between items-start relative z-10">
                      <div>
                        <h3 className="font-bold tracking-wider text-lg">{cartao.nome}</h3>
                        <p className="text-xs opacity-70 mt-0.5 flex items-center gap-1"><Calendar size={12} /> Vence dia {cartao.diaVencimento}</p>
                      </div>
                      <span className="font-display italic font-bold text-lg opacity-90">{cartao.bandeira}</span>
                    </div>

                    <div className="relative z-10 flex justify-between items-end">
                      <div>
                        <p className="text-[10px] uppercase opacity-70 mb-0.5 font-bold tracking-widest">Limite Disponível</p>
                        <p className="font-display font-bold text-2xl">{formatarMoeda(limiteDisponivel)}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => abrirModalEditar(cartao)} className="p-2 bg-black/20 hover:bg-white/20 rounded-xl backdrop-blur-md transition-colors opacity-100 md:opacity-0 group-hover:opacity-100"><Edit2 size={16} /></button>
                        <button onClick={() => deletarCartao(cartao.id)} className="p-2 bg-black/20 hover:bg-red-500/80 rounded-xl backdrop-blur-md transition-colors opacity-100 md:opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>

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
                        <span className={`text-xs font-bold ${percentualUso > 80 ? 'text-destructive' : percentualUso > 50 ? 'text-warning' : 'text-success'}`}>{percentualUso.toFixed(1)}%</span>
                      </div>
                      <div className="h-2 w-full bg-foreground/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(percentualUso, 100)}%` }} transition={{ duration: 1 }} className={`h-full rounded-full ${corBarra}`} />
                      </div>
                      <div className="flex justify-between text-[10px] font-bold text-foreground/40">
                        <span>Comprometido: {formatarMoeda(limiteUsado)}</span>
                        <span>Total: {formatarMoeda(cartao.limiteTotal)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* MODAL EMBUTIDO: CRIAR/EDITAR CARTÃO */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="w-full max-w-md bg-background border border-border rounded-3xl p-6 shadow-2xl relative z-10 glass">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-display text-xl font-bold">{cartaoEmEdicao ? 'Editar Cartão' : 'Novo Cartão'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-foreground/5 rounded-full"><X size={18} /></button>
              </div>

              <form onSubmit={handleSalvarCartao} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-foreground/60 block mb-1">Nome (Apelido)</label>
                  <input name="nome" defaultValue={cartaoEmEdicao?.nome} required placeholder="Ex: Black Principal" className="w-full bg-foreground/5 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-foreground/60 block mb-1">Limite Total (R$)</label>
                    <input name="limiteTotal" defaultValue={cartaoEmEdicao?.limiteTotal} type="number" step="0.01" required placeholder="0.00" className="w-full bg-foreground/5 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground/60 block mb-1">Vencimento (Dia)</label>
                    <input name="diaVencimento" defaultValue={cartaoEmEdicao?.diaVencimento} type="number" min="1" max="31" required placeholder="10" className="w-full bg-foreground/5 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-foreground/60 block mb-1">Bandeira</label>
                    <select name="bandeira" defaultValue={cartaoEmEdicao?.bandeira || "Mastercard"} className="w-full bg-foreground/5 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary">
                      <option value="Mastercard">Mastercard</option>
                      <option value="Visa">Visa</option>
                      <option value="Elo">Elo</option>
                      <option value="Amex">Amex</option>
                      <option value="Outra">Outra</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground/60 block mb-1">Cor do Cartão</label>
                    <input name="cor" defaultValue={cartaoEmEdicao?.cor || "#1a1a1a"} type="color" className="w-full h-[46px] bg-foreground/5 border border-border rounded-xl cursor-pointer p-1" />
                  </div>
                </div>
                <button type="submit" className="w-full mt-2 bg-primary text-primary-foreground font-bold text-sm py-3.5 rounded-xl hover:scale-[1.02] transition-all">
                  {cartaoEmEdicao ? 'Salvar Alterações' : 'Adicionar Cartão'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}