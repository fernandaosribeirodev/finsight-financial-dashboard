import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-foreground/[0.02] border-t border-border/50 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-20">
          <div className="col-span-2 lg:col-span-2 pr-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-foreground text-background">
                <Sparkles size={12} />
              </div>
              <span className="font-semibold tracking-tight">FinSight</span>
            </div>
            <p className="text-sm text-foreground/50 max-w-sm leading-relaxed">
              A plataforma financeira premium para uma nova era de inteligência patrimonial.
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-sm">Produto</h4>
            <Link href="#" className="text-sm text-foreground/60 hover:text-foreground">Visão geral</Link>
            <Link href="#" className="text-sm text-foreground/60 hover:text-foreground">Recursos</Link>
            <Link href="#" className="text-sm text-foreground/60 hover:text-foreground">Segurança</Link>
            <Link href="#" className="text-sm text-foreground/60 hover:text-foreground">Preços</Link>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-sm">Empresa</h4>
            <Link href="#" className="text-sm text-foreground/60 hover:text-foreground">Sobre</Link>
            <Link href="#" className="text-sm text-foreground/60 hover:text-foreground">Carreiras</Link>
            <Link href="#" className="text-sm text-foreground/60 hover:text-foreground">Imprensa</Link>
            <Link href="#" className="text-sm text-foreground/60 hover:text-foreground">Contato</Link>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-sm">Recursos</h4>
            <Link href="#" className="text-sm text-foreground/60 hover:text-foreground">Central de ajuda</Link>
            <Link href="#" className="text-sm text-foreground/60 hover:text-foreground">API</Link>
            <Link href="#" className="text-sm text-foreground/60 hover:text-foreground">Status</Link>
            <Link href="#" className="text-sm text-foreground/60 hover:text-foreground">Comunidade</Link>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-foreground/40 font-medium">© 2026 FinSight. Todos os direitos reservados.</p>
          <p className="text-xs text-foreground/40 font-medium">Feito com precisão · São Paulo · Brasil</p>
        </div>
      </div>
    </footer>
  );
}