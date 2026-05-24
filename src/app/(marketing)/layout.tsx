'use client';

import { Header } from '../../components/Header';

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Spatial UI: O fundo Gradient Mesh exclusivo da Landing Page */}
      <div className="pointer-events-none fixed inset-0 -z-10 h-full w-full bg-gradient-mesh opacity-50 dark:opacity-30" />
      
      {/* O Header flutuante agora só aparece na Landing Page */}
      <Header />

      {/* Renderiza o conteúdo do seu page.tsx principal */}
      {children}
    </>
  );
}