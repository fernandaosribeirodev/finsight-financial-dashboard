'use client';

import { useSettings } from '@/contexts/SettingsContext';
import { 
  Settings, Eye, Languages, Accessibility, 
  Moon, Sun 
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ConfiguracoesPage() {
  const { 
    tema, idioma, modoLeitura, 
    toggleTema, alterarIdioma, toggleModoLeitura, traduzir, isMounted 
  } = useSettings();

  // Previne renderização antes da hidratação para evitar erros visuais
  if (!isMounted) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-16 max-w-7xl mx-auto"
    >
      
      {/* CABEÇALHO */}
      <section className="border-b border-border/40 pb-4">
        <h2 className="text-3xl font-display font-bold tracking-tight flex items-center gap-3">
          {traduzir('configTitle')} <Settings className="text-primary animate-[spin_20s_linear_infinite]" size={26} aria-hidden="true" />
        </h2>
        <p className="text-foreground/50 mt-1">{traduzir('configSub')}</p>
      </section>

      {/* BENTO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CARD PRINCIPAL: INCLUSÃO DIGITAL */}
        <div className="glass p-8 rounded-3xl border border-border bg-gradient-to-br from-primary/5 to-transparent flex flex-col justify-between lg:col-span-1 min-h-[260px]">
          <div className="p-4 rounded-2xl bg-primary/10 text-primary w-fit">
            <Accessibility size={28} aria-hidden="true" />
          </div>
          <div className="space-y-2 mt-6">
            <h3 className="font-display font-bold text-xl">{traduzir('cardAccess')}</h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              {traduzir('cardAccessSub')}
            </p>
          </div>
        </div>

        {/* GRUPO DE CONTROLES VISUAIS */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* CONTROL 1: DARK & LIGHT MODE */}
          <button 
            onClick={toggleTema}
            aria-label={`Alternar para modo ${tema === 'claro' ? 'escuro' : 'claro'}`}
            className="glass p-6 rounded-3xl border border-border text-left flex flex-col justify-between hover:border-primary/40 transition-all group focus-ring"
          >
            <div className="flex justify-between items-center w-full">
              <div className="p-3 rounded-xl bg-foreground/5 text-foreground group-hover:text-primary transition-colors">
                {tema === 'escuro' ? <Moon size={20} aria-hidden="true" /> : <Sun size={20} aria-hidden="true" />}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 bg-foreground/5 px-2.5 py-1 rounded-full">
                {tema === 'escuro' ? 'Dark' : 'Light'}
              </span>
            </div>
            <div className="mt-4">
              <h4 className="font-bold text-base">{traduzir('themeTitle')}</h4>
              <p className="text-xs text-foreground/50 mt-1">{traduzir('themeSub')}</p>
            </div>
          </button>

          {/* CONTROL 2: MODO LEITURA */}
          <button 
            onClick={toggleModoLeitura}
            aria-pressed={modoLeitura}
            aria-label="Ativar modo de leitura de alto contraste"
            className={`glass p-6 rounded-3xl border text-left flex flex-col justify-between transition-all group focus-ring ${modoLeitura ? 'border-success/40 bg-success/5' : 'border-border hover:border-primary/40'}`}
          >
            <div className="flex justify-between items-center w-full">
              <div className={`p-3 rounded-xl ${modoLeitura ? 'bg-success/20 text-success' : 'bg-foreground/5 text-foreground'}`}>
                <Eye size={20} aria-hidden="true" />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${modoLeitura ? 'bg-success/20 text-success' : 'bg-foreground/5 text-foreground/40'}`}>
                {modoLeitura ? traduzir('btnAtivado') : traduzir('btnAtivar')}
              </span>
            </div>
            <div className="mt-4">
              <h4 className="font-bold text-base">{traduzir('readTitle')}</h4>
              <p className="text-xs text-foreground/50 mt-1">{traduzir('readSub')}</p>
            </div>
          </button>

          {/* CONTROL 3: IDIOMAS */}
          <div className="glass p-6 rounded-3xl border border-border flex flex-col justify-between md:col-span-2 lg:col-span-1">
            <div className="flex justify-between items-center">
              <div className="p-3 rounded-xl bg-foreground/5 text-foreground">
                <Languages size={20} aria-hidden="true" />
              </div>
              <select 
                value={idioma} 
                onChange={(e) => alterarIdioma(e.target.value as any)}
                aria-label="Selecionar Idioma"
                className="bg-background border border-border px-3 py-1.5 rounded-xl text-xs font-bold font-display outline-none focus:border-primary transition-colors cursor-pointer focus-ring"
              >
                <option value="pt">Português (BR)</option>
                <option value="en">English (US)</option>
                <option value="es">Español (ES)</option>
              </select>
            </div>
            <div className="mt-4">
              <h4 className="font-bold text-base">{traduzir('langTitle')}</h4>
              <p className="text-xs text-foreground/50 mt-1">{traduzir('langSub')}</p>
            </div>
          </div>

        </div>
      </div>

    </motion.div>
  );
}