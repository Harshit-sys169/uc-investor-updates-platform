import { describe, expect, it } from 'vitest';
import { generateAIResponse, generateSubjectLines, rewriteForTone, scoreUpdate, summarizeInvestorUpdate } from '@/lib/ai';

const draft = {
  companyName: 'Acme Foods',
  updateTitle: 'May founder update',
  audience: 'All investors',
  summary: 'We grew revenue 14%, improved margin to 41%, and kept on-time delivery at 96%.',
  metrics: [
    { label: 'Revenue', value: '$82k', change: '+14%' },
    { label: 'Gross margin', value: '41%', change: '+3 pts' },
    { label: 'On-time delivery', value: '96%', change: '+2 pts' },
  ],
  asks: ['Review the hiring plan'],
};

describe('AI helpers', () => {
  it('generates subject lines', () => {
    const result = generateSubjectLines({ ...draft, tone: 'investor-ready' });
    expect(result.bullets.length).toBeGreaterThan(0);
    expect(result.title).toContain('Subject line');
  });

  it('rewrites tone', () => {
    expect(rewriteForTone('Hello investors', 'formal')).toContain('Formal version');
  });

  it('scores updates', () => {
    const result = scoreUpdate({ ...draft, tone: 'concise' });
    expect(result.score).toBeGreaterThan(0);
  });

  it('summarizes investor updates', () => {
    const result = summarizeInvestorUpdate({ ...draft, tone: 'optimistic' });
    expect(result.bullets.length).toBeGreaterThan(0);
  });

  it('routes actions through the generic generator', () => {
    const result = generateAIResponse('follow_up', { ...draft, tone: 'investor-ready', investorName: 'Apex Ventures', text: 'They asked about margins.' });
    expect(result.title).toContain('follow-up');
  });
});
