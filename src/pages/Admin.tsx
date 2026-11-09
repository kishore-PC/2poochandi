import { useEffect, useState, type FormEvent } from 'react';
import { brand } from '../config/brand';
import { isFirebaseConfigured } from '../config/firebase';
import { getSiteConfig, listSubmissions, saveSiteConfig, uploadAvatar, type SiteConfig, type Submission } from '../services/site';

export function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('pv-admin') === '1');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [subs, setSubs] = useState<Submission[]>([]);
  const [site, setSite] = useState<SiteConfig>({ avatarUrl: brand.defaultAvatar, reels: ['', '', '', ''] });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  async function refresh() {
    if (!isFirebaseConfigured) return;
    try {
      const [s, c] = await Promise.all([listSubmissions(), getSiteConfig()]);
      setSubs(s);
      setSite({ avatarUrl: c.avatarUrl, reels: [0, 1, 2, 3].map((i) => c.reels[i] || '') });
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Failed to load data');
    }
  }

  useEffect(() => {
    if (authed) refresh();
  }, [authed]);

  function login(e: FormEvent) {
    e.preventDefault();
    if (username === brand.adminUsername && password === brand.adminPassword) {
      sessionStorage.setItem('pv-admin', '1');
      setAuthed(true);
      setErr('');
    } else setErr('Invalid credentials');
  }

  async function onSaveSite(e: FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg(''); setErr('');
    try {
      await saveSiteConfig({ avatarUrl: site.avatarUrl, reels: site.reels.filter(Boolean).slice(0, 4) });
      setMsg('Site settings saved.');
      await refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Save failed');
    } finally { setBusy(false); }
  }

  async function onAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setMsg(''); setErr('');
    try {
      const url = await uploadAvatar(file);
      setSite((s) => ({ ...s, avatarUrl: url }));
      await saveSiteConfig({ avatarUrl: url, reels: site.reels.filter(Boolean).slice(0, 4) });
      setMsg('Avatar uploaded and saved.');
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : 'Upload failed');
    } finally { setBusy(false); }
  }

  if (!authed) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <form onSubmit={login} className="rounded-3xl border border-border bg-card p-6 shadow-gold">
          <h1 className="text-2xl font-bold text-gold">Admin Panel</h1>
          <p className="mt-1 text-sm text-muted">/admin access</p>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="mt-4 w-full rounded-xl border border-border bg-bg px-3 py-3" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="mt-3 w-full rounded-xl border border-border bg-bg px-3 py-3" />
          {err && <p className="mt-3 text-sm text-red-300">{err}</p>}
          <button className="mt-4 w-full rounded-2xl bg-gold px-4 py-3 font-semibold text-black">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gold">Admin Panel</h1>
        <button type="button" onClick={() => { sessionStorage.removeItem('pv-admin'); setAuthed(false); }} className="rounded-xl border border-border px-3 py-2 text-sm">Logout</button>
      </div>
      {!isFirebaseConfigured && <p className="mt-4 rounded-xl border border-amber-900/50 bg-amber-950/30 p-3 text-sm text-amber-100">Firebase is not configured. Add VITE_FIREBASE_* env vars to enable submissions, avatar upload, and reel storage.</p>}
      {msg && <p className="mt-4 rounded-xl border border-green-900/50 bg-green-950/30 p-3 text-sm text-green-100">{msg}</p>}
      {err && <p className="mt-4 rounded-xl border border-red-900/50 bg-red-950/30 p-3 text-sm text-red-100">{err}</p>}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <form onSubmit={onSaveSite} className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-semibold text-slate-100">Poochandi Avatar & Reel Links</h2>
          <label className="mt-4 block text-sm text-muted">Avatar URL</label>
          <input value={site.avatarUrl} onChange={(e) => setSite((s) => ({ ...s, avatarUrl: e.target.value }))} className="mt-1 w-full rounded-xl border border-border bg-bg px-3 py-2" />
          <label className="mt-3 block text-sm text-muted">Upload Avatar (Firebase Storage)</label>
          <input type="file" accept="image/*" onChange={onAvatar} disabled={!isFirebaseConfigured || busy} className="mt-1 block w-full text-sm text-muted" />
          <div className="mt-4 space-y-2">
            <div className="text-sm text-muted">4 Featured Instagram Reel URLs</div>
            {[0, 1, 2, 3].map((i) => (
              <input key={i} value={site.reels[i] || ''} onChange={(e) => setSite((s) => ({ ...s, reels: s.reels.map((r, j) => (j === i ? e.target.value : r)) }))} placeholder={`Reel ${i + 1} URL`} className="w-full rounded-xl border border-border bg-bg px-3 py-2 text-sm" />
            ))}
          </div>
          <button disabled={!isFirebaseConfigured || busy} className="mt-4 rounded-xl bg-gold px-4 py-2 font-semibold text-black disabled:opacity-50">Save Settings</button>
        </form>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between"><h2 className="font-semibold text-slate-100">Submitted Child Names & Ages</h2><button type="button" onClick={refresh} disabled={!isFirebaseConfigured} className="text-sm text-gold disabled:opacity-50">Refresh</button></div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-muted"><tr><th className="py-2 pr-3">Child Name</th><th className="py-2 pr-3">Age</th><th className="py-2">Time</th></tr></thead>
              <tbody>
                {subs.length === 0 ? (
                  <tr><td colSpan={3} className="py-4 text-muted">{isFirebaseConfigured ? 'No submissions yet.' : 'Configure Firebase to view submissions.'}</td></tr>
                ) : subs.map((s) => {
                  const ts = s.createdAt as { toDate?: () => Date } | undefined;
                  const time = ts?.toDate ? ts.toDate().toLocaleString() : '—';
                  return <tr key={s.id} className="border-t border-border"><td className="py-2 pr-3">{s.childName}</td><td className="py-2 pr-3">{s.childAge}</td><td className="py-2 text-muted">{time}</td></tr>;
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
