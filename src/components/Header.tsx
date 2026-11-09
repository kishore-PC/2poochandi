import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { brand } from '../config/brand';
import { useLang } from '../context/LangContext';

export function Header() {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);
  const nav = [
    { to: '/', label: t('Home', 'முகப்பு') },
    { to: '/#tips', label: t('Parenting Tips', 'பெற்றோர் குறிப்புகள்') },
    { to: '/#videos', label: t('Videos', 'வீடியோக்கள்') },
    { to: '/complaint', label: t('Name Request', 'பெயர் பதிவு') },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-full border border-gold/40 bg-card text-gold font-bold">P</div>
          <span className="font-semibold text-gold text-gold-shadow">{brand.name}</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="rounded-full border border-border bg-card p-1 text-xs" aria-label="Language toggle">
            <button type="button" onClick={() => setLang('en')} className={`rounded-full px-2.5 py-1 ${lang === 'en' ? 'bg-gold text-black font-semibold' : 'text-muted'}`}>EN</button>
            <button type="button" onClick={() => setLang('ta')} className={`rounded-full px-2.5 py-1 ${lang === 'ta' ? 'bg-gold text-black font-semibold' : 'text-muted'}`}>தா</button>
          </div>
          <button type="button" onClick={() => setOpen(true)} className="rounded-lg border border-border bg-card p-2 text-slate-200 md:hidden" aria-label="Open menu">
            <Menu size={18} />
          </button>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button type="button" className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} aria-label="Close menu" />
          <aside className="absolute right-0 top-0 h-full w-72 border-l border-border bg-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-semibold text-gold">{brand.name}</span>
              <button type="button" onClick={() => setOpen(false)} className="rounded p-2"><X size={18} /></button>
            </div>
            <nav className="flex flex-col gap-2">
              {nav.map((n) => (
                <NavLink key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-slate-200 hover:bg-bg">
                  {n.label}
                </NavLink>
              ))}
              <a href={brand.instagramUrl} target="_blank" rel="noreferrer" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-gold">Instagram</a>
            </nav>
          </aside>
        </div>
      )}
    </header>
  );
}
