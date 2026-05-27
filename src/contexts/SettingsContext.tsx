'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Tema = 'claro' | 'escuro';
type Idioma = 'pt' | 'en' | 'es';

interface SettingsContextData {
  tema: Tema;
  idioma: Idioma;
  modoLeitura: boolean;
  toggleTema: () => void;
  alterarIdioma: (novoIdioma: Idioma) => void;
  toggleModoLeitura: () => void;
  traduzir: (chave: string) => string;
  isMounted: boolean;
}

const SettingsContext = createContext<SettingsContextData>({} as SettingsContextData);

const dicionario: Record<string, Record<Idioma, string>> = {
  // Configurações e Menu
  visGeral: { pt: 'Visão Geral', en: 'Dashboard', es: 'Resumen' },
  investimentos: { pt: 'Investimentos', en: 'Investments', es: 'Inversiones' },
  cartoes: { pt: 'Cartões', en: 'Credit Cards', es: 'Tarjetas' },
  metas: { pt: 'Metas e Caixinhas', en: 'Goals & Savings', es: 'Metas y Ahorros' },
  eduFin: { pt: 'Educação Financeira', en: 'Financial Education', es: 'Educación Financiera' },
  configTitle: { pt: 'Configurações', en: 'Settings', es: 'Configuraciones' },
  configSub: { pt: 'Ajuste a sua experiência', en: 'Adjust your experience', es: 'Ajusta tu experiencia' },
  btnSair: { pt: 'Sair da conta', en: 'Sign Out', es: 'Cerrar sesión' },
  cardAccess: { pt: 'Acessibilidade em Foco', en: 'Accessibility Focused', es: 'Accesibilidad en Foco' },
  cardAccessSub: { pt: 'Nossa interface foi desenhada para todos.', en: 'Our interface is designed for everyone.', es: 'Nuestra interfaz fue diseñada para todos.' },
  themeTitle: { pt: 'Tema do Sistema', en: 'System Theme', es: 'Tema del Sistema' },
  themeSub: { pt: 'Escolha o visual que mais lhe agrada.', en: 'Choose the look you prefer.', es: 'Elige el aspecto que más te guste.' },
  btnAtivado: { pt: 'Ativado', en: 'On', es: 'Activado' },
  btnAtivar: { pt: 'Ativar', en: 'Turn On', es: 'Activar' },
  readTitle: { pt: 'Modo Leitura', en: 'Reading Mode', es: 'Modo Lectura' },
  readSub: { pt: 'Aumenta o contraste e tamanho da fonte.', en: 'Increases contrast and font size.', es: 'Aumenta el contraste y tamaño de fuente.' },
  langTitle: { pt: 'Idioma', en: 'Language', es: 'Idioma' },
  langSub: { pt: 'Selecione o idioma da interface.', en: 'Select the interface language.', es: 'Selecciona el idioma de la interfaz.' },
  
  // Dashboard
  dashSub: { pt: 'Acompanhe as suas finanças', en: 'Track your finances', es: 'Sigue tus finanzas' },
  btnAddCompra: { pt: 'Novo Lançamento', en: 'New Transaction', es: 'Nueva Transacción' },
  entradasMes: { pt: 'Entradas', en: 'Incomes', es: 'Ingresos' },
  essencial: { pt: 'Essencial', en: 'Needs', es: 'Esencial' },
  naoEssencial: { pt: 'Não Essencial', en: 'Wants', es: 'No Esencial' },
  sobraPrevista: { pt: 'Sobra Prevista', en: 'Expected Leftover', es: 'Sobrante Esperado' },
  movimentos: { pt: 'Movimentos', en: 'Transactions', es: 'Movimientos' },
  nenhumReg: { pt: 'Nenhum registo.', en: 'No records.', es: 'Ningún registro.' },
  editarLancamento: { pt: 'Editar Lançamento', en: 'Edit Transaction', es: 'Editar Transacción' },
  salvarLancamento: { pt: 'Salvar Lançamento', en: 'Save Transaction', es: 'Guardar Transacción' },

  // Metas
  metasSub: { pt: 'Dê nome ao seu dinheiro.', en: 'Name your money.', es: 'Dale nombre a tu dinero.' },
  novaMeta: { pt: 'Nova Meta', en: 'New Goal', es: 'Nueva Meta' },
  sobraMesLivre: { pt: 'Sobra do Mês (Livre)', en: 'Monthly Leftover (Free)', es: 'Sobrante del Mes (Libre)' },
  semMetas: { pt: 'Você ainda não tem metas', en: 'You have no goals yet', es: 'Aún no tienes metas' },
  criePrimeiraMeta: { pt: 'Crie a sua primeira caixinha.', en: 'Create your first savings box.', es: 'Crea tu primera caja.' },
  criarMeta: { pt: 'Criar Meta', en: 'Create Goal', es: 'Crear Meta' },
  concluido: { pt: 'concluído', en: 'completed', es: 'completado' },
  prazo: { pt: 'Prazo', en: 'Deadline', es: 'Plazo' },
  guarde: { pt: 'Guarde', en: 'Save', es: 'Guarda' },
  mes: { pt: '/mês', en: '/month', es: '/mes' },
  guardarDinheiro: { pt: 'Guardar Dinheiro', en: 'Save Money', es: 'Ahorrar Dinero' },
  metaAlcancada: { pt: 'Meta Alcançada! 🎉', en: 'Goal Achieved! 🎉', es: '¡Meta Alcanzada! 🎉' },
  editarMeta: { pt: 'Editar Meta', en: 'Edit Goal', es: 'Editar Meta' },
  investirMeta: { pt: 'Investir na Meta', en: 'Invest in Goal', es: 'Invertir en Meta' },
  quantoGuardarHoje: { pt: 'Quanto quer guardar hoje?', en: 'How much do you want to save today?', es: '¿Cuánto quieres guardar hoy?' },
  saldoInsuficiente: { pt: 'Saldo insuficiente.', en: 'Insufficient balance.', es: 'Saldo insuficiente.' },
  confirmarInvestimento: { pt: 'Confirmar', en: 'Confirm', es: 'Confirmar' },

  // Investimentos
  invSub: { pt: 'Acompanhe seus ativos e converse com a IA.', en: 'Track your assets and chat with AI.', es: 'Sigue tus activos y habla con la IA.' },
  novoAtivo: { pt: 'Novo Ativo', en: 'New Asset', es: 'Nuevo Activo' },
  patrimonio: { pt: 'Patrimônio', en: 'Net Worth', es: 'Patrimonio' },
  valorInvestido: { pt: 'Valor Investido', en: 'Invested Amount', es: 'Valor Invertido' },
  rendimento: { pt: 'Rendimento', en: 'Yield', es: 'Rendimiento' },
  crescimentoPatrimonial: { pt: 'Crescimento Patrimonial', en: 'Wealth Growth', es: 'Crecimiento Patrimonial' },
  distribuicao: { pt: 'Distribuição', en: 'Distribution', es: 'Distribución' },
  semAtivos: { pt: 'Sem ativos', en: 'No assets', es: 'Sin activos' },
  editarAtivo: { pt: 'Editar Ativo', en: 'Edit Asset', es: 'Editar Activo' },
  adicionarAtivo: { pt: 'Adicionar Ativo', en: 'Add Asset', es: 'Añadir Activo' },

  // Cartões
  cartoesSub: { pt: 'Gerencie seus limites.', en: 'Manage your limits.', es: 'Gestiona tus límites.' },
  novoCartao: { pt: 'Novo Cartão', en: 'New Card', es: 'Nueva Tarjeta' },
  nenhumCartao: { pt: 'Nenhum cartão cadastrado', en: 'No registered cards', es: 'Ninguna tarjeta registrada' },
  adicionarCartao: { pt: 'Adicionar Cartão', en: 'Add Card', es: 'Añadir Tarjeta' },
  venceDia: { pt: 'Vence dia', en: 'Due on', es: 'Vence el' },
  limiteDisponivel: { pt: 'Limite Disponível', en: 'Available Limit', es: 'Límite Disponible' },
  faturaPrevista: { pt: 'Fatura Prevista', en: 'Expected Bill', es: 'Factura Prevista' },
  usoLimiteTotal: { pt: 'Uso do Limite Total', en: 'Total Limit Usage', es: 'Uso del Límite Total' },
  comprometido: { pt: 'Comprometido', en: 'Committed', es: 'Comprometido' },
  total: { pt: 'Total', en: 'Total', es: 'Total' },
  editarCartao: { pt: 'Editar Cartão', en: 'Edit Card', es: 'Editar Tarjeta' },
  
  // Compartilhados
  Quantidade: { pt: 'Quantidade', en: 'Quantity', es: 'Cantidad' },
  'Preço (R$)': { pt: 'Preço', en: 'Price', es: 'Precio' },
  Salvar: { pt: 'Salvar', en: 'Save', es: 'Guardar' },

  // Educação Financeira
  eduFinDesc: { pt: 'Sua jornada para a independência financeira começa aqui.', en: 'Your journey to financial independence starts here.', es: 'Tu viaje hacia la independencia financiera comienza aquí.' },
  seuNivel: { pt: 'Seu Nível', en: 'Your Level', es: 'Tu Nivel' },
  invIniciante: { pt: 'Investidor Iniciante', en: 'Beginner Investor', es: 'Inversor Principiante' },
  aulaTitulo1: { pt: 'Como fazer sua ', en: 'How to build your ', es: 'Cómo construir tu ' },
  aulaTitulo2: { pt: 'Reserva de Emergência', en: 'Emergency Fund', es: 'Fondo de Emergencia' },
  aulaTitulo3: { pt: ' do jeito certo', en: ' the right way', es: ' de la manera correcta' },
  aulaDesc: { pt: 'Aprenda com o Primo Pobre, com uma linguagem super didática a como fazer uma reserva de emergência e proteger o que mais importa para você.', en: 'Learn with Primo Pobre, with a super didactic language how to build an emergency fund and protect what matters most to you.', es: 'Aprende con Primo Pobre, con un lenguaje súper didáctico, a hacer un fondo de emergencia y proteger lo que más importa.' },
  assistirAula: { pt: 'Assistir Aula Completa', en: 'Watch Full Class', es: 'Ver Clase Completa' },
  lerGuia: { pt: 'Ler Guia Escrito', en: 'Read Written Guide', es: 'Leer Guía Escrita' },
  ideiasRenda: { pt: 'Ideias de Renda Extra', en: 'Extra Income Ideas', es: 'Ideas de Ingresos Extra' },
  leituras: { pt: 'Leituras Essenciais', en: 'Essential Readings', es: 'Lecturas Esenciales' },
  simulador: { pt: 'Simulador de Juros Compostos', en: 'Compound Interest Simulator', es: 'Simulador de Interés Compuesto' },
  simDesc: { pt: 'Descubra em quanto tempo você atingirá a sua independência financeira investindo um pouco todos os meses.', en: 'Discover how long it will take to reach your financial independence by investing a little every month.', es: 'Descubre en cuánto tiempo alcanzarás tu independencia financiera invirtiendo un poco todos los meses.' },
  abrirCalc: { pt: 'Abrir Calculadora', en: 'Open Calculator', es: 'Abrir Calculadora' },
  valorInicial: { pt: 'Valor Inicial (R$)', en: 'Initial Amount ($)', es: 'Monto Inicial ($)' },
  aporteMensal: { pt: 'Aporte Mensal (R$)', en: 'Monthly Contribution ($)', es: 'Aporte Mensual ($)' },
  taxaAnual: { pt: 'Taxa Anual (%)', en: 'Annual Rate (%)', es: 'Tasa Anual (%)' },
  tempoAnos: { pt: 'Tempo (Anos)', en: 'Time (Years)', es: 'Tiempo (Años)' },
  calcularResultado: { pt: 'Calcular Resultado', en: 'Calculate Result', es: 'Calcular Resultado' },
  valorAcumulado: { pt: 'Valor Total Acumulado', en: 'Total Accumulated Value', es: 'Valor Total Acumulado' },
  assistenteIA: { pt: 'Assistente IA', en: 'AI Assistant', es: 'Asistente IA' },
  iaOnline: { pt: 'IA Online', en: 'AI Online', es: 'IA en Línea' },
  pergunteAlgo: { pt: 'Pergunte algo...', en: 'Ask something...', es: 'Pregunta algo...' },
  olaIa: { pt: 'Olá! Sou seu Assistente FinSight 💡 Como posso te ajudar com seus estudos financeiros hoje?', en: 'Hello! I am your FinSight Assistant 💡 How can I help you with your financial studies today?', es: '¡Hola! Soy tu Asistente FinSight 💡 ¿Cómo te puedo ayudar con tus estudios financieros hoy?' },
  erroIa: { pt: 'Desculpe, minha conexão falhou. Pode tentar de novo?', en: 'Sorry, my connection failed. Can you try again?', es: 'Lo siento, falló mi conexión. ¿Puedes intentar de nuevo?' },
  desapego: { pt: 'Desapego Inteligente', en: 'Smart Declutter', es: 'Desapego Inteligente' },
  desapegoDesc: { pt: 'Roupas, eletrônicos ou móveis parados em casa podem virar dinheiro rápido na OLX, Enjoei ou Mercado Livre.', en: 'Clothes, electronics or furniture sitting at home can turn into quick cash.', es: 'Ropa, electrónicos o muebles en casa pueden convertirse en dinero rápido.' },
  prestacao: { pt: 'Prestação de Serviços', en: 'Service Provision', es: 'Prestación de Servicios' },
  prestacaoDesc: { pt: 'Use o que você já sabe fazer: edição de vídeo, aulas particulares, "marido de aluguel" ou passeador de cães.', en: 'Use what you already know: video editing, private lessons, handyman or dog walker.', es: 'Usa lo que ya sabes: edición de video, clases particulares o paseador de perros.' },
  culinaria: { pt: 'Culinária e Doces', en: 'Cooking and Sweets', es: 'Cocina y Dulces' },
  culinariaDesc: { pt: 'Fazer bolo de pote, brigadeiros gourmet ou marmitas fitness tem alta demanda, giro rápido e baixo custo inicial.', en: 'Making pot cakes or fitness lunchboxes has high demand and low initial cost.', es: 'Hacer pasteles o loncheras fitness tiene alta demanda y bajo costo inicial.' },
  afiliados: { pt: 'Mercado de Afiliados', en: 'Affiliate Market', es: 'Mercado de Afiliados' },
  afiliadosDesc: { pt: 'Venda produtos digitais de outras pessoas (cursos, e-books) e ganhe comissões por cada venda na internet.', en: 'Sell other people\'s digital products and earn commissions for each internet sale.', es: 'Vende productos digitales de otros y gana comisiones por cada venta.' },
  jurosCompPratica: { pt: 'Como funcionam os Juros Compostos na prática', en: 'How Compound Interest works in practice', es: 'Cómo funciona el Interés Compuesto en la práctica' },
  selic: { pt: 'O que é a Taxa Selic e como ela afeta investimentos?', en: 'What is the Selic Rate and how it affects investments?', es: '¿Qué es la Tasa Selic y cómo afecta las inversiones?' },
  reservaGuia: { pt: 'Como montar uma Reserva de Emergência', en: 'How to build an Emergency Fund', es: 'Cómo montar un Fondo de Emergencia' },
  tesouroIniciantes: { pt: 'Tesouro Direto para iniciantes', en: 'Treasury Bonds for beginners', es: 'Bonos del Tesoro para principiantes' },
  oqSaoFiis: { pt: 'O que são FIIs e como investir', en: 'What are REITs and how to invest', es: 'Qué son los REITs y cómo invertir' },
  tempoLeitura6: { pt: '6 min de leitura', en: '6 min read', es: '6 min de lectura' },
  tempoLeitura8: { pt: '8 min de leitura', en: '8 min read', es: '8 min de lectura' },
  tempoLeitura7: { pt: '7 min de leitura', en: '7 min read', es: '7 min de lectura' },
  tempoLeitura10: { pt: '10 min de leitura', en: '10 min read', es: '10 min de lectura' },
  tempoLeitura9: { pt: '9 min de leitura', en: '9 min read', es: '9 min de lectura' },
  catConceito: { pt: 'Conceito', en: 'Concept', es: 'Concepto' },
  catEconomia: { pt: 'Economia', en: 'Economy', es: 'Economía' },
  catPlan: { pt: 'Planejamento', en: 'Planning', es: 'Planificación' },
  catInv: { pt: 'Investimentos', en: 'Investments', es: 'Inversiones' },
  catRendaV: { pt: 'Renda Variável', en: 'Variable Income', es: 'Renta Variable' },
  simTitle: { pt: 'Simulador', en: 'Simulator', es: 'Simulador' },
};

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>('escuro');
  const [idioma, setIdioma] = useState<Idioma>('pt');
  const [modoLeitura, setModoLeitura] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const temaSalvo = localStorage.getItem('@FinSight:tema') as Tema;
    const idiomaSalvo = localStorage.getItem('@FinSight:idioma') as Idioma;
    const modoLeituraSalvo = localStorage.getItem('@FinSight:modoLeitura') === 'true';

    if (temaSalvo) setTema(temaSalvo);
    if (idiomaSalvo) setIdioma(idiomaSalvo);
    if (modoLeituraSalvo) setModoLeitura(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('@FinSight:tema', tema);
      localStorage.setItem('@FinSight:idioma', idioma);
      localStorage.setItem('@FinSight:modoLeitura', String(modoLeitura));

      const root = document.documentElement;
      root.lang = idioma;

      if (tema === 'escuro') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }

      // Adiciona ou remove a classe de contraste visual no navegador
      if (modoLeitura) {
        root.classList.add('alto-contraste');
      } else {
        root.classList.remove('alto-contraste');
      }
    }
  }, [tema, idioma, modoLeitura, isMounted]);

  const toggleTema = () => setTema(prev => prev === 'claro' ? 'escuro' : 'claro');
  const alterarIdioma = (novoIdioma: Idioma) => setIdioma(novoIdioma);
  const toggleModoLeitura = () => setModoLeitura(prev => !prev);

  const traduzir = (chave: string) => {
    return dicionario[chave]?.[idioma] || chave;
  };

  return (
    <SettingsContext.Provider value={{
      tema, idioma, modoLeitura,
      toggleTema, alterarIdioma, toggleModoLeitura,
      traduzir, isMounted
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);