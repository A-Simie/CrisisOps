import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import { encryptData, decryptData } from './crypto';

export interface Report {
  id: string;
  hazardType: string;
  severity: number;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  description?: string;
  contact?: string;
  mediaUrls: string[];
  status: 'queued' | 'sent' | 'verified' | 'assigned' | 'resolved';
  createdAt: number;
  syncedAt?: number;
  serverId?: string;
}

export interface HazardPack {
  id: string;
  regionCode: string;
  regionName: string;
  version: string;
  installedAt: number;
  lastUpdated: number;
  sizeBytes: number;
  emergencyNumbers: EmergencyNumber[];
  shelters: Shelter[];
  hazards: string[];
  localNotes?: string;
}

export interface EmergencyNumber {
  name: string;
  number: string;
  description?: string;
}

export interface Shelter {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  capacity?: number;
  type: string;
}

export interface SurvivalGuide {
  id: string;
  hazardType: string;
  savedAt: number;
  doNow: string[];
  doNot: string[];
  emergencyScript: string;
}

export interface SyncMeta {
  key: string;
  value: string | number;
}

interface CrisisOpsDB extends DBSchema {
  reports: {
    key: string;
    value: Report;
    indexes: { 'by-status': string; 'by-created': number };
  };
  hazardPacks: {
    key: string;
    value: HazardPack;
    indexes: { 'by-region': string };
  };
  survivalGuides: {
    key: string;
    value: SurvivalGuide;
    indexes: { 'by-hazard': string };
  };
  syncMeta: {
    key: string;
    value: SyncMeta;
  };
}

let dbPromise: Promise<IDBPDatabase<CrisisOpsDB>> | null = null;

export function getDB(): Promise<IDBPDatabase<CrisisOpsDB>> {
  if (!dbPromise) {
    dbPromise = openDB<CrisisOpsDB>('crisisops-db', 1, {
      upgrade(db) {
        const reportStore = db.createObjectStore('reports', { keyPath: 'id' });
        reportStore.createIndex('by-status', 'status');
        reportStore.createIndex('by-created', 'createdAt');

        const packStore = db.createObjectStore('hazardPacks', { keyPath: 'id' });
        packStore.createIndex('by-region', 'regionCode');

        const guideStore = db.createObjectStore('survivalGuides', { keyPath: 'id' });
        guideStore.createIndex('by-hazard', 'hazardType');

        db.createObjectStore('syncMeta', { keyPath: 'key' });
      },
    });
  }
  return dbPromise;
}

export async function addReport(report: Omit<Report, 'id' | 'createdAt' | 'status'>): Promise<Report> {
  const db = await getDB();
  const newReport: Report = {
    ...report,
    id: crypto.randomUUID(),
    status: 'queued',
    createdAt: Date.now(),
  };

  const secureReport = { ...newReport };
  if (secureReport.location.address) {
    secureReport.location.address = await encryptData(secureReport.location.address);
  }
  if (secureReport.description) {
    secureReport.description = await encryptData(secureReport.description);
  }
  if (secureReport.contact) {
    secureReport.contact = await encryptData(secureReport.contact);
  }

  await db.add('reports', secureReport as any);
  return newReport;
}

async function decryptReport(report: Report): Promise<Report> {
  const decrypted = { ...report };
  try {
    if (decrypted.location.address && decrypted.location.address.length > 50) {
      decrypted.location.address = await decryptData(decrypted.location.address);
    }
  } catch { }

  try {
    if (decrypted.description && decrypted.description.length > 50) {
      decrypted.description = await decryptData(decrypted.description);
    }
  } catch { }

  try {
    if (decrypted.contact && decrypted.contact.length > 20) {
      decrypted.contact = await decryptData(decrypted.contact);
    }
  } catch { }

  return decrypted;
}

export async function getReports(): Promise<Report[]> {
  const db = await getDB();
  const reports = await db.getAllFromIndex('reports', 'by-created');
  return Promise.all(reports.map(decryptReport));
}

export async function getQueuedReports(): Promise<Report[]> {
  const db = await getDB();
  const reports = await db.getAllFromIndex('reports', 'by-status', 'queued');
  return Promise.all(reports.map(decryptReport));
}

export async function updateReportStatus(id: string, status: Report['status'], serverId?: string): Promise<void> {
  const db = await getDB();
  const report = await db.get('reports', id);
  if (report) {
    report.status = status;
    if (serverId) report.serverId = serverId;
    if (status === 'sent') report.syncedAt = Date.now();
    await db.put('reports', report);
  }
}

export async function deleteReport(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('reports', id);
}

export async function clearQueuedReports(): Promise<void> {
  const db = await getDB();
  const queued = await getQueuedReports();
  const tx = db.transaction('reports', 'readwrite');
  await Promise.all(queued.map(r => tx.store.delete(r.id)));
  await tx.done;
}

export async function saveHazardPack(pack: HazardPack): Promise<void> {
  const db = await getDB();
  await db.put('hazardPacks', pack);
}

export async function getHazardPack(regionCode: string): Promise<HazardPack | undefined> {
  const db = await getDB();
  const packs = await db.getAllFromIndex('hazardPacks', 'by-region', regionCode);
  return packs[0];
}

export async function getAllHazardPacks(): Promise<HazardPack[]> {
  const db = await getDB();
  return db.getAll('hazardPacks');
}

export async function deleteHazardPack(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('hazardPacks', id);
}

export async function saveSurvivalGuide(guide: SurvivalGuide): Promise<void> {
  const db = await getDB();
  await db.put('survivalGuides', guide);
}

export async function getSurvivalGuide(hazardType: string): Promise<SurvivalGuide | undefined> {
  const db = await getDB();
  const guides = await db.getAllFromIndex('survivalGuides', 'by-hazard', hazardType);
  return guides[0];
}

export async function deleteSurvivalGuide(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('survivalGuides', id);
}

export async function setSyncMeta(key: string, value: string | number): Promise<void> {
  const db = await getDB();
  await db.put('syncMeta', { key, value });
}

export async function getSyncMeta(key: string): Promise<string | number | undefined> {
  const db = await getDB();
  const meta = await db.get('syncMeta', key);
  return meta?.value;
}
