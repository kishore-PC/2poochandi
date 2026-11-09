import { ensureSchema, getDb, isAdmin } from './_db.js';

const brandDefaultAvatar = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=70';
const defaultReels = [
  'https://www.instagram.com/reel/PLACEHOLDER1/',
  'https://www.instagram.com/reel/PLACEHOLDER2/',
  'https://www.instagram.com/reel/PLACEHOLDER3/',
  'https://www.instagram.com/reel/PLACEHOLDER4/',
];

type Req = { method?: string; body?: any; headers: Record<string, string | string[] | undefined> };
type Res = { status: (c: number) => Res; json: (b: unknown) => void; setHeader: (k: string, v: string) => void };

export default async function handler(req: Req, res: Res) {
  res.setHeader('Content-Type', 'application/json');
  try {
    await ensureSchema();
    const db = getDb();
    if (req.method === 'GET') {
      const r = await db.execute("SELECT key, value FROM site_config WHERE key IN ('avatarUrl','reels')");
      const map = new Map<string, string>(r.rows.map((row: any) => [String(row.key), String(row.value)]));
      let reels = defaultReels;
      try { const parsed = JSON.parse(map.get('reels') || ''); if (Array.isArray(parsed) && parsed.length) reels = parsed; } catch {}
      return res.status(200).json({ avatarUrl: map.get('avatarUrl') || brandDefaultAvatar, reels });
    }
    if (req.method === 'POST') {
      if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const avatarUrl = String(body.avatarUrl || '').trim() || brandDefaultAvatar;
      const reels = Array.isArray(body.reels) ? body.reels.map(String).filter(Boolean).slice(0, 4) : [];
      await db.batch([
        { sql: 'INSERT INTO site_config(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value', args: ['avatarUrl', avatarUrl] },
        { sql: 'INSERT INTO site_config(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value', args: ['reels', JSON.stringify(reels.length ? reels : defaultReels)] },
      ], 'write');
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Server error';
    return res.status(500).json({ error: msg });
  }
}
