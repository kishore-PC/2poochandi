import { brand } from '../config/brand';
import { useLang } from '../context/LangContext';

export function Terms() {
  const { t } = useLang();
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gold text-gold-shadow">{t('Terms & Conditions', 'விதிமுறைகள் மற்றும் நிபந்தனைகள்')}</h1>
      <div className="mt-6 space-y-4 text-slate-300 leading-7">
        <p>By using the {brand.name} website, you agree to use it lawfully and responsibly.</p>
        <p>Content on this site is provided for general informational and entertainment purposes related to parenting and child-friendly storytelling.</p>
        <p>Paid or custom video requests, if offered, are handled through Instagram/direct communication and may be subject to separate confirmation, pricing, and delivery terms.</p>
        <p>We may update website content, features, and these terms at any time. Please review and customize these terms for your business and local legal requirements before publishing.</p>
      </div>
    </div>
  );
}
