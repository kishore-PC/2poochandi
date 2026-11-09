import { brand } from '../config/brand';
import { defaultReels } from '../data/defaults';

export type Submission = { id?: string; childName: string; childAge: string; createdAt?: string };
export type SiteConfig = { avatarUrl: string; reels: string[] };

const ADMIN_PASSWORD = 'POOCHANDI@#2001';

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || `Request failed (${res.status})`);
  return data as T;
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const fallback: SiteConfig = { avatarUrl: brand.defaultAvatar, reels: defaultReels };
  try {
    const data = await api<SiteConfig>('/api/site-config');
    return {
      avatarUrl: data.avatarUrl || fallback.avatarUrl,
      reels: Array.isArray(data.reels) && data.reels.length ? data.reels.slice(0, 4) : fallback.reels,
    };
  } catch {
    return fallback;
  }
}

export async function saveSiteConfig(cfg: SiteConfig) {
  await api('/api/site-config', {
    method: 'POST',
    headers: { 'x-admin-password': ADMIN_PASSWORD },
    body: JSON.stringify(cfg),
  });
}

export async function uploadAvatar(_file: File): Promise<string> {
  throw new Error('File upload storage is not configured. Paste an image URL in the Avatar URL field and save settings.');
}

export async function addSubmission(input: { childName: string; childAge: string }) {
  await api('/api/submissions', { method: 'POST', body: JSON.stringify(input) });
}

export async function listSubmissions(): Promise<Submission[]> {
  const data = await api<{ submissions: Submission[] }>('/api/submissions', {
    headers: { 'x-admin-password': ADMIN_PASSWORD },
  });
  return data.submissions || [];
}
