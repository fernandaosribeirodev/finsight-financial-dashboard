// src/app/app/educacao/page.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, PlayCircle, BookOpen, Trophy, 
  ShieldCheck, ArrowRight, Bot, X, Send, Calculator,
  Lightbulb, ShoppingBag, Briefcase, Utensils, Laptop
} from 'lucide-react';

const IDEIAS_RENDA_EXTRA = [
  {
    id: 1,
    titulo: 'Desapego Inteligente',
    descricao: 'Roupas, eletrônicos ou móveis parados em casa podem virar dinheiro rápido na OLX, Enjoei ou Mercado Livre.',
    icone: ShoppingBag,
    cor: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30'
  },
  {
    id: 2,
    titulo: 'Prestação de Serviços',
    descricao: 'Use o que você já sabe fazer: edição de vídeo, aulas particulares, "marido de aluguel" ou passeador de cães.',
    icone: Briefcase,
    cor: 'text-orange-500',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30'
  },
  {
    id: 3,
    titulo: 'Culinária e Doces',
    descricao: 'Fazer bolo de pote, brigadeiros gourmet ou marmitas fitness tem alta demanda, giro rápido e baixo custo inicial.',
    icone: Utensils,
    cor: 'text-rose-500',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30'
  },
  {
    id: 4,
    titulo: 'Mercado de Afiliados',
    descricao: 'Venda produtos digitais de outras pessoas (cursos, e-books) e ganhe comissões por cada venda na internet.',
    icone: Laptop,
    cor: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30'
  }
];

const ARTIGOS_RECOMENDADOS = [
  { 
    titulo: 'Como funcionam os Juros Compostos na prática', 
    tempo: '6 min de leitura', 
    categoria: 'Conceito',
    url: 'https://www.mobills.com.br/blog/investimentos/juros-compostos/'
  },
  { 
    titulo: 'O que é a Taxa Selic e como ela afeta investimentos?', 
    tempo: '8 min de leitura', 
    categoria: 'Economia',
    url: 'https://www.tesourodireto.com.br/blog/o-que-e-taxa-selic.htm'
  },
  { 
    titulo: 'Como montar uma Reserva de Emergência', 
    tempo: '7 min de leitura', 
    categoria: 'Planejamento',
    url: 'https://www.xpi.com.br/aprenda-a-investir/relatorios/reserva-de-emergencia/'
  },
  { 
    titulo: 'Tesouro Direto para iniciantes', 
    tempo: '10 min de leitura', 
    categoria: 'Investimentos',
    url: 'https://www.b3.com.br/pt_br/produtos-e-servicos/negociacao/renda-fixa/tesouro-direto/'
  },
  { 
    titulo: 'O que são FIIs e como investir', 
    tempo: '9 min de leitura', 
    categoria: 'Renda Variável',
    url: 'https://www.suno.com.br/artigos/fundos-imobiliarios/'
  },
];

export default function EducacaoPage() {
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [simValorInicial, setSimValorInicial] = useState('1000');
  const [simAporteMensal, setSimAporteMensal] = useState('500');
  const [simTaxaAnual, setSimTaxaAnual] = useState('10');
  const [simAnos, setSimAnos] = useState('10');
  const [simResultado, setSimResultado] = useState<number | null>(null);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [historicoChat, setHistoricoChat] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: 'Olá! Sou seu Assistente FinSight 💡 Como posso te ajudar com seus estudos financeiros hoje?' }
  ]);
  const chatFimRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isChatOpen) {
      chatFimRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [historicoChat, isChatOpen, isTyping]);

  const formatarMoeda = (valor: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

  const calcularJuros = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseFloat(simValorInicial) || 0;
    const pmt = parseFloat(simAporteMensal) || 0;
    const r = (parseFloat(simTaxaAnual) || 0) / 100;
    const t = parseFloat(simAnos) || 0;
    const n = t * 12; 
    const i = Math.pow(1 + r, 1 / 12) - 1; 

    let montante = 0;
    if (i === 0) {
      montante = p + (pmt * n);
    } else {
      montante = p * Math.pow(1 + i, n) + pmt * ((Math.pow(1 + i, n) - 1) / i);
    }
    setSimResultado(montante);
  };

  const enviarMensagemIA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isTyping) return;

    const novaPergunta = chatInput.trim();
    const novoHistorico = [...historicoChat, { role: 'user' as const, content: novaPergunta }];
    
    setHistoricoChat(novoHistorico);
    setChatInput('');
    setIsTyping(true);
    
    try {
      const res = await fetch('/api/ai/investimentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          resumoCarteira: { patrimonioTotal: 0, totalInvestido: 0, lucroTotalCarteira: 0, rentabilidadeTotalPercent: 0 }, 
          ativos: [], 
          historico: novoHistorico
        })
      });
      
      const data = await res.json();
      if (data.insight) {
        setHistoricoChat(prev => [...prev, { role: 'assistant', content: data.insight }]);
      }
    } catch (error) {
      setHistoricoChat(prev => [...prev, { role: 'assistant', content: 'Desculpe, minha conexão falhou. Pode tentar de novo?' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderInsightFormatado = (texto: string) => {
    return texto.split('\n').map((paragrafo, index) => {
      const partes = paragrafo.split(/\*\*([\s\S]*?)\*\*/g);
      return (
        <div key={index} className="mb-1 last:mb-0">
          {partes.map((parte, i) => i % 2 === 1 ? <strong key={i} className="font-extrabold">{parte}</strong> : parte)}
        </div>
      );
    });
  };

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto relative">
      
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight flex items-center gap-3">
            Educação Financeira <GraduationCap className="text-primary" size={28} />
          </h2>
          <p className="text-foreground/50 mt-1">Sua jornada para a independência financeira começa aqui.</p>
        </div>
        <div className="flex items-center gap-3 bg-foreground/5 px-4 py-2 rounded-2xl border border-border/50">
          <Trophy size={20} className="text-yellow-500" />
          <div>
            <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider">Seu Nível</p>
            <p className="text-sm font-bold">Investidor Iniciante</p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-primary/10 via-background to-background p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
        <div className="relative z-10 max-w-2xl space-y-4">
          <h3 className="text-3xl md:text-4xl font-display font-bold leading-tight uppercase text-foreground">
            Como fazer sua <span className="text-primary">Reserva de Emergência</span> do jeito certo
          </h3>
          <p className="text-foreground/80 text-lg font-medium">
            Aprenda com o Primo Pobre, com uma linguagem super didática a como fazer uma reserva de emergência e proteger o que mais importa para você.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <a 
              href="https://youtu.be/EgVeWLDami4?si=_UbQHsQrnTDVY-kc" 
              target="_blank" rel="noreferrer"
              className="px-6 py-3 bg-primary text-white font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-transform shadow-md"
            >
              <PlayCircle size={20} /> Assistir Aula Completa
            </a>
            <a 
              href="https://www.xpi.com.br/aprenda-a-investir/relatorios/reserva-de-emergencia/" 
              target="_blank" rel="noreferrer"
              className="px-6 py-3 bg-foreground/5 text-foreground font-bold rounded-xl flex items-center gap-2 hover:bg-foreground/10 transition-colors border border-border/50 shadow-sm"
            >
              <BookOpen size={20} /> Ler Guia Escrito
            </a>
          </div>
        </div>
        
        <div className="hidden md:flex w-48 h-48 bg-primary/5 rounded-full items-center justify-center relative shrink-0">
          <ShieldCheck size={80} className="text-primary opacity-90" />
          <div className="absolute inset-0 border-4 border-dashed border-primary/30 rounded-full animate-[spin_20s_linear_infinite]" />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-display font-bold flex items-center gap-2">
            <Lightbulb size={20} className="text-yellow-500" /> Ideias de Renda Extra
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {IDEIAS_RENDA_EXTRA.map((ideia, index) => (
            <motion.div 
              key={ideia.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
              className={`glass p-5 rounded-3xl border flex flex-col h-full transition-all hover:scale-[1.02] cursor-pointer group ${ideia.border} hover:border-primary/50`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${ideia.bg} ${ideia.cor}`}>
                  <ideia.icone size={24} />
                </div>
              </div>
              <h4 className="font-bold text-base leading-tight mb-2 group-hover:text-primary transition-colors">{ideia.titulo}</h4>
              <p className="text-xs text-foreground/60 leading-relaxed">{ideia.descricao}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="glass p-6 rounded-3xl border border-border">
          <h3 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
            <BookOpen size={18} className="text-foreground/70" /> Leituras Essenciais
          </h3>
          <div className="space-y-4">
            {ARTIGOS_RECOMENDADOS.map((artigo, idx) => (
              <a 
                key={idx} href={artigo.url} target="_blank" rel="noreferrer"
                className="group flex items-center justify-between p-4 bg-foreground/[0.02] border border-border/50 rounded-2xl hover:border-primary/50 hover:bg-foreground/[0.04] transition-colors"
              >
                <div>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1 block">{artigo.categoria}</span>
                  <h4 className="font-bold text-sm group-hover:text-primary transition-colors">{artigo.titulo}</h4>
                  <p className="text-xs text-foreground/50 mt-1">{artigo.tempo}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0 ml-4">
                  <ArrowRight size={14} />
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="glass p-6 rounded-3xl border border-border bg-gradient-to-tl from-primary/5 to-transparent flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
            <Calculator size={32} />
          </div>
          <h3 className="font-display font-bold text-xl mb-2">Simulador de Juros Compostos</h3>
          <p className="text-sm text-foreground/60 mb-6 max-w-sm">
            Descubra em quanto tempo você atingirá a sua independência financeira investindo um pouco todos os meses.
          </p>
          <button 
            onClick={() => setIsSimulatorOpen(true)}
            className="px-6 py-3 bg-foreground text-background dark:bg-white dark:text-black font-bold rounded-xl text-sm hover:scale-105 transition-transform w-full md:w-auto shadow-md"
          >
            Abrir Calculadora
          </button>
        </section>
      </div>

      {/* MODAL SIMULADOR */}
      <AnimatePresence>
        {isSimulatorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background border border-border p-6 rounded-3xl w-full max-w-lg shadow-2xl relative"
            >
              <button onClick={() => setIsSimulatorOpen(false)} className="absolute top-4 right-4 p-2 bg-foreground/5 rounded-full hover:bg-foreground/10 transition-colors">
                <X size={20} />
              </button>
              <div className="mb-6">
                <h3 className="text-2xl font-bold flex items-center gap-2"><Calculator className="text-primary" /> Simulador</h3>
              </div>

              <form onSubmit={calcularJuros} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-foreground/60">Valor Inicial (R$)</label>
                    <input type="number" value={simValorInicial} onChange={e => setSimValorInicial(e.target.value)} required className="w-full mt-1 p-3 rounded-xl bg-foreground/5 border border-border outline-none focus:border-primary font-bold" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground/60">Aporte Mensal (R$)</label>
                    <input type="number" value={simAporteMensal} onChange={e => setSimAporteMensal(e.target.value)} required className="w-full mt-1 p-3 rounded-xl bg-foreground/5 border border-border outline-none focus:border-primary font-bold" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground/60">Taxa Anual (%)</label>
                    <input type="number" step="0.1" value={simTaxaAnual} onChange={e => setSimTaxaAnual(e.target.value)} required className="w-full mt-1 p-3 rounded-xl bg-foreground/5 border border-border outline-none focus:border-primary font-bold" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground/60">Tempo (Anos)</label>
                    <input type="number" value={simAnos} onChange={e => setSimAnos(e.target.value)} required className="w-full mt-1 p-3 rounded-xl bg-foreground/5 border border-border outline-none focus:border-primary font-bold" />
                  </div>
                </div>
                <button type="submit" className="w-full py-4 font-bold bg-primary text-primary-foreground rounded-xl shadow-lg hover:opacity-90">Calcular Resultado</button>
              </form>

              {simResultado !== null && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-6 bg-success/10 border border-success/20 rounded-2xl text-center">
                  <p className="text-xs font-bold text-success uppercase tracking-widest mb-1">Valor Total Acumulado</p>
                  <p className="text-3xl font-display font-bold text-success">{formatarMoeda(simResultado)}</p>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ASSISTENTE IA FLUTUANTE */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="mb-4 w-[340px] sm:w-[380px] bg-background border border-border shadow-2xl rounded-2xl overflow-hidden flex flex-col h-[500px]"
            >
              <div className="bg-[#2b3a32] text-white p-4 flex justify-between items-center shadow-md z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-xl"><Bot size={20} /></div>
                  <div>
                    <h4 className="font-bold text-sm">Assistente IA</h4>
                    <div className="flex items-center gap-1.5 text-[10px] text-white/70">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> IA Online
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg"><X size={18} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-foreground/[0.02] custom-scrollbar">
                {historicoChat.map((msg, idx) => (
                  <div key={idx} className={`flex max-w-[85%] ${msg.role === 'user' ? 'ml-auto' : 'mr-auto gap-2'}`}>
                    {msg.role === 'assistant' && <div className="w-8 h-8 rounded-full bg-[#2b3a32] text-white flex items-center justify-center shrink-0 mt-1"><Bot size={14} /></div>}
                    <div className={`p-3.5 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-[#2b3a32] text-white rounded-br-sm' : 'bg-background border border-border shadow-sm rounded-tl-sm text-foreground/90'}`}>
                      {msg.role === 'user' ? msg.content : renderInsightFormatado(msg.content)}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex mr-auto gap-2 items-end">
                    <div className="w-8 h-8 rounded-full bg-[#2b3a32] text-white flex items-center justify-center shrink-0"><Bot size={14} /></div>
                    <div className="p-4 rounded-2xl bg-background border border-border shadow-sm rounded-tl-sm flex gap-1.5">
                      <div className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={chatFimRef} />
              </div>

              <form onSubmit={enviarMensagemIA} className="p-3 bg-background border-t border-border flex items-center gap-2">
                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} disabled={isTyping} placeholder="Pergunte algo..." className="flex-1 p-3 rounded-xl bg-foreground/5 border border-border outline-none focus:border-primary text-sm disabled:opacity-50" />
                <button type="submit" disabled={isTyping || !chatInput.trim()} className="p-3 bg-[#8b9b92] text-white hover:bg-[#6e7c74] rounded-xl shadow-md"><Send size={18} /></button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {!isChatOpen && (
          <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} onClick={() => setIsChatOpen(true)} className="w-14 h-14 bg-[#2b3a32] hover:bg-[#1f2a24] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all">
            <Bot size={28} />
          </motion.button>
        )}
      </div>

    </div>
  );
}