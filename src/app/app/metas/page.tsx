'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMetas } from '@/hooks/useMetas';
import { useTransactions } from '@/hooks/useTransactions'; // Importamos as transações!
import { MetaModal } from '@/components/metas/MetaModal';
import { MetaFinanceira } from '@/types';
import { 
  Plus, Trash2, ShieldAlert, Plane, Home, Car, Target, 
  TrendingUp, CheckCircle2, Wallet, X, AlertCircle
} from 'lucide-react';

export default function MetasPage() {
  const { metas, loadingMetas, adicionarMeta, deletarMeta, atualizarProgresso } = useMetas();
  // Puxamos a "Sobra" calculada lá no Dashboard!
  const { resumoFinanceiro } = useTransactions(); 
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estados para o novo Modal de Adicionar Fundos
  const [metaSelecionada, setMetaSelecionada] = useState<MetaFinanceira | null>(null);
  const [valorInvestimento, setValorInvestimento] = useState('');

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  const getIcone = (tipo: string) => {
    switch (tipo) {
      case 'viagem': return <Plane size={20} />;
      case 'reserva': return <ShieldAlert size={20} />;
      case 'casa': return <Home size={20} />;
      case 'carro': return <Car size={20} />;
      default: return <Target size={20} />;
    }
  };

  const calcularGuardaMensal = (valorAlvo: number, valorAtual: number, dataAlvo: string) => {
    const hoje = new Date();
    const alvo = new Date(dataAlvo);
    const meses = (alvo.getFullYear() - hoje.getFullYear()) * 12 + (alvo.getMonth() - hoje.getMonth());
    const restante = valorAlvo - valorAtual;
    
    if (meses <= 0 || restante <= 0) return 0;
    return restante / meses;
  };

  // O Saldo Real que o usuário pode distribuir
  const saldoDisponivel = Math.max(0, resumoFinanceiro.sobra);

  const handleSalvarFundos = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!metaSelecionada || !valorInvestimento) return;

    const valor = Number(valorInvestimento);
    if (valor > 0 && valor <= saldoDisponivel) {
      await atualizarProgresso(metaSelecionada.id, metaSelecionada.valorAtual + valor);
      setMetaSelecionada(null);
      setValorInvestimento('');
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Metas e Caixinhas</h2>
          <p className="text-foreground/50">Dê nome ao seu dinheiro e acompanhe seus objetivos.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-md focus-ring"
        >
          <Plus size={18} /> Nova Meta
        </button>
      </section>

      {/* Card de Resumo de Saldo (Melhora a UX para ele saber quanto tem) */}
      <div className="glass p-4 rounded-2xl border border-border flex items-center justify-between max-w-md bg-background/50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-success/10 text-success"><Wallet size={20} /></div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Sobra do Mês (Livre)</p>
            <p className="text-lg font-bold text-success">{formatarMoeda(saldoDisponivel)}</p>
          </div>
        </div>
      </div>

      {loadingMetas ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <div key={i} className="h-64 glass rounded-3xl animate-pulse" />)}
        </div>
      ) : metas.length === 0 ? (
        <div className="glass rounded-3xl p-16 text-center flex flex-col items-center border-dashed border-2">
          <Target size={48} className="text-foreground/20 mb-4" />
          <h3 className="text-xl font-bold mb-2">Você ainda não tem metas</h3>
          <p className="text-foreground/50 max-w-md mb-6">O Primo Pobre diz que quem não sabe para onde quer ir, gasta dinheiro no meio do caminho. Crie sua primeira caixinha!</p>
          <button onClick={() => setIsModalOpen(true)} className="bg-foreground text-background px-6 py-2.5 rounded-full font-bold text-sm">Criar Meta</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {metas.map((meta) => {
              const porcentagem = Math.min(100, Math.round((meta.valorAtual / meta.valorAlvo) * 100));
              const concluido = porcentagem >= 100;
              const guardaMensal = calcularGuardaMensal(meta.valorAlvo, meta.valorAtual, meta.dataAlvo);

              return (
                <motion.div key={meta.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="glass p-6 rounded-3xl border border-border relative overflow-hidden group">
                  {concluido && <div className="absolute top-0 right-0 w-32 h-32 bg-success/20 rounded-full blur-3xl -mr-16 -mt-16" />}
                  
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className={`p-3 rounded-2xl ${concluido ? 'bg-success/20 text-success' : 'bg-primary/10 text-primary'}`}>
                      {concluido ? <CheckCircle2 size={24} /> : getIcone(meta.icone)}
                    </div>
                    <button onClick={() => deletarMeta(meta.id)} className="p-2 opacity-0 group-hover:opacity-100 text-foreground/40 hover:text-destructive transition-all"><Trash2 size={16} /></button>
                  </div>

                  <h3 className="text-lg font-bold mb-1">{meta.titulo}</h3>
                  <div className="flex justify-between items-end mb-4">
                    <span className="text-2xl font-display font-bold">{formatarMoeda(meta.valorAtual)}</span>
                    <span className="text-xs text-foreground/50 font-bold mb-1">de {formatarMoeda(meta.valorAlvo)}</span>
                  </div>

                  <div className="h-3 w-full bg-foreground/10 rounded-full overflow-hidden mb-2">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${porcentagem}%` }} transition={{ duration: 1 }} className={`h-full rounded-full ${concluido ? 'bg-success' : 'bg-primary'}`} />
                  </div>
                  
                  <div className="flex justify-between text-xs font-bold text-foreground/40 mb-6">
                    <span>{porcentagem}% concluído</span>
                    <span>Prazo: {new Date(meta.dataAlvo).toLocaleDateString('pt-BR')}</span>
                  </div>

                  {!concluido ? (
                    <div className="space-y-3 relative z-10">
                      {guardaMensal > 0 && (
                        <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-foreground/50 bg-foreground/5 p-2.5 rounded-xl">
                          <TrendingUp size={14} className="text-primary" /> Guarde {formatarMoeda(guardaMensal)}/mês
                        </div>
                      )}
                      {/* O BOTÃO AGORA CHAMA O NOSSO MODAL E NÃO MAIS O PROMPT */}
                      <button 
                        onClick={() => setMetaSelecionada(meta)} 
                        className="w-full py-2.5 rounded-xl border-2 border-primary text-primary font-bold text-sm hover:bg-primary/5 transition-colors"
                      >
                        Guardar Dinheiro
                      </button>
                    </div>
                  ) : (
                    <div className="w-full py-2.5 rounded-xl bg-success/10 text-success text-center font-bold text-sm relative z-10">
                      Meta Alcançada! 🎉
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* MODAL DE ADICIONAR FUNDOS (SUBSTITUTO DO PROMPT) */}
      <AnimatePresence>
        {metaSelecionada && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMetaSelecionada(null)} className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" />

            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="w-full max-w-md bg-background border border-border rounded-3xl p-6 shadow-2xl relative z-10 glass">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-display text-xl font-bold">Investir na Meta</h3>
                <button onClick={() => setMetaSelecionada(null)} className="p-2 hover:bg-foreground/5 rounded-full transition-colors text-foreground/50"><X size={18} /></button>
              </div>

              <div className="mb-6">
                <p className="text-sm text-foreground/60 mb-1">Destino</p>
                <p className="font-bold text-lg">{metaSelecionada.titulo}</p>
              </div>

              <form onSubmit={handleSalvarFundos} className="space-y-5">
                <div className="p-4 rounded-xl bg-foreground/5 border border-border flex justify-between items-center">
                  <span className="text-sm font-bold text-foreground/60">Saldo Disponível (Sobra)</span>
                  <span className="font-display font-bold text-success">{formatarMoeda(saldoDisponivel)}</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground/60 mb-2 block">Quanto você quer guardar hoje?</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    max={saldoDisponivel} // O HTML já bloqueia o usuário de digitar mais do que ele tem
                    value={valorInvestimento}
                    onChange={(e) => setValorInvestimento(e.target.value)}
                    placeholder="R$ 0,00" 
                    className="w-full bg-background border border-border rounded-xl px-4 py-4 text-2xl font-display font-bold focus-ring" 
                    autoFocus
                  />
                  {Number(valorInvestimento) > saldoDisponivel && (
                    <p className="text-xs text-destructive mt-2 flex items-center gap-1">
                      <AlertCircle size={14} /> Você não tem saldo suficiente (Sobra) para este valor.
                    </p>
                  )}
                  {saldoDisponivel === 0 && (
                    <p className="text-xs text-warning mt-2 flex items-center gap-1">
                      <AlertCircle size={14} /> Registre novas Entradas no seu painel para ter saldo.
                    </p>
                  )}
                </div>

                <button 
                  type="submit" 
                  disabled={!valorInvestimento || Number(valorInvestimento) <= 0 || Number(valorInvestimento) > saldoDisponivel} 
                  className="w-full bg-primary text-primary-foreground font-bold text-sm py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  Confirmar Investimento
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <MetaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={async (data) => await adicionarMeta(data)} />
    </div>
  );
}