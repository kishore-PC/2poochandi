import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { brand } from '../config/brand';
import { parentingTips, defaultReels } from '../data/defaults';
import { useLang } from '../context/LangContext';
import { getSiteConfig, type SiteConfig } from '../services/site';

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function ReelEmbed({ url }: { url: string }) {
  const clean = url.replace(/\/?$/, '');
  const embed = clean.includes('/embed') ? clean : `${clean}/embed`;
  if (!url || url.includes('PLACEHOLDER')) {
    return <div className="grid h-full place-items-center rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted">Add a real Instagram Reel link from Admin Panel.</div>;
  }
  return <iframe title="Instagram reel" src={embed} className="h-full min-h-[420px] w-full rounded-2xl border border-border bg-card" loading="lazy" />;
}

export function Home() {
  const { t } = useLang();
  const [site, setSite] = useState<SiteConfig>({ avatarUrl: brand.defaultAvatar, reels: defaultReels });
  useEffect(() => {
    getSiteConfig().then(setSite).catch(() => {});
  }, []);

  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <h1 className="text-3xl font-bold leading-tight text-gold text-gold-shadow md:text-5xl">
              {t('Welcome by Poochandi Varaan', 'Poochandi Varaan வரவேற்கிறது')}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-slate-300">
              {t(
                'Interactive platform for fun & engaging child parenting stories.',
                'குழந்தைகளுக்கான வேடிக்கையான மற்றும் ஈர்க்கும் பெற்றோர் கதைகளுக்கான தளம்.',
              )}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link to="/complaint" className="rounded-2xl bg-gold px-5 py-3 text-center font-semibold text-black shadow-gold transition hover:brightness-105">
                {t('Complaint Name List Request', 'பெயர் பட்டியல் கோரிக்கை')}
              </Link>
              <a href={brand.instagramDmUrl} target="_blank" rel="noreferrer" className="rounded-2xl border border-gold/50 bg-card px-5 py-3 text-center font-semibold text-gold transition hover:border-gold">
                {t('Special Video For Your Children (Paid) [Custom Photo & Name]', 'உங்கள் குழந்தைகளுக்கான சிறப்பு வீடியோ (கட்டணம்) [புகைப்படம் & பெயர்]')}
              </a>
            </div>
          </div>
          <div className="order-1 flex justify-center md:order-2">
            <div className="rounded-[2rem] border border-border bg-card p-3 shadow-gold">
              <img src={site.avatarUrl} alt="Poochandi Varaan avatar" className="h-72 w-72 rounded-[1.5rem] object-cover md:h-80 md:w-80" />
            </div>
          </div>
        </div>
      </section>

      <section id="tips" className="border-y border-border bg-card/30">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl font-bold text-gold text-gold-shadow md:text-3xl">
            {t('Parenting Tips / பெற்றோர்களுக்கான குறிப்புகள்', 'Parenting Tips / பெற்றோர்களுக்கான குறிப்புகள்')}
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {parentingTips.map((tip) => (
              <article key={tip.title} className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-gold/30">
                <h3 className="font-semibold text-slate-100">{tip.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{tip.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="videos" className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-bold text-gold text-gold-shadow md:text-3xl">{t('Featured Videos / வீடியோக்கள்', 'Featured Videos / வீடியோக்கள்')}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {(site.reels?.length ? site.reels : defaultReels).slice(0, 4).map((url, i) => (
            <div key={`${url}-${i}`} className="min-h-[420px]">
              <ReelEmbed url={url} />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-2xl border border-border bg-gradient-to-r from-card to-bg p-6 text-center md:p-8">
          <h2 className="text-xl font-semibold text-slate-100">{t('For More Videos & Updates', 'மேலும் வீடியோக்கள் மற்றும் புதுப்பிப்புகளுக்கு')}</h2>
          <a href={brand.instagramUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-gold px-5 py-3 font-semibold text-black">
            <InstagramIcon /> {t('Visit Instagram', 'Instagram-ஐ பார்க்க')}
          </a>
          <p className="mt-2 text-sm text-muted">{brand.instagramUrl}</p>
        </div>
      </section>
    </div>
  );
}
