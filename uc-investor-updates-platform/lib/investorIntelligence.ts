import type { InvestorRecord } from './investorCRM';

export type IntelligenceFocus = {
  companyName: string;
  updateTitle?: string;
  focusTags?: string[];
  audience?: string;
};

export type InvestorInsight = {
  id: string;
  name: string;
  email: string;
  type: string;
  stage: InvestorRecord['stage'];
  score: number;
  engagementPrediction: number;
  fitLabel: 'High' | 'Medium' | 'Low';
  nextBestAction: string;
  reasoning: string[];
  enrichment: {
    firmographicSegment: string;
    relationshipSignal: string;
    outreachPreference: string;
    lastTouchDays: number | null;
  };
  similarInvestors: Array<{
    id: string;
    name: string;
    score: number;
    sharedTags: string[];
  }>;
};

export type RelationshipNode = {
  id: string;
  label: string;
  group: string;
};

export type RelationshipEdge = {
  source: string;
  target: string;
  weight: number;
  sharedTags: string[];
};

export type IntelligenceReport = {
  focusTags: string[];
  companyName: string;
  summary: {
    totalInvestors: number;
    highFit: number;
    warmPipeline: number;
    followUpDue: number;
    averageScore: number;
  };
  recommendations: InvestorInsight[];
  relationshipGraph: {
    nodes: RelationshipNode[];
    edges: RelationshipEdge[];
  };
  clusters: Array<{
    label: string;
    members: string[];
  }>;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function normalise(value: string) {
  return value.trim().toLowerCase();
}

function daysSince(dateValue: string | undefined | null) {
  if (!dateValue) return null;
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return null;
  const ms = Date.now() - parsed.getTime();
  return Math.max(0, Math.floor(ms / 86_400_000));
}

function jaccard(a: string[], b: string[]) {
  const left = new Set(a.map(normalise));
  const right = new Set(b.map(normalise));
  if (left.size === 0 && right.size === 0) return 0;
  const intersection = [...left].filter((item) => right.has(item)).length;
  const union = new Set([...left, ...right]).size;
  return union === 0 ? 0 : intersection / union;
}

function overlap(a: string[], b: string[]) {
  const right = new Set(b.map(normalise));
  return a.filter((item) => right.has(normalise(item)));
}

function keywordSignals(record: InvestorRecord) {
  const text = `${record.name} ${record.type} ${record.notes} ${record.tags.join(' ')}`.toLowerCase();
  const metrics = ['metrics', 'margin', 'growth', 'retention', 'revenue'];
  const launch = ['launch', 'distribution', 'supply', 'pilot', 'expansion'];
  const funding = ['seed', 'series', 'round', 'capital', 'portfolio'];
  return {
    metrics: metrics.some((word) => text.includes(word)) ? 1 : 0,
    launch: launch.some((word) => text.includes(word)) ? 1 : 0,
    funding: funding.some((word) => text.includes(word)) ? 1 : 0,
  };
}

function inferFirmographicSegment(record: InvestorRecord) {
  const tags = record.tags.map(normalise);
  const type = normalise(record.type);

  if (type.includes('vc') || tags.includes('vc')) return 'Venture capital';
  if (type.includes('angel') || tags.includes('angel')) return 'Angel network';
  if (type.includes('fund') || tags.includes('fund')) return 'Capital fund';
  if (type.includes('strategic') || tags.includes('partner')) return 'Strategic partner';

  if (tags.some((tag) => tag.includes('food'))) return 'Food and consumer';
  if (tags.some((tag) => tag.includes('software'))) return 'Software and SaaS';
  if (tags.some((tag) => tag.includes('climate'))) return 'Climate and sustainability';
  if (tags.some((tag) => tag.includes('distribution'))) return 'Distribution channel';

  return 'General investor';
}

function outreachPreference(record: InvestorRecord) {
  const tags = record.tags.map(normalise);
  if (tags.includes('metrics') || record.notes.toLowerCase().includes('metrics')) return 'Lead with metrics and concise bullets';
  if (tags.includes('strategic')) return 'Send partnership context and use-case fit';
  if (tags.includes('distribution')) return 'Share commercial expansion and channel notes';
  if (tags.includes('follow-up')) return 'Re-engage with a short personal note';
  return 'Send a short update and one specific ask';
}

function relationshipSignal(record: InvestorRecord) {
  if (record.stage === 'Active') return 'Strong current relationship';
  if (record.stage === 'Warm') return 'Active follow-up candidate';
  if (record.stage === 'Dormant') return 'Needs reactivation';
  return 'Prospect pipeline';
}

function scoreInvestor(record: InvestorRecord, focusTags: string[]) {
  const days = daysSince(record.lastContact);
  const focusOverlap = overlap(record.tags, focusTags).length;
  const keyword = keywordSignals(record);

  let score = 50;
  score += record.stage === 'Active' ? 20 : 0;
  score += record.stage === 'Warm' ? 12 : 0;
  score += record.stage === 'Dormant' ? -8 : 0;
  score += Math.min(18, focusOverlap * 8);
  score += keyword.metrics * 8;
  score += keyword.launch * 6;
  score += keyword.funding * 4;
  score += record.type.toLowerCase().includes('vc') ? 5 : 0;
  score += record.type.toLowerCase().includes('strategic') ? 4 : 0;

  if (days !== null) {
    if (days <= 7) score += 10;
    else if (days <= 14) score += 6;
    else if (days <= 30) score += 2;
    else if (days <= 60) score -= 4;
    else score -= 10;
  }

  return clamp(Math.round(score), 0, 100);
}

function predictEngagement(score: number, daysSinceContact: number | null, stage: InvestorRecord['stage']) {
  let value = score;
  if (stage === 'Dormant') value -= 12;
  if (stage === 'Warm') value += 4;
  if (daysSinceContact !== null && daysSinceContact > 30) value -= Math.min(15, Math.floor(daysSinceContact / 10));
  return clamp(Math.round(value), 0, 100);
}

function fitLabel(score: number): InvestorInsight['fitLabel'] {
  if (score >= 75) return 'High';
  if (score >= 55) return 'Medium';
  return 'Low';
}

function nextAction(record: InvestorRecord, score: number, daysSinceContact: number | null) {
  if (score >= 80) return 'Prioritise for the next send and ask for an intro or decision.';
  if (record.stage === 'Warm') return 'Send a concise follow-up with one concrete update.';
  if (record.stage === 'Dormant') return 'Re-open with a product milestone and a new reason to engage.';
  if (daysSinceContact !== null && daysSinceContact > 30) return 'Schedule a check-in before the next monthly update.';
  return 'Keep in the sequence and personalize the next note.';
}

function similarInvestors(target: InvestorRecord, records: InvestorRecord[]) {
  return records
    .filter((record) => record.id !== target.id)
    .map((record) => {
      const sharedTags = overlap(target.tags, record.tags);
      const tagScore = jaccard(target.tags, record.tags);
      const stageScore = target.stage === record.stage ? 0.2 : 0;
      const typeScore = normalise(target.type) === normalise(record.type) ? 0.1 : 0;
      const recency = daysSince(record.lastContact);
      const recencyBoost = recency !== null && recency <= 14 ? 0.1 : 0;
      const score = clamp(Math.round((tagScore + stageScore + typeScore + recencyBoost) * 100), 0, 100);

      return {
        id: record.id,
        name: record.name,
        score,
        sharedTags,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

function buildInsight(record: InvestorRecord, records: InvestorRecord[], focusTags: string[]): InvestorInsight {
  const score = scoreInvestor(record, focusTags);
  const days = daysSince(record.lastContact);
  const similar = similarInvestors(record, records);
  const overlapTags = overlap(record.tags, focusTags);

  const reasoning = [
    `Segment: ${inferFirmographicSegment(record)}`,
    `Relationship: ${relationshipSignal(record)}`,
    days === null ? 'Last touch: unknown' : `Last touch: ${days} day${days === 1 ? '' : 's'} ago`,
    overlapTags.length > 0 ? `Matches focus tags: ${overlapTags.join(', ')}` : 'No direct focus-tag match',
  ];

  return {
    id: record.id,
    name: record.name,
    email: record.email,
    type: record.type,
    stage: record.stage,
    score,
    engagementPrediction: predictEngagement(score, days, record.stage),
    fitLabel: fitLabel(score),
    nextBestAction: nextAction(record, score, days),
    reasoning,
    enrichment: {
      firmographicSegment: inferFirmographicSegment(record),
      relationshipSignal: relationshipSignal(record),
      outreachPreference: outreachPreference(record),
      lastTouchDays: days,
    },
    similarInvestors: similar,
  };
}

function buildClusters(records: InvestorRecord[]) {
  const clusters = new Map<string, Set<string>>();

  for (const record of records) {
    const labels = new Set<string>([
      inferFirmographicSegment(record),
      record.stage,
      ...record.tags.map((tag) => tag.toLowerCase()),
    ]);

    for (const label of labels) {
      if (!clusters.has(label)) clusters.set(label, new Set());
      clusters.get(label)!.add(record.name);
    }
  }

  return [...clusters.entries()]
    .filter(([, members]) => members.size > 1)
    .map(([label, members]) => ({
      label,
      members: [...members],
    }))
    .sort((a, b) => b.members.length - a.members.length)
    .slice(0, 6);
}

function buildGraph(records: InvestorRecord[]) {
  const nodes: RelationshipNode[] = records.map((record) => ({
    id: record.id,
    label: record.name,
    group: inferFirmographicSegment(record),
  }));

  const edges: RelationshipEdge[] = [];

  for (let i = 0; i < records.length; i += 1) {
    for (let j = i + 1; j < records.length; j += 1) {
      const left = records[i];
      const right = records[j];
      const sharedTags = overlap(left.tags, right.tags);
      const sameType = normalise(left.type) === normalise(right.type);
      const sameStage = left.stage === right.stage;
      const score = sharedTags.length * 2 + (sameType ? 2 : 0) + (sameStage ? 1 : 0);

      if (score > 0) {
        edges.push({
          source: left.id,
          target: right.id,
          weight: score,
          sharedTags,
        });
      }
    }
  }

  return { nodes, edges: edges.sort((a, b) => b.weight - a.weight).slice(0, 12) };
}

export function buildInvestorIntelligence(records: InvestorRecord[], focusTags: string[], companyName: string): IntelligenceReport {
  const recommendations = records
    .map((record) => buildInsight(record, records, focusTags))
    .sort((a, b) => b.score - a.score);

  const summary = {
    totalInvestors: records.length,
    highFit: recommendations.filter((item) => item.fitLabel === 'High').length,
    warmPipeline: recommendations.filter((item) => item.stage === 'Warm' || item.score >= 55).length,
    followUpDue: recommendations.filter((item) => (item.enrichment.lastTouchDays ?? 999) > 21 || item.stage === 'Dormant').length,
    averageScore: recommendations.length
      ? Math.round(recommendations.reduce((sum, item) => sum + item.score, 0) / recommendations.length)
      : 0,
  };

  return {
    focusTags,
    companyName,
    summary,
    recommendations,
    relationshipGraph: buildGraph(records),
    clusters: buildClusters(records),
  };
}

export function getRecommendedInvestors(records: InvestorRecord[], focusTags: string[], limit = 5) {
  return buildInvestorIntelligence(records, focusTags, 'Workspace').recommendations.slice(0, limit);
}

export function getInvestorInsight(records: InvestorRecord[], investorId: string, focusTags: string[]) {
  const report = buildInvestorIntelligence(records, focusTags, 'Workspace');
  return report.recommendations.find((item) => item.id === investorId) ?? null;
}
