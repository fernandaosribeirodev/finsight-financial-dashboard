'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTransactions } from '@/hooks/useTransactions';
import { TransactionModal } from '@/components/transactions/TransactionModal';
import { MonthCarousel } from '@/components/layout/MonthCarousel'; // <-- O CARROSSEL AQUI
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { 
  ArrowUpRight, ArrowDownRight, Wallet, Plus, 
  Trash2, ShieldAlert, Target, Sparkles, TrendingUp, Activity, LayoutGrid
} from 'lucide-react';

export default function Dashboard() {
  const { transacoes, loading, resumoFinanceiro, adicionarTransacao, deletarTransacao } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  const percentualEssencial = resumoFinanceiro.entradas > 0 
    ? Math.round((resumoFinanceiro.essenciais / resumoFinanceiro.entradas) * 100) 
    : 0;

  let corComprometimento = 'bg-success';
  let alertaTexto = 'Saudável';
  if (percentualEssencial > 50) { corComprometimento = 'bg-warning'; alertaTexto = 'Atenção'; }
  if (percentualEssencial > 70) { corComprometimento = 'bg-destructive'; alertaTexto = 'Perigo'; }

  const dadosGrafico = [
    { name: 'Essencial', value: resumoFinanceiro.essenciais, color: 'hsl(var(--primary))' },
    { name: 'Não Essencial', value: resumoFinanceiro.naoEssenciais, color: 'hsl(var(--warning))' },
    { name: 'Sobra', value: Math.max(0, resumoFinanceiro.sobra), color: 'hsl(var(--success))' }
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      
      {/* CABEÇALHO COM O SELETOR TEMPORAL */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold tracking-tight">Visão Geral</h2>
            <p className="text-foreground/50"> Seu controle financeiro inteligente.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-foreground text-background px-6 py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-100 transition-transform shadow-md focus-ring"
          >
            <Plus size={18} /> Adicionar Compra
          </button>
        </div>
        
        {/* MAGIA DO TEMPO AQUI */}
        <MonthCarousel />
      </section>

      {/* BLOCO 1: Cartões de Métricas (Recalculam sozinhos baseados no mês ativo!) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass p-5 rounded-3xl border border-border flex flex-col justify-between h-36 group hover:border-success/30 transition-colors">
          <div className="flex justify-between items-start">
            <div className="p-2.5 rounded-xl bg-success/10 text-success"><ArrowUpRight size={20} /></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Entradas Mês</span>
          </div>
          <div>
            {loading ? <div className="h-7 bg-foreground/10 animate-pulse rounded w-3/4" /> : <h3 className="text-2xl font-display font-bold text-success">{formatarMoeda(resumoFinanceiro.entradas)}</h3>}
          </div>
        </div>

        <div className="glass p-5 rounded-3xl border border-border flex flex-col justify-between h-36 group hover:border-primary/30 transition-colors">
          <div className="flex justify-between items-start">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary"><ShieldAlert size={20} /></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Essencial</span>
          </div>
          <div>
            {loading ? <div className="h-7 bg-foreground/10 animate-pulse rounded w-3/4" /> : <h3 className="text-2xl font-display font-bold">{formatarMoeda(resumoFinanceiro.essenciais)}</h3>}
          </div>
        </div>

        <div className="glass p-5 rounded-3xl border border-border flex flex-col justify-between h-36 group hover:border-warning/30 transition-colors">
          <div className="flex justify-between items-start">
            <div className="p-2.5 rounded-xl bg-warning/10 text-warning"><ArrowDownRight size={20} /></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Não Essencial</span>
          </div>
          <div>
            {loading ? <div className="h-7 bg-foreground/10 animate-pulse rounded w-3/4" /> : <h3 className="text-2xl font-display font-bold">{formatarMoeda(resumoFinanceiro.naoEssenciais)}</h3>}
          </div>
        </div>

        <div className={`glass p-5 rounded-3xl border flex flex-col justify-between h-36 ${resumoFinanceiro.sobra >= 0 ? 'border-success/20 bg-success/5' : 'border-destructive/20 bg-destructive/5'}`}>
          <div className="flex justify-between items-start">
            <div className={`p-2.5 rounded-xl ${resumoFinanceiro.sobra >= 0 ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}>
              <Wallet size={20} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">A Sobra Prevista</span>
          </div>
          <div>
            {loading ? <div className="h-7 bg-foreground/10 animate-pulse rounded w-3/4" /> : <h3 className={`text-2xl font-display font-bold ${resumoFinanceiro.sobra >= 0 ? 'text-success' : 'text-destructive'}`}>{formatarMoeda(resumoFinanceiro.sobra)}</h3>}
          </div>
        </div>
      </section>

      {/* BLOCO 2: Bento Grid (Analytics) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Raio-X Horizontal */}
        <div className="glass rounded-3xl p-6 border border-border lg:col-span-2 flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-foreground mb-6">
              <Activity size={18} className="text-foreground/70" />
              <span className="text-sm font-bold tracking-tight">Raio-X do Mês Selecionado</span>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-bold text-foreground/60 uppercase tracking-wider">Custo Essencial</span>
                <span className={`text-sm font-bold ${percentualEssencial > 70 ? 'text-destructive' : percentualEssencial > 50 ? 'text-warning' : 'text-success'}`}>
                  {percentualEssencial}% <span className="text-xs font-medium text-foreground/40">da renda</span>
                </span>
              </div>
              <div className="h-3 w-full bg-foreground/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(percentualEssencial, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${corComprometimento}`} 
                />
              </div>
            </div>

            <p className="text-xs text-foreground/50">
              O seu orçamento previsto para este mês está <strong className={percentualEssencial > 50 ? 'text-warning' : 'text-success'}>{alertaTexto.toLowerCase()}</strong>. 
            </p>
          </div>

          <div className="w-full md:w-1/2 h-48 relative flex items-center justify-center">
            {dadosGrafico.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={dadosGrafico} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                      {dadosGrafico.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => formatarMoeda(Number(value) || 0)} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] uppercase font-bold text-foreground/40 tracking-widest">Sobra</span>
                  <span className="text-sm font-bold text-success">{formatarMoeda(Math.max(0, resumoFinanceiro.sobra))}</span>
                </div>
              </>
            ) : (
              <div className="text-xs text-foreground/40 text-center">Adicione registos<br/>para ver o gráfico.</div>
            )}
          </div>
        </div>

        {/* Meta de Reserva */}
        <div className="glass rounded-3xl p-6 border border-primary/20 bg-primary/5 relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles size={18} className="animate-pulse" />
              <span className="text-sm font-bold tracking-tight">Meta de Reserva</span>
            </div>
            <span className="text-[10px] uppercase font-bold bg-primary/10 text-primary px-2 py-1 rounded-md">6 Meses</span>
          </div>

          <div className="flex items-center gap-3 mb-6 relative z-10 bg-background/60 p-4 rounded-2xl border border-primary/10 shadow-sm">
            <div className="flex-1">
              <p className="text-[10px] uppercase font-bold text-foreground/50 mb-1">Custo</p>
              <p className="text-sm font-bold text-foreground">{loading ? '...' : formatarMoeda(resumoFinanceiro.essenciais)}</p>
            </div>
            <div className="text-foreground/30 font-bold text-lg">× 6</div>
            <div className="flex-1 text-right">
              <p className="text-[10px] uppercase font-bold text-primary/70 mb-1">Alvo Ideal</p>
              <p className="text-lg font-bold text-primary">{loading ? '...' : formatarMoeda(resumoFinanceiro.reservaIdeal)}</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-background/60 border border-border/50 text-xs font-medium text-foreground/80 flex items-start gap-2 relative z-10">
            <TrendingUp size={14} className="text-primary shrink-0 mt-0.5" />
            <p>Mantenha os custos <strong>Essenciais</strong> baixos para atingir o alvo mais rápido.</p>
          </div>
        </div>

      </section>

      {/* BLOCO 3: Histórico de Transações */}
      <section className="glass rounded-3xl p-6 border border-border">
        <div className="flex items-center gap-2 mb-6 text-foreground">
          <LayoutGrid size={18} className="text-foreground/70" />
          <h3 className="font-display text-lg font-bold">Movimentos do Mês</h3>
        </div>

        <div className="space-y-2">
          {loading ? (
            <div className="h-16 border border-border rounded-2xl bg-foreground/[0.02] animate-pulse" />
          ) : transacoes.length === 0 ? (
            <div className="border border-dashed border-border rounded-2xl p-8 text-center flex flex-col items-center justify-center bg-foreground/[0.01]">
              <Target size={24} className="text-foreground/30 mb-3"/>
              <h4 className="font-bold text-sm">Nenhum registo neste mês</h4>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {transacoes.map((t) => (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="border border-border/40 hover:border-border rounded-2xl bg-background/50 p-3 px-5 flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`p-2 rounded-xl shrink-0 ${t.tipo === 'Entrada' ? 'bg-success/10 text-success' : t.categoria === 'Essencial' ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'}`}>
                      {t.tipo === 'Entrada' ? <ArrowUpRight size={16}/> : t.categoria === 'Essencial' ? <ShieldAlert size={16}/> : <ArrowDownRight size={16}/>}
                    </div>
                    <div className="min-w-0 flex flex-col md:flex-row md:items-center md:gap-4">
                      <h4 className="text-sm font-bold truncate text-foreground/90 w-48">{t.titulo}</h4>
                      <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-foreground/40 mt-0.5 md:mt-0">
                        <span className="bg-foreground/5 px-2 py-0.5 rounded-md">{t.tag}</span>
                        {t.tipo === 'Saida' && (
                          <span className={t.categoria === 'Essencial' ? 'text-primary' : 'text-warning'}>{t.categoria}</span>
                        )}
                        {/* Indicador visual se for cartão de crédito */}
                        {t.metodoPagamento === 'CartaoCredito' && (
                          <span className="text-primary italic border border-primary/20 px-1.5 py-0.5 rounded">Crédito</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className={`text-sm font-display font-bold tabular-nums ${t.tipo === 'Entrada' ? 'text-success' : 'text-foreground'}`}>
                      {t.tipo === 'Saida' ? '-' : ''}{formatarMoeda(t.valor)}
                    </span>
                    <button 
                      onClick={() => deletarTransacao(t.id)}
                      className="p-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 hover:bg-destructive/10 text-foreground/40 hover:text-destructive rounded-lg transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </section>

      <TransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={async (data) => {
          await adicionarTransacao(data);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}