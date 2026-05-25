'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, TrendingUp, CreditCard, 
  Target, GraduationCap, Settings, LogOut 
} from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { MonthProvider } from '@/contexts/MonthContext';
import { useAuth } from '@/contexts/AuthContext'; // 1. Puxando o seu Contexto de Autenticação

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { traduzir, isMounted } = useSettings();
  
  // 2. Extraindo a função de logout do Firebase (ajuste para signOut se for esse o nome no seu context)
  const { logout } = useAuth(); 

  const menuItems = [
    { icon: LayoutDashboard, label: traduzir('visGeral'), href: '/app' },
    { icon: TrendingUp, label: traduzir('investimentos'), href: '/app/investimentos' },
    { icon: CreditCard, label: traduzir('cartoes'), href: '/app/cartoes' },
    { icon: Target, label: traduzir('metas'), href: '/app/metas' },
    { icon: GraduationCap, label: traduzir('eduFin'), href: '/app/educacao' },
    { icon: Settings, label: traduzir('configTitle'), href: '/app/configuracoes' },
  ];

  // 3. Função segura para Sair da Conta
  const handleSairDaConta = async () => {
    try {
      if (logout) {
        await logout(); // Desloga do Firebase
      }
      // Redireciona para a Landing Page
      router.push('/');
    } catch (error) {
      console.error('Erro ao sair da conta:', error);
      router.push('/'); // Redireciona mesmo em caso de erro local
    }
  };

  return (
    <MonthProvider>
      <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
        
        {/* BARRA LATERAL (SIDEBAR) */}
        <aside className="w-64 border-r border-border/50 bg-foreground/[0.01] p-6 flex flex-col justify-between hidden md:flex">
          <div className="space-y-8">
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
          </div>

          {/* BOTÃO DE LOGOUT ATIVADO */}
          <button 
            onClick={handleSairDaConta}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors focus-ring w-full mt-auto" 
            aria-label="Sair da conta"
          >
            <LogOut size={18} aria-hidden="true" />
            {isMounted ? traduzir('btnSair') : 'Sair'}
          </button>
        </aside>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="flex-1 p-6 md:p-10 max-h-screen overflow-y-auto custom-scrollbar" id="main-content" tabIndex={-1}>
          {children}
        </main>

      </div>
    </MonthProvider>
  );
}