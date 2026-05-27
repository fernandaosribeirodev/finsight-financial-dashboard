'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTransactions } from '@/hooks/useTransactions';
import { useCartoes } from '@/hooks/useCartoes';
import { MonthCarousel } from '@/components/layout/MonthCarousel';
import { useSettings } from '@/contexts/SettingsContext';
import { 
  ArrowUpRight, ArrowDownRight, Wallet, Plus, 
  Trash2, Edit2, ShieldAlert, Target, LayoutGrid, X
} from 'lucide-react';

export default function Dashboard() {
  const { transacoes, loading, resumoFinanceiro, adicionarTransacao, editarTransacao, deletarTransacao } = useTransactions();
  const { cartoes } = useCartoes();
  const { traduzir, isMounted } = useSettings();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transacaoEmEdicao, setTransacaoEmEdicao] = useState<any>(null);

  if (!isMounted) return null;

  const formatarMoeda = (valor: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  const percentualEssencial = resumoFinanceiro.entradas > 0 ? Math.round((resumoFinanceiro.essenciais / resumoFinanceiro.entradas) * 100) : 0;

  const abrirModalNova = () => { setTransacaoEmEdicao(null); setIsModalOpen(true); };
  const abrirModalEditar = (t: any) => { setTransacaoEmEdicao(t); setIsModalOpen(true); };

  const handleSalvarTransacao = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      titulo: formData.get('titulo') as string,
      valor: Number(formData.get('valor')),
      tipo: formData.get('tipo') as any,
      categoria: formData.get('categoria') as string,
      metodoPagamento: formData.get('metodoPagamento') as string,
      cartaoId: (formData.get('cartaoId') as string) || undefined,
      data: formData.get('data') as string,
      tag: 'Geral'
    };

    if (transacaoEmEdicao) await editarTransacao(transacaoEmEdicao.id, payload);
    else await adicionarTransacao(payload);
    
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      <section className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold tracking-tight">{traduzir('visGeral')}</h2>
            <p className="text-foreground/50">{traduzir('dashSub')}</p>
          </div>
          <button onClick={abrirModalNova} className="bg-foreground text-background px-6 py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-md focus-ring">
            <Plus size={18} /> {traduzir('btnAddCompra')}
          </button>
        </div>
        <MonthCarousel />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass p-5 rounded-3xl border border-border flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <div className="p-2.5 rounded-xl bg-success/10 text-success"><ArrowUpRight size={20} /></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">{traduzir('entradasMes')}</span>
          </div>
          <div>{loading ? <div className="h-7 bg-foreground/10 animate-pulse rounded w-3/4" /> : <h3 className="text-2xl font-display font-bold text-success">{formatarMoeda(resumoFinanceiro.entradas)}</h3>}</div>
        </div>
        <div className="glass p-5 rounded-3xl border border-border flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary"><ShieldAlert size={20} /></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">{traduzir('essencial')}</span>
          </div>
          <div>{loading ? <div className="h-7 bg-foreground/10 animate-pulse rounded w-3/4" /> : <h3 className="text-2xl font-display font-bold">{formatarMoeda(resumoFinanceiro.essenciais)}</h3>}</div>
        </div>
        <div className="glass p-5 rounded-3xl border border-border flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <div className="p-2.5 rounded-xl bg-warning/10 text-warning"><ArrowDownRight size={20} /></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">{traduzir('naoEssencial')}</span>
          </div>
          <div>{loading ? <div className="h-7 bg-foreground/10 animate-pulse rounded w-3/4" /> : <h3 className="text-2xl font-display font-bold">{formatarMoeda(resumoFinanceiro.naoEssenciais)}</h3>}</div>
        </div>
        <div className={`glass p-5 rounded-3xl border flex flex-col justify-between h-36 ${resumoFinanceiro.sobra >= 0 ? 'border-success/20 bg-success/5' : 'border-destructive/20 bg-destructive/5'}`}>
          <div className="flex justify-between items-start">
            <div className={`p-2.5 rounded-xl ${resumoFinanceiro.sobra >= 0 ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}><Wallet size={20} /></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">{traduzir('sobraPrevista')}</span>
          </div>
          <div>{loading ? <div className="h-7 bg-foreground/10 animate-pulse rounded w-3/4" /> : <h3 className={`text-2xl font-display font-bold ${resumoFinanceiro.sobra >= 0 ? 'text-success' : 'text-destructive'}`}>{formatarMoeda(resumoFinanceiro.sobra)}</h3>}</div>
        </div>
      </section>

      <section className="glass rounded-3xl p-6 border border-border">
        <div className="flex items-center gap-2 mb-6 text-foreground">
          <LayoutGrid size={18} className="text-foreground/70" />
          <h3 className="font-display text-lg font-bold">{traduzir('movimentos')}</h3>
        </div>

        <div className="space-y-2">
          {loading ? (
            <div className="h-16 border border-border rounded-2xl bg-foreground/[0.02] animate-pulse" />
          ) : transacoes.length === 0 ? (
            <div className="border border-dashed border-border rounded-2xl p-8 text-center flex flex-col items-center justify-center bg-foreground/[0.01]">
              <Target size={24} className="text-foreground/30 mb-3"/>
              <h4 className="font-bold text-sm">{traduzir('nenhumReg')}</h4>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {transacoes.map((t) => (
                <motion.div key={t.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="border border-border/40 hover:border-border rounded-2xl bg-background/50 p-3 px-5 flex items-center justify-between group transition-colors">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`p-2 rounded-xl shrink-0 ${t.tipo === 'Entrada' ? 'bg-success/10 text-success' : t.categoria === 'Essencial' ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'}`}>
                      {t.tipo === 'Entrada' ? <ArrowUpRight size={16}/> : t.categoria === 'Essencial' ? <ShieldAlert size={16}/> : <ArrowDownRight size={16}/>}
                    </div>
                    <div className="min-w-0 flex flex-col md:flex-row md:items-center md:gap-4">
                      <h4 className="text-sm font-bold truncate text-foreground/90 w-48">{t.titulo}</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-sm font-display font-bold tabular-nums mr-2 ${t.tipo === 'Entrada' ? 'text-success' : 'text-foreground'}`}>
                      {t.tipo === 'Saida' ? '-' : ''}{formatarMoeda(t.valor)}
                    </span>
                    <button onClick={() => abrirModalEditar(t)} className="p-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-primary/10 text-foreground/40 hover:text-primary rounded-lg transition-all"><Edit2 size={14} /></button>
                    <button onClick={() => deletarTransacao(t.id)} className="p-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-destructive/10 text-foreground/40 hover:text-destructive rounded-lg transition-all"><Trash2 size={14} /></button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </section>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="w-full max-w-md bg-background border border-border rounded-3xl p-6 shadow-2xl relative z-10 glass">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-display text-xl font-bold">{transacaoEmEdicao ? traduzir('editarLancamento') : traduzir('btnAddCompra')}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-foreground/5 rounded-full"><X size={18} /></button>
              </div>

              <form onSubmit={handleSalvarTransacao} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-foreground/60 block mb-1">{traduzir('Título')}</label>
                  <input name="titulo" defaultValue={transacaoEmEdicao?.titulo} required placeholder="Ex: Supermercado" className="w-full bg-foreground/5 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-foreground/60 block mb-1">{traduzir('Valor (R$)')}</label>
                    <input name="valor" defaultValue={transacaoEmEdicao?.valor} type="number" step="0.01" required placeholder="0.00" className="w-full bg-foreground/5 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground/60 block mb-1">{traduzir('Data')}</label>
                    <input name="data" defaultValue={transacaoEmEdicao?.data} type="date" required className="w-full bg-foreground/5 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary cursor-pointer" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-foreground/60 block mb-1">{traduzir('Tipo')}</label>
                    <select name="tipo" defaultValue={transacaoEmEdicao?.tipo || "Saida"} className="w-full bg-foreground/5 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary">
                      <option value="Saida">Saída (Despesa)</option>
                      <option value="Entrada">Entrada (Receita)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground/60 block mb-1">{traduzir('Categoria')}</label>
                    <select name="categoria" defaultValue={transacaoEmEdicao?.categoria || "Essencial"} className="w-full bg-foreground/5 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary">
                      <option value="Essencial">{traduzir('essencial')}</option>
                      <option value="Não Essencial">{traduzir('naoEssencial')}</option>
                      <option value="Renda">Renda Fixa/Salário</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground/60 block mb-1">{traduzir('Pagamento')}</label>
                  <select name="metodoPagamento" defaultValue={transacaoEmEdicao?.metodoPagamento || "Pix/Dinheiro"} className="w-full bg-foreground/5 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary">
                    <option value="Pix/Dinheiro">Pix / Dinheiro</option>
                    <option value="CartaoCredito">Cartão de Crédito</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-xs font-bold text-foreground/60 block mb-1">{traduzir('Cartão (Se crédito)')}</label>
                  <select name="cartaoId" defaultValue={transacaoEmEdicao?.cartaoId || ""} className="w-full bg-foreground/5 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary">
                    <option value="">Selecione...</option>
                    {cartoes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                  </select>
                </div>

                <button type="submit" className="w-full mt-2 bg-primary text-primary-foreground font-bold text-sm py-3.5 rounded-xl hover:scale-[1.02] transition-all">
                  {transacaoEmEdicao ? traduzir('editarLancamento') : traduzir('salvarLancamento')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}