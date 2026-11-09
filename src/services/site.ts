import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, isFirebaseConfigured, storage } from '../config/firebase';
import { brand } from '../config/brand';
import { defaultReels } from '../data/defaults';

export type Submission = { id?: string; childName: string; childAge: string; createdAt?: unknown };
export type SiteConfig = { avatarUrl: string; reels: string[] };

const siteDoc = () => (db ? doc(db, 'siteConfig', 'main') : null);

export async function getSiteConfig(): Promise<SiteConfig> {
  const fallback: SiteConfig = { avatarUrl: brand.defaultAvatar, reels: defaultReels };
  if (!isFirebaseConfigured || !db) return fallback;
  try {
    const d = siteDoc();
    if (!d) return fallback;
    const snap = await getDoc(d);
    if (!snap.exists()) return fallback;
    const data = snap.data() as Partial<SiteConfig>;
    return {
      avatarUrl: typeof data.avatarUrl === 'string' && data.avatarUrl ? data.avatarUrl : fallback.avatarUrl,
      reels: Array.isArray(data.reels) && data.reels.length ? data.reels.slice(0, 4) : fallback.reels,
    };
  } catch {
    return fallback;
  }
}

export async function saveSiteConfig(cfg: SiteConfig) {
  if (!isFirebaseConfigured || !db) throw new Error('Firebase not configured');
  const d = siteDoc();
  if (!d) throw new Error('Firebase not configured');
  await setDoc(d, cfg, { merge: true });
}

export async function uploadAvatar(file: File): Promise<string> {
  if (!isFirebaseConfigured || !storage) throw new Error('Firebase Storage not configured');
  const r = ref(storage, `avatars/${Date.now()}-${file.name}`);
  await uploadBytes(r, file);
  return getDownloadURL(r);
}

export async function addSubmission(input: { childName: string; childAge: string }) {
  if (!isFirebaseConfigured || !db) throw new Error('Firebase not configured');
  await addDoc(collection(db, 'submissions'), { ...input, createdAt: serverTimestamp() });
}

export async function listSubmissions(): Promise<Submission[]> {
  if (!isFirebaseConfigured || !db) return [];
  const q = query(collection(db, 'submissions'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Submission, 'id'>) }));
}
