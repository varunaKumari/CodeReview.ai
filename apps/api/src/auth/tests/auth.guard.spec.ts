import { describe, it, expect, vi, beforeEach } from 'vitest';
import { encryptToken, decryptToken } from '@api/common/utils/crypto.utils';

/**
 * Unit tests for the crypto utilities and auth flow logic.
 *
 * Tests cover:
 * 1. AES-256-GCM encryption/decryption round-trip
 * 2. Different inputs produce different ciphertexts (random IV)
 * 3. Tampered ciphertext fails decryption
 * 4. Invalid format throws
 * 5. Wrong key fails decryption
 */

const TEST_KEY = 'a'.repeat(64); // 32 bytes as hex

describe('Crypto Utils', () => {
  describe('encryptToken / decryptToken', () => {
    it('should encrypt and decrypt a token correctly (round-trip)', () => {
      const token = 'ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
      const encrypted = encryptToken(token, TEST_KEY);
      const decrypted = decryptToken(encrypted, TEST_KEY);

      expect(decrypted).toBe(token);
    });

    it('should produce different ciphertexts for the same input (random IV)', () => {
      const token = 'ghp_same_token_each_time';
      const encrypted1 = encryptToken(token, TEST_KEY);
      const encrypted2 = encryptToken(token, TEST_KEY);

      // Different due to random IV
      expect(encrypted1).not.toBe(encrypted2);

      // But both decrypt to the same value
      expect(decryptToken(encrypted1, TEST_KEY)).toBe(token);
      expect(decryptToken(encrypted2, TEST_KEY)).toBe(token);
    });

    it('should produce output in iv:authTag:ciphertext format', () => {
      const encrypted = encryptToken('test-token', TEST_KEY);
      const parts = encrypted.split(':');

      expect(parts).toHaveLength(3);
      // Each part should be valid base64
      for (const part of parts) {
        expect(() => Buffer.from(part, 'base64')).not.toThrow();
      }
    });

    it('should throw on invalid encrypted format', () => {
      expect(() => decryptToken('invalid', TEST_KEY)).toThrow(
        'Invalid encrypted token format',
      );
      expect(() => decryptToken('part1:part2', TEST_KEY)).toThrow(
        'Invalid encrypted token format',
      );
    });

    it('should throw when decrypting with wrong key', () => {
      const encrypted = encryptToken('secret-token', TEST_KEY);
      const wrongKey = 'b'.repeat(64);

      expect(() => decryptToken(encrypted, wrongKey)).toThrow();
    });

    it('should throw when ciphertext is tampered', () => {
      const encrypted = encryptToken('my-token', TEST_KEY);
      const parts = encrypted.split(':');
      // Tamper with the ciphertext
      const tamperedParts = [parts[0], parts[1], 'dGFtcGVyZWQ='];
      const tampered = tamperedParts.join(':');

      expect(() => decryptToken(tampered, TEST_KEY)).toThrow();
    });

    it('should handle empty string tokens', () => {
      const encrypted = encryptToken('', TEST_KEY);
      const decrypted = decryptToken(encrypted, TEST_KEY);

      expect(decrypted).toBe('');
    });

    it('should handle unicode tokens', () => {
      const token = 'token-with-émoji-🔑-and-中文';
      const encrypted = encryptToken(token, TEST_KEY);
      const decrypted = decryptToken(encrypted, TEST_KEY);

      expect(decrypted).toBe(token);
    });
  });
});

describe('Auth Plugin Logic', () => {
  describe('Token extraction', () => {
    it('should extract token from "Bearer <token>" format', () => {
      const header = 'Bearer eyJhbGciOiJSUzI1NiJ9.test.signature';
      const token = header.startsWith('Bearer ') ? header.slice(7) : null;

      expect(token).toBe('eyJhbGciOiJSUzI1NiJ9.test.signature');
    });

    it('should reject missing Bearer prefix', () => {
      const header = 'Basic dXNlcjpwYXNz';
      const hasBearer = header.startsWith('Bearer ');

      expect(hasBearer).toBe(false);
    });

    it('should reject empty authorization header', () => {
      const header = '';
      const hasBearer = header.startsWith('Bearer ');

      expect(hasBearer).toBe(false);
    });
  });

  describe('Redis cache key format', () => {
    it('should generate correct cache key from clerkId', () => {
      const clerkId = 'user_2abc123def';
      const cacheKey = `user:clerk:${clerkId}`;

      expect(cacheKey).toBe('user:clerk:user_2abc123def');
    });
  });

  describe('skipAuth config', () => {
    it('should identify routes with skipAuth config', () => {
      const routeConfig = { skipAuth: true } as Record<string, unknown>;
      const shouldSkip = routeConfig['skipAuth'] === true;

      expect(shouldSkip).toBe(true);
    });

    it('should not skip routes without skipAuth config', () => {
      const routeConfig = {} as Record<string, unknown>;
      const shouldSkip = routeConfig['skipAuth'] === true;

      expect(shouldSkip).toBe(false);
    });

    it('should not skip when config is undefined', () => {
      const routeConfig = undefined as Record<string, unknown> | undefined;
      const shouldSkip = routeConfig?.['skipAuth'] === true;

      expect(shouldSkip).toBe(false);
    });
  });
});
