'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, TrendingUp, CreditCard, 
  Target, GraduationCap, Settings, LogOut, Menu, X
} from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { MonthProvider } from '@/contexts/MonthContext';
import { useAuth } from '@/contexts/AuthContext';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { traduzir, isMounted } = useSettings();
  
  const { logout } = useAuth(); 
  
  // Estado para controlar a abertura da gaveta (menu mobile)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: traduzir('visGeral'), href: '/app' },
    { icon: TrendingUp, label: traduzir('investimentos'), href: '/app/investimentos' },
    { icon: CreditCard, label: traduzir('cartoes'), href: '/app/cartoes' },
    { icon: Target, label: traduzir('metas'), href: '/app/metas' },
    { icon: GraduationCap, label: traduzir('eduFin'), href: '/app/educacao' },
    { icon: Settings, label: traduzir('configTitle'), href: '/app/configuracoes' },
  ];

  const handleSairDaConta = async () => {
    try {
      if (logout) {
        await logout(); 
      }
      router.push('/');
    } catch (error) {
      console.error('Erro ao sair da conta:', error);
      router.push('/'); 
    }
  };

  // Trava o scroll do fundo quando o menu mobile está aberto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isMobileMenuOpen]);

  // Fecha o menu mobile automaticamente ao trocar de rota (clicar em um link)
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <MonthProvider>
      <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
        
        {/* =========================================
            HEADER MOBILE FIXO (Só aparece em telas pequenas)
        ========================================= */}
        <header className="md:hidden fixed top-0 left-0 right-0 h-16 z-30 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold">
              F
            </div>
            <span className="font-display font-bold tracking-tight">FinSight</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -mr-2 text-foreground hover:bg-foreground/5 rounded-full transition-colors"
            aria-label="Abrir menu lateral"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* =========================================
            BARRA LATERAL DESKTOP (SIDEBAR CLÁSSICA)
        ========================================= */}
        <aside className="w-64 border-r border-border/50 bg-foreground/[0.01] p-6 flex-col justify-between hidden md:flex shrink-0">
          <div className="space-y-8 sticky top-6">
            <div className="flex items-center gap-3 px-2 focus-ring" tabIndex={0} aria-label="Logo FinSight">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold">
                F
              </div>
              <span className="font-display font-bold text-xl tracking-tight">FinSight</span>
            </div>

            <nav className="space-y-1.5" aria-label="Menu Principal">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group focus-ring ${
                      isActive 
                        ? 'bg-foreground text-background dark:bg-white dark:text-black font-bold shadow-md' 
                        : 'text-foreground/60 hover:bg-foreground/5 hover:text-foreground'
                    }`}
                  >
                    <item.icon size={18} className={isActive ? 'text-primary' : 'text-foreground/40 group-hover:text-foreground/70'} aria-hidden="true" />
                    {isMounted ? item.label : '...'}
                  </Link>
                );
              })}
            </nav>
            
            <button 
              onClick={handleSairDaConta}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors focus-ring w-full mt-8" 
              aria-label="Sair da conta"
            >
              <LogOut size={18} aria-hidden="true" />
              {isMounted ? traduzir('btnSair') : 'Sair'}
            </button>
          </div>
        </aside>

        {/* =========================================
            MENU MOBILE DESLIZANTE (DRAWER)
        ========================================= */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-50 md:hidden flex justify-start">
              {/* Fundo escuro borrado */}
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              
              {/* Gaveta deslizando da esquerda */}
              <motion.div 
                initial={{ x: '-100%' }} 
                animate={{ x: 0 }} 
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative w-[75%] max-w-sm h-full bg-background border-r border-border shadow-2xl flex flex-col p-6 overflow-y-auto custom-scrollbar"
              >
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold">
                      F
                    </div>
                    <span className="font-display font-bold tracking-tight">FinSight</span>
                  </div>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 -mr-2 bg-foreground/5 hover:bg-foreground/10 rounded-full transition-colors"
                    aria-label="Fechar menu"
                  >
                    <X size={20} />
                  </button>
                </div>

                <nav className="flex flex-col gap-2 flex-1" aria-label="Menu Mobile">
                  {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all group ${
                          isActive 
                            ? 'bg-foreground text-background dark:bg-white dark:text-black font-bold shadow-md' 
                            : 'text-foreground/70 hover:bg-foreground/5'
                        }`}
                      >
                        <item.icon size={20} className={isActive ? 'text-primary' : 'text-foreground/50'} aria-hidden="true" />
                        {isMounted ? item.label : '...'}
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-8 pt-6 border-t border-border/50">
                  <button 
                    onClick={handleSairDaConta}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-destructive bg-destructive/10 hover:bg-destructive/20 transition-colors" 
                  >
                    <LogOut size={18} aria-hidden="true" />
                    {isMounted ? traduzir('btnSair') : 'Sair'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* =========================================
            CONTEÚDO PRINCIPAL (COM PADDING EXTRA NO MOBILE)
        ========================================= */}
        {/* pt-20 no mobile para o conteúdo não ficar embaixo do novo Mobile Header */}
        <main className="flex-1 p-4 pt-20 md:p-10 max-h-screen overflow-y-auto custom-scrollbar relative" id="main-content" tabIndex={-1}>
          {children}
        </main>

      </div>
    </MonthProvider>
  );
}