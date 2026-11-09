import { CheckCircle2 } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { brand } from '../config/brand';
import { useLang } from '../context/LangContext';
import { addSubmission, getSiteConfig } from '../services/site';

export function Complaint() {
  const { t } = useLang();
  const [avatar, setAvatar] = useState(brand.defaultAvatar);
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    getSiteConfig().then((c) => setAvatar(c.avatarUrl)).catch(() => {});
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!childName.trim() || !childAge.trim()) {
      setError(t('Please enter child name and age.', 'குழந்தையின் பெயர் மற்றும் வயதை உள்ளிடவும்.'));
      return;
    }
    setBusy(true);
    try {
      await addSubmission({ childName: childName.trim(), childAge: childAge.trim() });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('Could not save. Please try again.', 'சேமிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.'));
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-gold md:p-8">
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-400" />
          <h1 className="mt-4 text-2xl font-bold text-gold text-gold-shadow">{t('Name Was Entered Successfully!', 'பெயர் வெற்றிகரமாக பதிவு செய்யப்பட்டது!')}</h1>
          <p className="mt-2 text-muted">{t('Thank you. We received the details.', 'நன்றி. விவரங்கள் பெறப்பட்டது.')}</p>
          <div className="mt-6 grid min-h-[120px] place-items-center rounded-2xl border border-dashed border-border bg-bg/60 p-4 text-sm text-muted">AdSense Unit Space (Reserved)</div>
          <Link to="/" className="mt-6 inline-block rounded-2xl bg-gold px-6 py-3 font-semibold text-black">{t('Return to Home Page', 'முகப்புப் பக்கத்திற்கு செல்ல')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-3xl border border-border bg-card p-5 shadow-gold md:p-7">
        <div className="text-center">
          <img src={avatar} alt="Poochandi avatar" className="mx-auto h-28 w-28 rounded-2xl border border-border object-cover" />
          <h1 className="mt-4 text-2xl font-bold text-gold text-gold-shadow">{t('Welcome by Poochandi Varaan', 'Poochandi Varaan வரவேற்கிறது')}</h1>
          <p className="mt-2 text-slate-300">{t('Scroll Down to Enter the Name 👇', 'பெயரை உள்ளிட கீழே செல்லவும் 👇')}</p>
        </div>
        <div className="mt-6 grid min-h-[100px] place-items-center rounded-2xl border border-dashed border-border bg-bg/60 p-4 text-sm text-muted">AdSense Banner Space (Reserved)</div>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm text-muted">{t('Child Name (குழந்தையின் பெயர்)', 'குழந்தையின் பெயர் (Child Name)')}</span>
            <input value={childName} onChange={(e) => setChildName(e.target.value)} className="mt-1 w-full rounded-xl border border-border bg-bg px-3 py-3 text-slate-100" />
          </label>
          <label className="block">
            <span className="text-sm text-muted">{t('Child Age (வயது)', 'வயது (Child Age)')}</span>
            <input value={childAge} onChange={(e) => setChildAge(e.target.value)} className="mt-1 w-full rounded-xl border border-border bg-bg px-3 py-3 text-slate-100" />
          </label>
          {error && <p className="rounded-xl border border-red-900/50 bg-red-950/30 px-3 py-2 text-sm text-red-200">{error}</p>}
          <button type="submit" disabled={busy} className="w-full rounded-2xl bg-gold px-5 py-3 font-semibold text-black disabled:opacity-60">{busy ? t('Submitting...', 'சமர்ப்பிக்கிறது...') : t('Confirm & Submit', 'உறுதிப்படுத்து & சமர்ப்பி')}</button>
        </form>
      </div>
    </div>
  );
}
