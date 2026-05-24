'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none">
      <motion.nav
        initial={false}
        animate={{
          width: isScrolled ? '85%' : '100%',
          maxWidth: isScrolled ? '1000px' : '1200px',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
        className={`pointer-events-auto flex items-center justify-between px-6 py-3.5 transition-all duration-500 rounded-full ${
          isScrolled 
            ? 'bg-white/60 dark:bg-black/60 backdrop-blur-xl border border-border saturate-150 shadow-[0_8px_30px_rgb(0,0,0,0.04)]' 
            : 'bg-transparent border-transparent shadow-none'
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group focus-ring rounded-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background transition-transform group-hover:scale-105">
            <Sparkles size={14} />
          </div>
          <span className="font-semibold text-lg tracking-tight hidden sm:block">
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

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors hidden sm:block">
            Entrar
          </Link>
          <Link href="/cadastro" className="text-sm font-medium bg-foreground text-background px-5 py-2.5 rounded-full hover:scale-105 transition-transform duration-300 shadow-sm">
            Começar agora
          </Link>
        </div>
      </motion.nav>
    </header>
  );
}