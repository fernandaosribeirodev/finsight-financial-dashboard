'use client';

import { useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useMonth } from '@/contexts/MonthContext';
import { Calendar } from 'lucide-react';

export function MonthCarousel() {
  const { activeMonth, setActiveMonth } = useMonth();
  const carouselRef = useRef<HTMLDivElement>(null);

  // Gera a linha do tempo (6 meses passados, o atual, e 12 futuros)
  const monthsList = useMemo(() => {
    const list = [];
    const hoje = new Date();
    const anoAtual = hoje.getFullYear();
    const mesAtual = hoje.getMonth();

    for (let i = -6; i <= 12; i++) {
      const data = new Date(anoAtual, mesAtual + i, 1);
      const ano = data.getFullYear();
      const mesStr = String(data.getMonth() + 1).padStart(2, '0');
      
      list.push({
        id: `${ano}-${mesStr}`,
        label: data.toLocaleString('pt-BR', { month: 'long' }), // Nome completo: "maio"
        shortLabel: data.toLocaleString('pt-BR', { month: 'short' }).replace('.', ''), // "mai"
        year: ano,
        isCurrentMonth: i === 0,
      });
    }
    return list;
  }, []);

  // Faz o scroll automático e suave para o centro quando o mês muda
  useEffect(() => {
    if (carouselRef.current) {
      const activeElement = carouselRef.current.querySelector('[data-active="true"]') as HTMLElement;
      if (activeElement) {
        // Um pequeno delay garante que a UI já renderizou antes de animar o scroll
        setTimeout(() => {
          activeElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }, 50);
      }
    }
  }, [activeMonth]);

  // Função para voltar para o mês atual rapidamente
  const irParaHoje = () => {
    const hoje = new Date();
    const idHoje = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;
    setActiveMonth(idHoje);
  };

  return (
    <div className="w-full flex flex-col sm:flex-row items-center gap-4 mb-2">
      
      {/* Botão rápido para Voltar ao Presente (UX Avançado) */}
      <button 
        onClick={irParaHoje}
        className="hidden sm:flex items-center gap-2 px-4 py-3 rounded-2xl glass border border-border text-xs font-bold text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-colors shadow-sm shrink-0"
        title="Voltar para o mês atual"
      >
        <Calendar size={16} />
        Hoje
      </button>

      {/* O Floating Dock (Carrossel Principal) */}
      <div className="relative w-full overflow-hidden rounded-[2rem] p-1.5 glass border border-border/50 bg-foreground/[0.02] shadow-inner">
        
        {/* Máscara de Gradiente (Fade nas bordas) - A magia do CSS aqui! */}
        <div 
          className="w-full overflow-x-auto no-scrollbar snap-x snap-mandatory flex items-center"
          ref={carouselRef}
          style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}
        >
          {monthsList.map((month) => {
            const isActive = activeMonth === month.id;

            return (
              <button
                key={month.id}
                data-active={isActive}
                onClick={() => setActiveMonth(month.id)}
                className={`relative px-6 py-3 rounded-full flex flex-col items-center justify-center transition-all duration-300 snap-center shrink-0 group ${
                  isActive ? 'scale-100' : 'scale-95 opacity-50 hover:opacity-100 hover:scale-100'
                }`}
              >
                {/* A "Pílula" Flutuante Ativa com Framer Motion */}
                {isActive && (
                  <motion.div
                    layoutId="activeMonthBubble"
                    className="absolute inset-0 bg-foreground shadow-lg rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                
                {/* Textos */}
                <span className={`relative z-10 font-bold capitalize transition-colors ${isActive ? 'text-background text-sm' : 'text-foreground text-xs'}`}>
                  {isActive ? month.label : month.shortLabel}
                </span>
                
                {/* Ano (Mostra pequeno em baixo, destaca se for outro ano) */}
                {(month.year !== new Date().getFullYear() || isActive) && (
                  <span className={`relative z-10 text-[9px] font-bold tracking-widest mt-0.5 transition-colors ${isActive ? 'text-background/70' : 'text-foreground/40'}`}>
                    {month.year}
                  </span>
                )}

                {/* Bolinha indicadora do mês corrente real */}
                {month.isCurrentMonth && !isActive && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}