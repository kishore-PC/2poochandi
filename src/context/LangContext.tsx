import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type Lang = 'en' | 'ta';
type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (en: string, ta: string) => string };
const LangContext = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const value = useMemo<Ctx>(() => ({ lang, setLang, t: (en, ta) => (lang === 'ta' ? ta : en) }), [lang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang');
  return ctx;
}
