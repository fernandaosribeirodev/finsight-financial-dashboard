import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import { AppProviders } from '@/providers/AppProviders';
import './globals.css';

// Configuração das Fontes
const fontSans = Inter({ 
  subsets: ['latin'], 
  variable: '--font-sans',
});

const fontDisplay = Outfit({ 
  subsets: ['latin'], 
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'FinSight - Controle Financeiro',
  description: 'A sua plataforma inteligente de gestão de patrimônio.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body 
        className={`${fontSans.variable} ${fontDisplay.variable} font-sans antialiased min-h-screen bg-background text-foreground transition-colors duration-300`}
      >
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}