import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

/**
 * AES-256-GCM encryption/decryption utilities for storing
 * sensitive tokens (e.g., GitHub OAuth tokens) at rest.
 *
 * Format: base64(iv):base64(authTag):base64(ciphertext)
 *
 * The encryption key must be a 32-byte hex string (64 hex chars).
 */

/** IV length for AES-GCM (96 bits / 12 bytes is recommended by NIST) */
const IV_LENGTH = 12;

/** Auth tag length for AES-GCM */
const AUTH_TAG_LENGTH = 16;

/**
 * Encrypts a plaintext token using AES-256-GCM.
 *
 * @param token - The plaintext token to encrypt
 * @param hexKey - 32-byte encryption key as a 64-character hex string
 * @returns Encrypted string in format: base64(iv):base64(authTag):base64(ciphertext)
 */
export function encryptToken(token: string, hexKey: string): string {
  const key = Buffer.from(hexKey, 'hex');
  const iv = randomBytes(IV_LENGTH);

  const cipher = createCipheriv('aes-256-gcm', key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  const encrypted = Buffer.concat([
    cipher.update(token, 'utf8'),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted.toString('base64')}`;
}

/**
 * Decrypts an AES-256-GCM encrypted token.
 *
 * @param encrypted - Encrypted string in format: base64(iv):base64(authTag):base64(ciphertext)
 * @param hexKey - 32-byte encryption key as a 64-character hex string
 * @returns The decrypted plaintext token
 * @throws {Error} If the encrypted string format is invalid or decryption fails
 */
export function decryptToken(encrypted: string, hexKey: string): string {
  const parts = encrypted.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted token format. Expected iv:authTag:ciphertext');
  }

  const [ivB64, authTagB64, ciphertextB64] = parts as [string, string, string];
  const key = Buffer.from(hexKey, 'hex');
  const iv = Buffer.from(ivB64, 'base64');
  const authTag = Buffer.from(authTagB64, 'base64');
  const ciphertext = Buffer.from(ciphertextB64, 'base64');

  const decipher = createDecipheriv('aes-256-gcm', key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return decrypted.toString('utf8');
}
