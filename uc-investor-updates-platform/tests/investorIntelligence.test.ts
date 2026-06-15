import { describe, expect, it } from 'vitest';
import { buildInvestorSeed } from '@/lib/investorCRM';
import { buildInvestorIntelligence, getInvestorInsight } from '@/lib/investorIntelligence';

describe('investor intelligence', () => {
  const investors = buildInvestorSeed('acme-foods');

  it('ranks investors by fit score', () => {
    const report = buildInvestorIntelligence(investors, ['food-tech', 'metrics'], 'Acme Foods');
    expect(report.recommendations.length).toBe(investors.length);
    expect(report.recommendations[0].score).toBeGreaterThanOrEqual(report.recommendations[1].score);
  });

  it('builds a relationship graph', () => {
    const report = buildInvestorIntelligence(investors, ['food-tech'], 'Acme Foods');
    expect(report.relationshipGraph.nodes.length).toBe(investors.length);
    expect(report.relationshipGraph.edges.length).toBeGreaterThan(0);
  });

  it('returns an insight for a given investor', () => {
    const insight = getInvestorInsight(investors, investors[0].id, ['food-tech']);
    expect(insight?.id).toBe(investors[0].id);
    expect(insight?.similarInvestors.length).toBeGreaterThanOrEqual(0);
  });
});
