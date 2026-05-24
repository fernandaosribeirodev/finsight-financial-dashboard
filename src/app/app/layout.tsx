'use client';

import { AuthGuard } from '../../components/AuthGuard';
import { useAuth } from '../../contexts/AuthContext';
import { MonthProvider } from '@/contexts/MonthContext'; // <-- IMPORTAÇÃO DO MOTOR TEMPORAL
import { 
  LayoutDashboard, 
  Receipt, 
  TrendingUp, 
  CreditCard, 
  Settings, 
  LogOut, 
  Sparkles,
  Target,
  Bot,
  GraduationCap
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { logout, user } = useAuth();
  const pathname = usePathname();

  // Menu atualizado com as telas do método Primo Pobre
  const menuItems = [
    { icon: LayoutDashboard, label: 'Visão Geral', href: '/app' },
    { icon: Receipt, label: 'Transações', href: '/app/transacoes' },
    { icon: TrendingUp, label: 'Investimentos', href: '/app/investimentos' },
    { icon: CreditCard, label: 'Cartões', href: '/app/cartoes' },
    { icon: Target, label: 'Metas', href: '/app/metas' },
    { icon: Bot, label: 'Inteligência AI', href: '/app/ai' },
    { icon: GraduationCap, label: 'Educação Financeira', href: '/app/educacao' },
    { icon: Settings, label: 'Configurações', href: '/app/configuracoes' },
  ];

  return (
    <AuthGuard>
      {/* O MONTH PROVIDER AGORA ABRAÇA TODA A APLICAÇÃO LOGADA */}
      <MonthProvider>
        <div className="min-h-screen bg-background flex flex-col md:flex-row">
          
          {/* Sidebar Desktop */}
          <aside className="hidden md:flex w-64 border-r border-border bg-white/50 dark:bg-black/50 backdrop-blur-xl flex-col p-6 sticky top-0 h-screen">
            <div className="flex items-center gap-2 mb-10 px-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-foreground text-background">
                <Sparkles size={12} />
              </div>
              <span className="font-semibold tracking-tight">FinSight</span>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
              {menuItems.map((item) => {
                // Verifica se a rota atual começa com o href do item (para manter ativo em sub-rotas)
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-foreground text-background shadow-lg' 
                        : 'text-foreground/50 hover:bg-foreground/5 hover:text-foreground'
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <button 
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all mt-4 border-t border-border/50 pt-4"
            >
              <LogOut size={18} />
              Sair
            </button>
          </aside>

          {/* Conteúdo Principal */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Header Mobile */}
            <header className="h-16 border-b border-border bg-white/30 dark:bg-black/30 backdrop-blur-md flex items-center justify-between px-8 md:hidden">
               <span className="font-bold">FinSight</span>
               <button onClick={logout} className="text-destructive"><LogOut size={20}/></button>
            </header>
            
            <main className="flex-1 overflow-y-auto p-4 md:p-10">
              <div className="max-w-6xl mx-auto">
                {children}
              </div>
            </main>
          </div>

        </div>
      </MonthProvider>
    </AuthGuard>
  );
}