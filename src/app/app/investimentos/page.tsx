'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useSettings } from '@/contexts/SettingsContext';
import { 
  TrendingUp, TrendingDown, Wallet, Plus, Trash2, Edit2,
  Activity, Briefcase, BookOpen, Bot, Sparkles, Send, RefreshCw, LineChart, X
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

export default function InvestimentosPage() {
  const { ativos, resumoCarteira, loading, adicionarAtivo, editarAtivo, deletarAtivo } = usePortfolio();
  const { traduzir, isMounted } = useSettings();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ativoEmEdicao, setAtivoEmEdicao] = useState<any>(null);

  // ESTADOS DA IA RESTAURADOS
  const [promptInput, setPromptInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [historicoChat, setHistoricoChat] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: 'Olá! Sou o seu assistente financeiro. Como posso ajudar com a sua carteira hoje?' }
  ]);
  const chatFimRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatFimRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [historicoChat]);

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

  const abrirModalNovo = () => { setAtivoEmEdicao(null); setIsModalOpen(true); };
  const abrirModalEditar = (ativo: any) => { setAtivoEmEdicao(ativo); setIsModalOpen(true); };

  const formatarMoeda = (valor: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  const formatarPercentual = (valor: number) => new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 2 }).format(valor / 100);

  // FUNÇÕES DA IA RESTAURADAS
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
      setHistoricoChat(prev => [...prev, { role: 'assistant', content: 'Ops, tive um problema de conexão. Tente novamente.' }]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">{traduzir('investimentos')}</h2>
          <p className="text-foreground/50">{traduzir('invSub')}</p>
        </div>
        <button onClick={abrirModalNovo} className="bg-foreground text-background px-6 py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] shadow-md transition-transform">
          <Plus size={18} /> {traduzir('novoAtivo')}
        </button>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass p-6 rounded-3xl border border-border flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary"><Wallet size={20} /></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">{traduzir('patrimonio')}</span>
          </div>
          <div>{loading ? <div className="h-8 bg-foreground/10 animate-pulse rounded w-3/4" /> : <h3 className="text-3xl font-display font-bold">{formatarMoeda(resumoCarteira.patrimonioTotal)}</h3>}</div>
        </div>
        <div className="glass p-6 rounded-3xl border border-border flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <div className="p-2.5 rounded-xl bg-foreground/5 text-foreground"><Briefcase size={20} /></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">{traduzir('valorInvestido')}</span>
          </div>
          <div>{loading ? <div className="h-8 bg-foreground/10 animate-pulse rounded w-2/3" /> : <h3 className="text-2xl font-display font-bold text-foreground/80">{formatarMoeda(resumoCarteira.totalInvestido)}</h3>}</div>
        </div>
        <div className={`glass p-6 rounded-3xl border flex flex-col justify-between h-40 ${resumoCarteira.lucroTotalCarteira >= 0 ? 'border-success/20 bg-success/5' : 'border-destructive/20 bg-destructive/5'}`}>
          <div className="flex justify-between items-start">
            <div className={`p-2.5 rounded-xl ${resumoCarteira.lucroTotalCarteira >= 0 ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}>
              {resumoCarteira.lucroTotalCarteira >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">{traduzir('rendimento')}</span>
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

      {/* BLOCO DA IA RESTAURADO */}
      <section className="glass rounded-3xl border border-border overflow-hidden flex flex-col relative h-[450px]">
        <div className="p-4 border-b border-border/50 bg-foreground/[0.02] flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-display font-bold flex items-center gap-2">FinSight Copilot <Sparkles size={14} className="text-primary" /></h3>
            <p className="text-xs text-foreground/50">Tire dúvidas sobre a sua carteira ou mercado.</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {historicoChat.map((msg, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
              <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-foreground/5 border border-border/50 rounded-bl-sm text-foreground/90'}`}>
                {msg.role === 'user' ? <p className="text-sm">{msg.content}</p> : renderInsightFormatado(msg.content)}
              </div>
              <span className="text-[10px] font-bold text-foreground/30 mt-1 mx-1">
                {msg.role === 'user' ? 'Você' : 'Assistente'}
              </span>
            </motion.div>
          ))}
          {isAnalyzing && (
            <div className="flex max-w-[85%] mr-auto items-start">
              <div className="p-4 rounded-2xl bg-foreground/5 border border-border/50 rounded-bl-sm flex items-center gap-2">
                <RefreshCw size={14} className="animate-spin text-primary" />
                <span className="text-sm font-medium text-foreground/60">Analisando...</span>
              </div>
            </div>
          )}
          <div ref={chatFimRef} />
        </div>

        <form onSubmit={enviarPerguntaAI} className="p-4 bg-background border-t border-border flex items-center gap-3">
          <input 
            type="text" 
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            disabled={isAnalyzing}
            placeholder="Ex: Acha que minha carteira está arriscada?"
            className="flex-1 p-3 rounded-xl bg-foreground/5 border border-border outline-none focus:border-primary text-sm disabled:opacity-50"
          />
          <button type="submit" disabled={isAnalyzing || !promptInput.trim()} className="p-3 bg-foreground text-background dark:bg-white dark:text-black rounded-xl hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 shadow-md">
            <Send size={18} />
          </button>
        </form>
      </section>

      {/* BLOCO DOS GRÁFICOS E ATIVOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="glass rounded-3xl p-6 border border-border h-96 flex flex-col lg:col-span-2">
           <div className="flex items-center gap-2 mb-6 text-foreground">
            <LineChart size={18} className="text-foreground/70" />
            <h3 className="font-display text-lg font-bold">{traduzir('crescimentoPatrimonial')}</h3>
          </div>
          <div className="flex-1 w-full relative">
            {loading ? <div className="absolute inset-0 flex items-center justify-center"><RefreshCw size={24} className="animate-spin text-foreground/20" /></div> : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs><linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25}/><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--foreground)/0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--foreground)/0.5)' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--foreground)/0.5)' }} tickFormatter={(val) => `R$ ${val / 1000}k`} />
                  <RechartsTooltip formatter={(value: any) => [formatarMoeda(Number(value)), traduzir('patrimonio')]} contentStyle={{ borderRadius: '1rem', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))' }} />
                  <Area type="monotone" dataKey="valor" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorValor)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-foreground/40">{traduzir('semAtivos')}</div>}
          </div>
        </section>

        <section className="glass rounded-3xl p-6 border border-border overflow-hidden flex flex-col h-96">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-foreground">
              <Activity size={18} className="text-foreground/70" />
              <h3 className="font-display text-lg font-bold">{traduzir('distribuicao')}</h3>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-3">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-14 bg-foreground/5 animate-pulse rounded-2xl w-full" />)
            ) : ativos.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center h-full p-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4"><BookOpen size={22} /></div>
                <h4 className="font-bold text-sm mb-1">{traduzir('semAtivos')}</h4>
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
                        <button onClick={() => abrirModalEditar(ativo)} className="p-1.5 text-foreground/30 hover:text-primary opacity-100 md:opacity-0 group-hover:opacity-100"><Edit2 size={14} /></button>
                        <button onClick={() => deletarAtivo(ativo.id)} className="p-1.5 text-foreground/30 hover:text-destructive opacity-100 md:opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </section>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-background border border-border p-6 rounded-3xl w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xl font-bold">{ativoEmEdicao ? traduzir('editarAtivo') : traduzir('adicionarAtivo')}</h3>
                 <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-foreground/5 rounded-full"><X size={18} /></button>
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
                if (ativoEmEdicao) await editarAtivo(ativoEmEdicao.id, payload);
                else await adicionarAtivo(payload);
                setIsModalOpen(false);
              }} className="space-y-4">
                <input name="ticker" defaultValue={ativoEmEdicao?.ticker} placeholder="Ticker (Ex: ITUB4)" required className="w-full p-3 rounded-xl bg-foreground/5 border border-border outline-none" />
                <div className="grid grid-cols-2 gap-4">
                  <input name="quantidade" defaultValue={ativoEmEdicao?.quantidade} type="number" step="0.0001" placeholder={traduzir('Quantidade')} required className="w-full p-3 rounded-xl bg-foreground/5 border border-border outline-none" />
                  <input name="preco" defaultValue={ativoEmEdicao?.precoMedio} type="number" step="0.01" placeholder={traduzir('Preço (R$)')} required className="w-full p-3 rounded-xl bg-foreground/5 border border-border outline-none" />
                </div>
                <select name="tipo" defaultValue={ativoEmEdicao?.tipoAtivo || "Ações"} className="w-full p-3 rounded-xl bg-foreground/5 border border-border outline-none">
                  <option value="Ações">Ações</option>
                  <option value="FIIs">FIIs</option>
                  <option value="Renda Fixa">Renda Fixa</option>
                  <option value="Cripto">Cripto</option>
                </select>
                <button type="submit" className="w-full py-3.5 font-bold bg-primary text-primary-foreground rounded-xl">{traduzir('Salvar')}</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}