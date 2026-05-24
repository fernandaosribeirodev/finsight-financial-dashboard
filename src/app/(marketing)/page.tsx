'use client';

import { Footer } from '../../components/Footer';
import { motion, Variants } from 'framer-motion';
import {
  ArrowRight, Sparkles, TrendingUp, ShieldCheck, Smartphone, Command, Zap, Layers,
  Terminal, Accessibility, CheckCircle2, BarChart3, Lock, PieChart, Moon, Globe, Keyboard, Eye
} from 'lucide-react';
import Link from 'next/link';

/* =========================================
   ANIMAÇÕES
========================================= */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden selection:bg-primary/20 bg-background text-foreground">

      {/* =========================================
          1. HERO SECTION & MOCKUP
      ========================================= */}
      <section className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl flex flex-col items-center">
          
          <motion.div variants={fadeUp} className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-white/40 dark:bg-black/40 backdrop-blur-md px-4 py-2 text-xs sm:text-sm font-medium text-foreground/70 shadow-sm">
            <Sparkles size={14} className="text-primary" />
   Novo · IA financeira em tempo real
          </motion.div>

          <motion.h1 variants={fadeUp} className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[1.05] mb-6 text-balance">
            Inteligência financeira projetada para a {' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">vida moderna.</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg md:text-xl text-foreground/50 max-w-2xl mb-10 text-balance leading-relaxed">
            Gerencie patrimônio, acompanhe investimentos e receba insights inteligentes com uma experiência sofisticada, acessível e construída para o futuro das finanças digitais.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link href="/cadastro" className="flex items-center justify-center gap-2 w-full sm:w-auto bg-foreground text-background px-8 py-4 rounded-full text-sm font-medium transition-transform hover:scale-105 shadow-lg">
              Começar agora
              <ArrowRight size={16} />
            </Link>
            <Link href="#features" className="flex items-center justify-center gap-2 w-full sm:w-auto bg-white/50 dark:bg-black/50 backdrop-blur-md border border-border px-8 py-4 rounded-full text-sm font-medium text-foreground transition-all hover:bg-white dark:hover:bg-black shadow-sm microlift">
              Explorar plataforma
            </Link>
          </motion.div>
          
          <motion.p variants={fadeUp} className="mt-8 text-sm text-foreground/40 font-medium">
            Sem burocracia. Sem complexidade. Apenas clareza financeira em uma experiência premium.
          </motion.p>
        </motion.div>

        {/* Dashboard Mockup (CSS Puro) */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
          className="relative mt-24 w-full max-w-6xl rounded-t-[2rem] border-t border-l border-r border-border/50 bg-white/30 dark:bg-black/30 p-4 pb-0 backdrop-blur-3xl shadow-elegant overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent dark:from-white/5 rounded-t-[2rem] pointer-events-none" />
          <div className="relative h-[500px] w-full rounded-t-2xl bg-white dark:bg-[#0a0a0a] border border-border shadow-sm flex flex-col overflow-hidden">
            <div className="h-12 border-b border-border flex items-center px-4 gap-4 bg-foreground/[0.02]">
              <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-border"/><div className="w-3 h-3 rounded-full bg-border"/><div className="w-3 h-3 rounded-full bg-border"/></div>
              <div className="text-xs font-medium text-foreground/30 flex items-center gap-2 bg-foreground/5 px-4 py-1.5 rounded-md"><Lock size={10} /> finsight.app/dashboard</div>
            </div>
            <div className="flex-1 flex p-8 gap-8 bg-foreground/[0.01]">
              <div className="w-48 hidden lg:flex flex-col gap-4">
                <div className="flex items-center gap-3 text-sm font-semibold text-foreground bg-foreground/5 px-4 py-2 rounded-lg"><div className="w-2 h-2 rounded-full bg-primary" /> Visão Geral</div>
                <div className="flex items-center gap-3 text-sm font-medium text-foreground/50 px-4 py-2">Transações</div>
                <div className="flex items-center gap-3 text-sm font-medium text-foreground/50 px-4 py-2">Investimentos</div>
                <div className="flex items-center gap-3 text-sm font-medium text-foreground/50 px-4 py-2">Cartões</div>
              </div>
              <div className="flex-1 flex flex-col gap-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="border border-border rounded-2xl p-5 bg-background shadow-sm">
                    <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-2">Saldo Total</p>
                    <p className="font-display text-2xl font-bold tabular-nums">R$ 128.430</p>
                    <p className="text-xs font-medium text-success mt-2 flex items-center gap-1"><TrendingUp size={12}/> +2,4%</p>
                  </div>
                  <div className="border border-border rounded-2xl p-5 bg-background shadow-sm">
                    <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-2">Receitas</p>
                    <p className="font-display text-2xl font-bold tabular-nums">R$ 24.180</p>
                    <p className="text-xs font-medium text-success mt-2 flex items-center gap-1"><TrendingUp size={12}/> +8,1%</p>
                  </div>
                  <div className="border border-border rounded-2xl p-5 bg-background shadow-sm">
                    <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-2">Despesas</p>
                    <p className="font-display text-2xl font-bold tabular-nums">R$ 9.620</p>
                    <p className="text-xs font-medium text-destructive mt-2 flex items-center gap-1"><TrendingUp size={12} className="rotate-180"/> -3,2%</p>
                  </div>
                </div>
                <div className="border border-border rounded-2xl p-5 bg-background shadow-sm flex-1 relative flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-semibold text-foreground">Evolução patrimonial</p>
                      <p className="text-xs text-foreground/50">Últimos 12 meses</p>
                    </div>
                    <div className="bg-success/10 text-success text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1"><TrendingUp size={12}/> +24,8%</div>
                  </div>
                  <div className="flex-1 w-full relative">
                     <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                       <path d="M0,80 Q20,75 40,60 T70,40 T100,20" fill="none" stroke="oklch(var(--success))" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                       <path d="M0,80 Q20,75 40,60 T70,40 T100,20 L100,100 L0,100 Z" fill="oklch(var(--success) / 0.1)" />
                     </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* =========================================
          2. TRUST SECTION
      ========================================= */}
      <section className="py-24 border-y border-border/50 bg-foreground/[0.01]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-6">Construído para performance, acessibilidade e escala.</h2>
            <p className="text-lg text-foreground/60 text-balance">O FinSight combina engenharia moderna, design refinado e experiência centrada no usuário para entregar uma plataforma financeira rápida, segura e intuitiva.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: "Performance", desc: "Arquitetura otimizada para carregamento instantâneo e fluidez em qualquer dispositivo." },
              { icon: Accessibility, title: "Acessibilidade", desc: "Experiência inclusiva com suporte completo a leitores de tela, navegação por teclado e alto contraste." },
              { icon: Lock, title: "Segurança", desc: "Proteção avançada de dados e estrutura preparada para padrões corporativos modernos." },
              { icon: Terminal, title: "Cloud Ready", desc: "Infraestrutura moderna preparada para escalabilidade e crescimento contínuo." }
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex flex-col items-center text-center p-6">
                <div className="w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center mb-6 text-foreground"><item.icon size={24} strokeWidth={1.5} /></div>
                <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          3. FEATURES SECTION
      ========================================= */}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex px-3 py-1 rounded-full border border-border text-xs font-semibold mb-6">Plataforma</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-6 text-balance">Tudo o que você precisa para controlar sua vida financeira.</h2>
          <p className="text-lg text-foreground/60 text-balance">Uma experiência pensada para transformar dados financeiros em decisões inteligentes.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: BarChart3, title: "Controle financeiro inteligente", desc: "Visualize receitas, despesas e movimentações em tempo real com uma interface clara e sofisticada." },
            { icon: TrendingUp, title: "Acompanhamento de investimentos", desc: "Monitore evolução patrimonial, desempenho de ativos e metas financeiras em um único lugar." },
            { icon: Sparkles, title: "Insights financeiros com IA", desc: "Receba recomendações inteligentes e análises personalizadas para melhorar hábitos financeiros." },
            { icon: PieChart, title: "Relatórios modernos e visuais", desc: "Transforme dados complexos em gráficos intuitivos e métricas fáceis de compreender." },
            { icon: Smartphone, title: "Experiência mobile premium", desc: "Desenvolvido mobile-first para oferecer fluidez e conforto semelhantes a aplicativos nativos." },
            { icon: ShieldCheck, title: "Privacidade e segurança", desc: "Sua experiência protegida por práticas modernas de autenticação e gerenciamento de dados." }
          ].map((feat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-8 rounded-[2rem] border border-border bg-white dark:bg-[#0a0a0a] shadow-sm microlift group">
              <div className="w-12 h-12 rounded-2xl bg-foreground/[0.03] border border-border flex items-center justify-center mb-8 text-foreground transition-colors group-hover:bg-primary/5 group-hover:text-primary">
                <feat.icon size={20} />
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-tight">{feat.title}</h3>
              <p className="text-foreground/60 text-sm leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* =========================================
          4. AI INSIGHTS SECTION
      ========================================= */}
      <section className="py-32 px-6 bg-gradient-to-b from-transparent to-primary/[0.03] border-y border-border/50">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold mb-6">
              <Sparkles size={14} /> FinSight AI
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-6 text-balance">Inteligência financeira que evolui com você.</h2>
            <p className="text-lg text-foreground/60 text-balance leading-relaxed mb-8">
              O FinSight AI analisa movimentações financeiras e oferece sugestões claras, úteis e contextualizadas para apoiar melhores decisões.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="lg:w-1/2 w-full space-y-4 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
            
            {[
              "Seus gastos com assinaturas aumentaram 12% este mês. Revisar serviços pouco utilizados pode acelerar sua meta de investimento.",
              "Você manteve consistência financeira nas últimas 8 semanas. Seu padrão atual indica evolução positiva da reserva financeira.",
              "Seu patrimônio apresentou crescimento contínuo nos últimos 30 dias. Considere diversificar investimentos de renda variável para reduzir riscos."
            ].map((text, i) => (
              <div key={i} className="glass p-6 rounded-2xl border border-border shadow-sm flex gap-4 items-start relative z-10 transition-transform hover:scale-[1.02]">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <Sparkles size={14} className="text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground/80 leading-relaxed">{text}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* =========================================
          5. ACCESSIBILITY SECTION
      ========================================= */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-6">Tecnologia acessível para todos.</h2>
          <p className="text-lg text-foreground/60 text-balance">O FinSight foi desenvolvido com foco em inclusão digital, oferecendo uma experiência sofisticada sem abrir mão da acessibilidade.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {[
            { icon: Moon, title: "Dark & Light Mode", desc: "Alternância inteligente entre modos claro e escuro para maior conforto visual." },
            { icon: Eye, title: "Modo Leitura", desc: "Interface otimizada para reduzir distrações e melhorar legibilidade para usuários com baixa visão." },
            { icon: Keyboard, title: "Navegação por teclado", desc: "Compatibilidade completa com navegação sem mouse e foco acessível." },
            { icon: Globe, title: "Suporte multilíngue", desc: "Experiência preparada para múltiplos idiomas e contextos culturais." },
            { icon: Accessibility, title: "Screen Readers", desc: "Estrutura semântica compatível com tecnologias assistivas modernas." }
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex gap-5">
              <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center shrink-0 text-foreground"><item.icon size={18} /></div>
              <div>
                <h3 className="text-base font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}

        </div>
      </section>

      <section className="py-32 px-6 bg-foreground/[0.02] border-y border-border/50 overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="md:w-1/2">
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-6">Uma experiência fluida em qualquer dispositivo.</h2>
            <p className="text-lg text-foreground/60 text-balance mb-6">
              Projetado com abordagem mobile-first para entregar velocidade, clareza visual e conforto em todos os tamanhos de tela.
            </p>
            <p className="text-lg text-foreground/60 text-balance mb-8">
              A experiência do FinSight combina performance, animações suaves e interações intuitivas inspiradas nos melhores aplicativos financeiros do mercado.
            </p>
            <ul className="space-y-4">
              {['Design Responsivo', 'Bottom Navigation Nativa', 'Gestos e Swipe Actions'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-semibold text-foreground"><CheckCircle2 size={18} className="text-primary"/> {item}</li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="md:w-1/2 relative flex justify-center w-full">
            <div className="w-[300px] h-[620px] rounded-[3rem] border-[10px] border-foreground/10 bg-background shadow-2xl relative overflow-hidden flex flex-col ring-1 ring-border">
              <div className="absolute top-0 w-full h-7 flex justify-center pt-2 z-20"><div className="w-24 h-5 bg-foreground/10 rounded-full" /></div>
              <div className="flex-1 mt-14 p-6 space-y-5 overflow-hidden">
                <div className="space-y-1"><p className="text-xs text-foreground/50">Patrimônio</p><p className="text-3xl font-display font-bold">R$ 128k</p></div>
                <div className="h-40 w-full bg-gradient-to-br from-primary/10 to-accent/5 rounded-2xl border border-primary/10 relative overflow-hidden">
                  <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-primary/20 to-transparent" />
                </div>
                <div className="space-y-3">
                  <div className="h-16 w-full bg-foreground/5 rounded-2xl flex items-center px-4"><div className="w-10 h-10 rounded-full bg-background shrink-0"/> <div className="ml-3 h-3 w-20 bg-foreground/10 rounded-full"/></div>
                  <div className="h-16 w-full bg-foreground/5 rounded-2xl flex items-center px-4"><div className="w-10 h-10 rounded-full bg-background shrink-0"/> <div className="ml-3 h-3 w-24 bg-foreground/10 rounded-full"/></div>
                </div>
              </div>
              <div className="h-20 border-t border-border bg-background/90 backdrop-blur-md flex items-center justify-around px-6 pb-2 z-20">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-glow shadow-primary/30"/>
                <div className="w-8 h-8 rounded-full bg-foreground/10" />
                <div className="w-8 h-8 rounded-full bg-foreground/10" />
                <div className="w-8 h-8 rounded-full bg-foreground/10" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      <section className="py-32 px-6 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-6">Engenharia moderna focada em velocidade e escalabilidade.</h2>
          <p className="text-lg text-foreground/60 text-balance">Construído com tecnologias modernas para garantir performance, estabilidade e experiência premium em larga escala.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Front-End Moderno", desc: "React, Next.js e TypeScript para uma arquitetura escalável e consistente." },
            { title: "Experiência otimizada", desc: "Carregamento progressivo, animações suaves e renderização eficiente." },
            { title: "Arquitetura escalável", desc: "Estrutura preparada para crescimento contínuo e novas funcionalidades." },
            { title: "Experiência premium", desc: "Cada detalhe visual foi pensado para transmitir clareza, sofisticação e fluidez." }
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-6 border-l border-border hover:border-primary transition-colors">
              <h3 className="text-lg font-bold mb-3">{item.title}</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

  
      <section className="py-32 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-5xl mx-auto bg-foreground text-background rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-6 text-balance relative z-10">
            O futuro da gestão financeira começa agora.
          </h2>
          <p className="text-lg text-background/70 max-w-2xl mx-auto mb-10 relative z-10 text-balance">
            Experimente uma nova forma de acompanhar patrimônio, investimentos e metas financeiras com inteligência e simplicidade.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link href="/cadastro" className="w-full sm:w-auto bg-background text-foreground px-8 py-4 rounded-full text-sm font-bold transition-transform hover:scale-105">
              Criar conta
            </Link>
            <Link href="/demo" className="w-full sm:w-auto bg-transparent border border-background/20 text-background px-8 py-4 rounded-full text-sm font-bold transition-colors hover:bg-white/10">
              Acessar demonstração
            </Link>
          </div>
        </motion.div>
      </section>
      <Footer />

    </main>
  );
}