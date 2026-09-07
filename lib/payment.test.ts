import { describe, it, expect } from 'vitest';
import { createKaspiPayLink } from './payment';

describe('createKaspiPayLink', () => {
  it('resolves to null because the real Kaspi API is not configured yet', async () => {
    await expect(createKaspiPayLink(5000)).resolves.toBeNull();
  });

  it('rejects non-positive amounts', async () => {
    await expect(createKaspiPayLink(0)).rejects.toThrow(RangeError);
    await expect(createKaspiPayLink(-100)).rejects.toThrow(RangeError);
  });

  it('rejects non-integer amounts', async () => {
    await expect(createKaspiPayLink(1500.5)).rejects.toThrow(RangeError);
  });
});
