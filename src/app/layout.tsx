import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../contexts/AuthContext'; // <-- IMPORTAMOS O PROVIDER AQUI

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'FinSight | Inteligência Financeira',
  description: 'Controle seu patrimônio com a experiência mais premium do mercado.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable}`}>
      <body 
        className="font-sans relative min-h-screen bg-background overflow-x-hidden text-foreground selection:bg-primary/30 selection:text-foreground"
        style={{ fontFeatureSettings: '"cv11", "ss01"' }}
      >
        {/* Envolvendo a aplicação inteira com a nossa lógica de sessão real */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}