import { describe, it, expect } from 'vitest';
import { siteContent } from './site';

describe('siteContent', () => {
  it('has hero copy and a positive fundraising goal', () => {
    expect(siteContent.hero.headline).toBeTruthy();
    expect(siteContent.hero.goalTenge).toBeGreaterThan(0);
    expect(siteContent.hero.raisedTenge).toBeGreaterThanOrEqual(0);
  });

  it('has at least one requisite row shared by contacts and the requisites page', () => {
    expect(siteContent.contacts.requisites.length).toBeGreaterThan(0);
    expect(siteContent.requisitesPage.rows).toBe(siteContent.contacts.requisites);
  });

  it('has needs list entries for the new shelter section', () => {
    expect(siteContent.newShelter.needs.length).toBeGreaterThan(0);
  });

  it('has at least one preset donation amount for the pay page', () => {
    expect(siteContent.pay.presetAmounts.length).toBeGreaterThan(0);
    expect(siteContent.pay.defaultAmount).toBeGreaterThan(0);
  });
});
