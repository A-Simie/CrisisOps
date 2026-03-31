const SALT_KEY = import.meta.env.VITE_SALT_KEY;

async function getSalt(): Promise<Uint8Array> {
  const existingSalt = localStorage.getItem(SALT_KEY);
  if (existingSalt) {
    return new Uint8Array(atob(existingSalt).split('').map(c => c.charCodeAt(0)));
  }
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  localStorage.setItem(SALT_KEY, btoa(String.fromCharCode(...salt)));
  return salt;
}

async function getBaseKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return window.crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
}

async function deriveKey(secret: string, salt: Uint8Array): Promise<CryptoKey> {
  const baseKey = await getBaseKey(secret);
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt.buffer as ArrayBuffer,
      iterations: 100000,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

const DEFAULT_SECRET = import.meta.env.VITE_APP_SECRET;

export async function encryptData(data: string, secret: string = DEFAULT_SECRET): Promise<string> {
  try {
    const salt = await getSalt();
    const key = await deriveKey(secret, salt);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(data);

    const ciphertext = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encodedData
    );

    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(ciphertext), iv.length);

    return btoa(String.fromCharCode(...combined));
  } catch (e) {
    throw new Error('Encryption failed');
  }
}

export async function decryptData(encryptedBase64: string, secret: string = DEFAULT_SECRET): Promise<string> {
  try {
    const salt = await getSalt();
    const key = await deriveKey(secret, salt);
    const combined = new Uint8Array(
      atob(encryptedBase64)
        .split('')
        .map((c) => c.charCodeAt(0))
    );

    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);

    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );

    return new TextDecoder().decode(decrypted);
  } catch (e) {
    throw e;
  }
}
