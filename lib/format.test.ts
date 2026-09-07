import { describe, it, expect } from 'vitest';
import { formatTenge } from './format';

describe('formatTenge', () => {
  it('groups thousands with a space', () => {
    expect(formatTenge(838394)).toBe('838 394');
    expect(formatTenge(7000000)).toBe('7 000 000');
    expect(formatTenge(5000)).toBe('5 000');
  });

  it('leaves numbers under 1000 unchanged', () => {
    expect(formatTenge(100)).toBe('100');
    expect(formatTenge(0)).toBe('0');
  });

  it('rounds non-integer amounts before formatting', () => {
    expect(formatTenge(1999.6)).toBe('2 000');
  });
});
