'use client';

import React, { createContext, useContext, useState } from 'react';

interface MonthContextData {
  activeMonth: string; // Formato YYYY-MM
  setActiveMonth: (month: string) => void;
}

const MonthContext = createContext<MonthContextData>({} as MonthContextData);

export function MonthProvider({ children }: { children: React.ReactNode }) {
  // Inicializa com o mês atual no formato YYYY-MM
  const [activeMonth, setActiveMonth] = useState(() => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    return `${ano}-${mes}`;
  });

  return (
    <MonthContext.Provider value={{ activeMonth, setActiveMonth }}>
      {children}
    </MonthContext.Provider>
  );
}

export function useMonth() {
  return useContext(MonthContext);
}
