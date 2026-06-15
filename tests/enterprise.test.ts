import { describe, expect, it } from 'vitest';
import { canAccessEnterprise, getPermissionSet } from '@/lib/enterprise';

describe('enterprise helpers', () => {
  it('grants owners full access', () => {
    expect(canAccessEnterprise('owner')).toBe(true);
    expect(getPermissionSet('owner').length).toBeGreaterThan(3);
  });

  it('limits viewers', () => {
    expect(canAccessEnterprise('viewer')).toBe(false);
    expect(getPermissionSet('viewer')).toEqual(['View workspace data']);
  });
});
