import { Link } from 'react-router-dom';
import { brand } from '../config/brand';
import { useLang } from '../context/LangContext';

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted md:flex-row">
        <div>© {brand.name}</div>
        <div className="flex gap-4">
          <Link to="/privacy" className="hover:text-gold">{t('Privacy Policy', 'தனியுரிமைக் கொள்கை')}</Link>
          <Link to="/terms" className="hover:text-gold">{t('Terms & Conditions', 'விதிமுறைகள்')}</Link>
        </div>
      </div>
    </footer>
  );
}
