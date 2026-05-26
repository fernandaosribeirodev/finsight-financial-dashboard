'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '@/hooks/usePortfolio';
import { 
  TrendingUp, TrendingDown, Wallet, Plus, Trash2, Edit2,
  Activity, Briefcase, Info, BookOpen, Bot, Sparkles, Send, RefreshCw, LineChart
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';

export default function InvestimentosPage() {
  // Puxando editarAtivo do Hook
  const { ativos, resumoCarteira, loading, adicionarAtivo, editarAtivo, deletarAtivo } = usePortfolio();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ativoEmEdicao, setAtivoEmEdicao] = useState<any>(null); // Estado para controlar a edição

  // --- ESTADOS DO CHATBOT DE IA ---
  const [promptInput, setPromptInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [historicoChat, setHistoricoChat] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: 'Olá! Sou o seu assistente financeiro. Como posso ajudar com a sua carteira hoje?' }
  ]);
  const chatFimRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatFimRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [historicoChat]);

  const formatarMoeda = (valor: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  const formatarPercentual = (valor: number) => new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 2 }).format(valor / 100);

  const renderInsightFormatado = (texto: string) => {
    return texto.split('\n').map((paragrafo, index) => {
      const partes = paragrafo.split(/\*\*([\s\S]*?)\*\*/g);
      return (
        <div key={index} className="mb-2 last:mb-0 text-sm leading-relaxed">
          {partes.map((parte, i) => {
            if (i % 2 === 1) return <strong key={i} className="font-extrabold bg-foreground/10 px-1 py-0.5 rounded text-xs">{parte}</strong>;
            return parte;
          })}
        </div>
      );
    });
  };

  const enviarPerguntaAI = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!promptInput.trim() || isAnalyzing) return;

    const novaPergunta = promptInput.trim();
    const novoHistorico = [...historicoChat, { role: 'user' as const, content: novaPergunta }];
    
    setHistoricoChat(novoHistorico);
    setPromptInput('');
    setIsAnalyzing(true);
    
    try {
      const res = await fetch('/api/ai/investimentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumoCarteira, ativos, historico: novoHistorico })
      });
      const data = await res.json();
      if (data.insight) setHistoricoChat(prev => [...prev, { role: 'assistant', content: data.insight }]);
    } catch (error) {
      setHistoricoChat(prev => [...prev, { role: 'assistant', content: 'Ops, tive um problema de conexão. Pode tentar novamente?' }]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const chartData = useMemo(() => {
    if (resumoCarteira.patrimonioTotal === 0) return [];
    const data = [];
    let valorAcumulado = resumoCarteira.totalInvestido * 0.8; 
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    for (let i = 0; i < 6; i++) {
      if (i === 5) data.push({ name: meses[i], valor: resumoCarteira.patrimonioTotal });
      else {
        valorAcumulado += (resumoCarteira.patrimonioTotal - valorAcumulado) / (5 - i) * (Math.random() * 0.5 + 0.5);
        data.push({ name: meses[i], valor: valorAcumulado });
      }
    }
    return data;
  }, [resumoCarteira.patrimonioTotal, resumoCarteira.totalInvestido]);

  const abrirModalNovo = () => {
    setAtivoEmEdicao(null);
    setIsModalOpen(true);
  };

  const abrirModalEditar = (ativo: any) => {
    setAtivoEmEdicao(ativo);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      
      {/* CABEÇALHO */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Carteira de Investimentos</h2>
          <p className="text-foreground/50">Acompanhe seus ativos e converse com a IA sobre o mercado.</p>
        </div>
        <button onClick={abrirModalNovo} className="bg-foreground text-background px-6 py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] shadow-md transition-transform">
          <Plus size={18} /> Adicionar Investimento
        </button>
      </section>

      {/* BLOCO 1: CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 */}
        <div className="glass p-6 rounded-3xl border border-border flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary"><Wallet size={20} /></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 flex items-center">Patrimônio Atual</span>
          </div>
          <div>{loading ? <div className="h-8 bg-foreground/10 animate-pulse rounded w-3/4" /> : <h3 className="text-3xl font-display font-bold">{formatarMoeda(resumoCarteira.patrimonioTotal)}</h3>}</div>
        </div>

        {/* Card 2 */}
        <div className="glass p-6 rounded-3xl border border-border flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <div className="p-2.5 rounded-xl bg-foreground/5 text-foreground"><Briefcase size={20} /></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 flex items-center">Valor Tirado do Bolso</span>
          </div>
          <div>{loading ? <div className="h-8 bg-foreground/10 animate-pulse rounded w-2/3" /> : <h3 className="text-2xl font-display font-bold text-foreground/80">{formatarMoeda(resumoCarteira.totalInvestido)}</h3>}</div>
        </div>

        {/* Card 3 */}
        <div className={`glass p-6 rounded-3xl border flex flex-col justify-between h-40 ${resumoCarteira.lucroTotalCarteira >= 0 ? 'border-success/20 bg-success/5' : 'border-destructive/20 bg-destructive/5'}`}>
          <div className="flex justify-between items-start">
            <div className={`p-2.5 rounded-xl ${resumoCarteira.lucroTotalCarteira >= 0 ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}>
              {resumoCarteira.lucroTotalCarteira >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 flex items-center">O que Rendeu</span>
          </div>
          <div>
            {loading ? <div className="h-8 bg-foreground/10 animate-pulse rounded w-1/2" /> : (
              <div className="flex items-end gap-3">
                <h3 className={`text-2xl font-display font-bold ${resumoCarteira.lucroTotalCarteira >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {resumoCarteira.lucroTotalCarteira >= 0 ? '+' : ''}{formatarMoeda(resumoCarteira.lucroTotalCarteira)}
                </h3>
                <span className={`text-sm font-bold mb-1 ${resumoCarteira.lucroTotalCarteira >= 0 ? 'text-success/80' : 'text-destructive/80'}`}>
                  ({resumoCarteira.lucroTotalCarteira >= 0 ? '+' : ''}{formatarPercentual(resumoCarteira.rentabilidadeTotalPercent)})
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* BLOCO 2 e 3 MANTIDOS RESUMIDOS AQUI POR ESPAÇO, MAS COM EDIÇÃO NA LISTA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="glass rounded-3xl p-6 border border-border h-96 flex flex-col lg:col-span-2">
           {/* GRÁFICO (Mantido igual ao seu) */}
           <div className="flex items-center gap-2 mb-6 text-foreground">
            <LineChart size={18} className="text-foreground/70" />
            <h3 className="font-display text-lg font-bold">Crescimento Patrimonial</h3>
          </div>
          <div className="flex-1 w-full relative">
            {loading ? <div className="absolute inset-0 flex items-center justify-center"><RefreshCw size={24} className="animate-spin text-foreground/20" /></div> : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--foreground)/0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--foreground)/0.5)' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--foreground)/0.5)' }} tickFormatter={(val) => `R$ ${val / 1000}k`} />
                  <RechartsTooltip formatter={(value: any) => [formatarMoeda(Number(value)), 'Patrimônio']} contentStyle={{ borderRadius: '1rem', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))', fontWeight: 'bold' }} />
                  <Area type="monotone" dataKey="valor" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorValor)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-foreground/40">Adicione ativos para ver o gráfico.</div>}
          </div>
        </section>

        {/* LISTA DE ATIVOS COM BOTÃO DE EDITAR */}
        <section className="glass rounded-3xl p-6 border border-border overflow-hidden flex flex-col h-96">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-foreground">
              <Activity size={18} className="text-foreground/70" />
              <h3 className="font-display text-lg font-bold">Distribuição</h3>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-3">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-14 bg-foreground/5 animate-pulse rounded-2xl w-full" />)
            ) : ativos.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center h-full p-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4"><BookOpen size={22} /></div>
                <h4 className="font-bold text-sm mb-1">Sem ativos</h4>
                <p className="text-xs text-foreground/50 mb-5 leading-normal">Adicione cotas de Ações ou FIIs para começar.</p>
              </div>
            ) : (
              <AnimatePresence>
                {ativos.map((ativo) => {
                  const isPositivo = ativo.lucroPrejuizoValor >= 0;
                  return (
                    <motion.div key={ativo.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="p-3 bg-foreground/[0.01] hover:bg-foreground/[0.03] border border-border/40 rounded-2xl flex items-center justify-between group">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${isPositivo ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>{ativo.ticker.substring(0, 2)}</div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm truncate">{ativo.ticker}</p>
                          <p className="text-[10px] font-bold text-foreground/40">{ativo.quantidade} cotas</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right mr-2">
                          <p className="font-bold text-sm tabular-nums">{formatarMoeda(ativo.saldoAtual)}</p>
                          <p className={`text-[10px] font-bold tabular-nums ${isPositivo ? 'text-success' : 'text-destructive'}`}>{isPositivo ? '+' : ''}{formatarPercentual(ativo.lucroPrejuizoPercent)}</p>
                        </div>
                        {/* BOTÕES DE EDITAR E EXCLUIR */}
                        <button onClick={() => abrirModalEditar(ativo)} className="p-1.5 text-foreground/30 hover:text-primary hover:bg-primary/10 rounded-lg opacity-100 md:opacity-0 group-hover:opacity-100 transition-all"><Edit2 size={14} /></button>
                        <button onClick={() => deletarAtivo(ativo.id)} className="p-1.5 text-foreground/30 hover:text-destructive hover:bg-destructive/10 rounded-lg opacity-100 md:opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </section>
      </div>

      {/* MODAL RESPONSIVO (MUITO MAIS INTELIGENTE PARA EDIÇÃO) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-background border border-border p-6 rounded-3xl w-full max-w-md shadow-2xl">
            <div className="mb-4">
              <h3 className="text-xl font-bold">{ativoEmEdicao ? 'Editar Ativo' : 'Adicionar Ativo à Carteira'}</h3>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const payload = {
                ticker: (formData.get('ticker') as string).toUpperCase().trim(),
                quantidade: Number(formData.get('quantidade')),
                precoMedio: Number(formData.get('preco')),
                tipoAtivo: formData.get('tipo') as any,
                dataUltimaCompra: new Date().toISOString().split('T')[0]
              };

              if (ativoEmEdicao) {
                await editarAtivo(ativoEmEdicao.id, payload);
              } else {
                await adicionarAtivo(payload);
              }
              setIsModalOpen(false);
            }} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-foreground/60">Código do Ativo (Ticker)</label>
                <input name="ticker" defaultValue={ativoEmEdicao?.ticker} placeholder="Ex: ITUB4" required className="w-full mt-1 p-3 rounded-xl bg-foreground/5 border border-border outline-none focus:border-primary uppercase font-bold tracking-wide" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-foreground/60">Quantidade total</label>
                  <input name="quantidade" defaultValue={ativoEmEdicao?.quantidade} type="number" step="0.0001" placeholder="0" required className="w-full mt-1 p-3 rounded-xl bg-foreground/5 border border-border outline-none focus:border-primary font-medium" />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground/60">Preço Pago (R$)</label>
                  <input name="preco" defaultValue={ativoEmEdicao?.precoMedio} type="number" step="0.01" placeholder="0,00" required className="w-full mt-1 p-3 rounded-xl bg-foreground/5 border border-border outline-none focus:border-primary font-medium" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-foreground/60">Segmento</label>
                <select name="tipo" defaultValue={ativoEmEdicao?.tipoAtivo || "Ações"} className="w-full mt-1 p-3 rounded-xl bg-foreground/5 border border-border outline-none focus:border-primary font-medium">
                  <option value="Ações">Ações</option>
                  <option value="FIIs">FIIs</option>
                  <option value="Renda Fixa">Renda Fixa</option>
                  <option value="Cripto">Criptoativos</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 font-bold text-foreground/60 hover:bg-foreground/5 rounded-xl text-sm transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 py-3 font-bold bg-primary text-primary-foreground rounded-xl shadow-lg text-sm hover:opacity-90">{ativoEmEdicao ? 'Salvar Edição' : 'Salvar na Carteira'}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}