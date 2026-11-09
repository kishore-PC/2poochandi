import { brand } from '../config/brand';
import { useLang } from '../context/LangContext';

export function Privacy() {
  const { t } = useLang();
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gold text-gold-shadow">{t('Privacy Policy', 'தனியுரிமைக் கொள்கை')}</h1>
      <div className="mt-6 space-y-4 text-slate-300 leading-7">
        <p>{brand.name} respects your privacy. This page explains how information may be collected and used on this website.</p>
        <p>We may collect details you voluntarily submit, such as child name and age requests, to provide the requested service.</p>
        <p>This website may display advertisements (including Google AdSense) and use cookies or similar technologies as required by advertising providers.</p>
        <p>For questions or data requests, please contact us through our official Instagram page: <a className="text-gold underline" href={brand.instagramUrl} target="_blank" rel="noreferrer">{brand.instagramUrl}</a>.</p>
        <p className="text-sm text-muted">Please review and customize this policy to match your actual data practices and legal requirements before publishing.</p>
      </div>
    </div>
  );
}
