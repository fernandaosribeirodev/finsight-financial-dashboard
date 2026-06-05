'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, Menu, X } from 'lucide-react';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Trava o scroll do fundo quando o menu mobile está aberto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 flex justify-center pt-4 md:pt-6 px-4 pointer-events-none">
        <motion.nav
          initial={false}
          animate={{
            width: isScrolled ? '100%' : '100%',
            maxWidth: isScrolled ? '1000px' : '1200px',
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 40 }}
          className={`pointer-events-auto flex items-center justify-between px-5 md:px-6 py-3.5 transition-all duration-500 rounded-full ${
            isScrolled 
              ? 'bg-white/70 dark:bg-black/60 backdrop-blur-xl border border-border saturate-150 shadow-[0_8px_30px_rgb(0,0,0,0.04)]' 
              : 'bg-transparent border-transparent shadow-none'
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group focus-ring rounded-lg shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background transition-transform group-hover:scale-105">
              <Sparkles size={14} />
            </div>
            <span className="font-semibold text-lg tracking-tight">
              FinSight
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground/60">
            <Link href="#produto" className="hover:text-foreground transition-colors">Produto</Link>
            <Link href="#recursos" className="hover:text-foreground transition-colors">Recursos</Link>
            <Link href="#seguranca" className="hover:text-foreground transition-colors">Segurança</Link>
            <Link href="#precos" className="hover:text-foreground transition-colors">Preços</Link>
          </div>

          {/* Actions Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              Entrar
            </Link>
            <Link href="/cadastro" className="text-sm font-medium bg-foreground text-background px-5 py-2.5 rounded-full hover:scale-105 transition-transform duration-300 shadow-sm">
              Começar agora
            </Link>
          </div>

          {/* Botão Hamburger (Mobile) */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 text-foreground hover:bg-foreground/5 rounded-full transition-colors shrink-0"
            aria-label="Abrir menu"
          >
            <Menu size={24} />
          </button>
        </motion.nav>
      </header>

      {/* =========================================
          GAVETA DO MENU MOBILE (DRAWER)
      ========================================= */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex justify-end">
            {/* Fundo escuro borrado */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Gaveta deslizando da direita */}
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-[80%] max-w-sm h-full bg-background border-l border-border shadow-2xl flex flex-col p-6"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background">
                    <Sparkles size={14} />
                  </div>
                  <span className="font-semibold text-lg tracking-tight">FinSight</span>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 bg-foreground/5 hover:bg-foreground/10 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-6 text-lg font-medium text-foreground/80 flex-1">
                <Link href="#produto" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">Produto</Link>
                <Link href="#recursos" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">Recursos</Link>
                <Link href="#seguranca" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">Segurança</Link>
                <Link href="#precos" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">Preços</Link>
              </div>

              <div className="flex flex-col gap-4 mt-auto pt-6 border-t border-border/50">
                <Link 
                  href="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-4 text-center font-bold text-foreground border border-border rounded-2xl"
                >
                  Entrar
                </Link>
                <Link 
                  href="/cadastro" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-4 text-center font-bold bg-foreground text-background rounded-2xl"
                >
                  Começar agora
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}