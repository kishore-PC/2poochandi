import { ensureSchema, getDb, isAdmin } from './_db.js';

type Req = { method?: string; body?: any; headers: Record<string, string | string[] | undefined> };
type Res = { status: (c: number) => Res; json: (b: unknown) => void; setHeader: (k: string, v: string) => void };

export default async function handler(req: Req, res: Res) {
  res.setHeader('Content-Type', 'application/json');
  try {
    await ensureSchema();
    const db = getDb();
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const childName = String(body.childName || '').trim();
      const childAge = String(body.childAge || '').trim();
      if (!childName || !childAge) return res.status(400).json({ error: 'childName and childAge are required' });
      await db.execute({ sql: 'INSERT INTO submissions (child_name, child_age) VALUES (?, ?)', args: [childName, childAge] });
      return res.status(201).json({ ok: true });
    }
    if (req.method === 'GET') {
      if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
      const r = await db.execute('SELECT id, child_name as childName, child_age as childAge, created_at as createdAt FROM submissions ORDER BY datetime(created_at) DESC, id DESC');
      return res.status(200).json({ submissions: r.rows });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Server error';
    return res.status(500).json({ error: msg });
  }
}
