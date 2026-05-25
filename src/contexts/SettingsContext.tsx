'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Tema = 'claro' | 'escuro';
type Idioma = 'pt' | 'en' | 'es';

interface SettingsContextType {
  tema: Tema;
  idioma: Idioma;
  modoLeitura: boolean;
  toggleTema: () => void;
  alterarIdioma: (id: Idioma) => void;
  toggleModoLeitura: () => void;
  traduzir: (chave: string) => string;
  isMounted: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const TRADUCOES = {
  pt: {
    visGeral: 'Visão Geral', investimentos: 'Investimentos', cartoes: 'Cartões', metas: 'Metas', eduFin: 'Educação Financeira', btnSair: 'Sair da Conta',
    configTitle: 'Configurações do Sistema', configSub: 'Gerencie o comportamento visual e as preferências da sua plataforma.',
    cardAccess: 'Tecnologia acessível para todos.', cardAccessSub: 'O FinSight foi desenvolvido com foco em inclusão digital.',
    themeTitle: 'Dark & Light Mode', themeSub: 'Alternância inteligente entre modos claro e escuro.',
    readTitle: 'Modo Leitura', readSub: 'Interface otimizada para reduzir distrações e melhorar legibilidade.',
    langTitle: 'Suporte multilíngue', langSub: 'Experiência preparada para múltiplos idiomas.',
    keyTitle: 'Navegação por teclado', keySub: 'Compatibilidade completa com navegação sem mouse.',
    screenTitle: 'Screen Readers', screenSub: 'Estrutura semântica nativa e tags ARIA compatíveis.',
    btnAtivar: 'Ativar', btnAtivado: 'Ativado',
    // DASHBOARD TRADUÇÕES
    dashSub: 'Seu controle financeiro inteligente.', btnAddCompra: 'Adicionar Compra', entradasMes: 'Entradas Mês',
    essencial: 'Essencial', naoEssencial: 'Não Essencial', sobraPrevista: 'A Sobra Prevista',
    raiox: 'Raio-X do Mês Selecionado', custoEssencial: 'Custo Essencial', daRenda: 'da renda',
    metaReserva: 'Meta de Reserva', seisMeses: '6 Meses', custo: 'Custo', alvoIdeal: 'Alvo Ideal',
    movimentos: 'Movimentos do Mês', nenhumReg: 'Nenhum registo neste mês', manterCustos: 'Mantenha os custos Essenciais baixos para atingir o alvo mais rápido.'
  },
  en: {
    visGeral: 'Dashboard', investimentos: 'Investments', cartoes: 'Cards', metas: 'Goals', eduFin: 'Financial Education', btnSair: 'Log Out',
    configTitle: 'System Settings', configSub: 'Manage visual behavior and preferences for your platform.',
    cardAccess: 'Accessible technology for everyone.', cardAccessSub: 'FinSight was developed with a focus on digital inclusion.',
    themeTitle: 'Dark & Light Mode', themeSub: 'Smart switching between light and dark modes.',
    readTitle: 'Reading Mode', readSub: 'Optimized interface to reduce distractions and improve readability.',
    langTitle: 'Multilingual Support', langSub: 'Experience prepared for multiple languages.',
    keyTitle: 'Keyboard Navigation', keySub: 'Full compatibility with mouse-free navigation.',
    screenTitle: 'Screen Readers', screenSub: 'Native semantic structure and ARIA tags compatible.',
    btnAtivar: 'Activate', btnAtivado: 'Activated',
    // DASHBOARD TRADUÇÕES
    dashSub: 'Your smart financial control.', btnAddCompra: 'Add Expense', entradasMes: 'Monthly Income',
    essencial: 'Essential', naoEssencial: 'Non-Essential', sobraPrevista: 'Expected Surplus',
    raiox: 'Selected Month X-Ray', custoEssencial: 'Essential Cost', daRenda: 'of income',
    metaReserva: 'Emergency Fund Goal', seisMeses: '6 Months', custo: 'Cost', alvoIdeal: 'Ideal Target',
    movimentos: 'Monthly Transactions', nenhumReg: 'No records this month', manterCustos: 'Keep Essential costs low to hit your target faster.'
  },
  es: {
    visGeral: 'Resumen', investimentos: 'Inversiones', cartoes: 'Tarjetas', metas: 'Metas', eduFin: 'Educación Financiera', btnSair: 'Cerrar Sesión',
    configTitle: 'Configuraciones del Sistema', configSub: 'Gestione el comportamiento visual y las preferencias.',
    cardAccess: 'Tecnología accesible para todos.', cardAccessSub: 'FinSight fue desarrollado con un enfoque en la inclusión digital.',
    themeTitle: 'Dark & Light Mode', themeSub: 'Alternancia inteligente entre modos claro y oscuro.',
    readTitle: 'Modo de Lectura', readSub: 'Interfaz optimizada para reducir distracciones.',
    langTitle: 'Soporte Multilingüe', langSub: 'Experiencia preparada para múltiples idiomas.',
    keyTitle: 'Navegación por teclado', keySub: 'Compatibilidad completa con navegación sin mouse.',
    screenTitle: 'Lectores de Pantalla', screenSub: 'Estructura semántica nativa y etiquetas ARIA.',
    btnAtivar: 'Activar', btnAtivado: 'Activado',
    // DASHBOARD TRADUÇÕES
    dashSub: 'Tu control financiero inteligente.', btnAddCompra: 'Añadir Gasto', entradasMes: 'Ingresos del Mes',
    essencial: 'Esencial', naoEssencial: 'No Esencial', sobraPrevista: 'Sobrante Previsto',
    raiox: 'Radiografía del Mes Seleccionado', custoEssencial: 'Costo Esencial', daRenda: 'de los ingresos',
    metaReserva: 'Meta de Reserva', seisMeses: '6 Meses', custo: 'Costo', alvoIdeal: 'Objetivo Ideal',
    movimentos: 'Movimientos del Mes', nenhumReg: 'No hay registros este mes', manterCustos: 'Mantén los costos Esenciales bajos para alcanzar el objetivo más rápido.'
  }
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [tema, setTema] = useState<Tema>('claro');
  const [idioma, setIdioma] = useState<Idioma>('pt');
  const [modoLeitura, setModoLeitura] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('@FinSight:tema') as Tema;
    const savedLang = localStorage.getItem('@FinSight:idioma') as Idioma;
    const savedReading = localStorage.getItem('@FinSight:leitura') === 'true';

    if (savedTheme) setTema(savedTheme);
    if (savedLang) setIdioma(savedLang);
    if (savedReading) setModoLeitura(savedReading);
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const root = window.document.documentElement;
    
    if (tema === 'escuro') root.classList.add('dark');
    else root.classList.remove('dark');

    if (modoLeitura) root.classList.add('modo-leitura');
    else root.classList.remove('modo-leitura');

    localStorage.setItem('@FinSight:tema', tema);
    localStorage.setItem('@FinSight:idioma', idioma);
    localStorage.setItem('@FinSight:leitura', String(modoLeitura));
  }, [tema, idioma, modoLeitura, isMounted]);

  const toggleTema = () => setTema((prev) => (prev === 'claro' ? 'escuro' : 'claro'));
  const alterarIdioma = (id: Idioma) => setIdioma(id);
  const toggleModoLeitura = () => setModoLeitura((prev) => !prev);
  const traduzir = (chave: string) => {
    return (TRADUCOES[idioma] as any)[chave] || chave;
  };

  return (
    <SettingsContext.Provider value={{ tema, idioma, modoLeitura, toggleTema, alterarIdioma, toggleModoLeitura, traduzir, isMounted }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings deve ser usado dentro de um SettingsProvider');
  return context;
}