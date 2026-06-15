export type AITone = 'investor-ready' | 'concise' | 'optimistic' | 'formal';

export type AIDraftInput = {
  companyName: string;
  updateTitle: string;
  audience: string;
  summary: string;
  metrics: Array<{ label: string; value: string; change: string }>;
  asks?: string[];
  tone?: AITone;
};

export type AISuggestion = {
  title: string;
  summary: string;
  confidence: number;
  bullets: string[];
};

export type AIAction =
  | 'subject_lines'
  | 'rewrite'
  | 'score'
  | 'follow_up'
  | 'investor_summary';

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normalizeWords(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s%$.-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function formatMetricMetric(metric: { label: string; value: string; change: string }) {
  return `${metric.label}: ${metric.value} (${metric.change})`;
}

export function generateSubjectLines(input: AIDraftInput): AISuggestion {
  const metricLead = input.metrics[0] ? formatMetricMetric(input.metrics[0]) : 'key metrics';
  const company = input.companyName;
  const title = input.updateTitle || 'Monthly update';
  const tone = input.tone ?? 'investor-ready';

  const subjects = [
    `${company} | ${title} — ${metricLead}`,
    `${company} update: growth, execution, and next steps`,
    `${company} investor note: ${title}`,
    `${company} progress report | ${tone.replace('-', ' ')}`,
  ];

  return {
    title: 'Subject line options',
    summary: `Generated from ${input.metrics.length} metrics and the current update summary.`,
    confidence: 0.91,
    bullets: subjects,
  };
}

export function rewriteForTone(text: string, tone: AITone = 'investor-ready') {
  const cleaned = text.trim().replace(/\s+/g, ' ');
  const prefix =
    tone === 'concise'
      ? 'Concise version: '
      : tone === 'optimistic'
        ? 'Optimistic version: '
        : tone === 'formal'
          ? 'Formal version: '
          : 'Investor-ready version: ';

  return `${prefix}${cleaned.replace(/\.$/, '')}.`;
}

export function scoreUpdate(input: AIDraftInput) {
  const words = normalizeWords(input.summary);
  const metricScore = clamp(input.metrics.length * 14, 0, 42);
  const askScore = clamp((input.asks?.length ?? 0) * 10, 0, 20);
  const detailScore = clamp(words.length / 10, 0, 18);
  const clarityScore = textHasNumbers(input.summary) ? 10 : 4;
  const total = clamp(Math.round(metricScore + askScore + detailScore + clarityScore), 0, 100);

  const suggestions: string[] = [];
  if (input.metrics.length < 3) suggestions.push('Add at least one more metric to show operational momentum.');
  if (!(input.asks?.length)) suggestions.push('State one clear ask for investors.');
  if (!textHasNumbers(input.summary)) suggestions.push('Include a few numbers to improve credibility.');
  if (words.length < 80) suggestions.push('Expand the summary with execution details and blockers.');

  return {
    title: 'Update quality score',
    summary: `${total}/100 based on metric density, clarity, and investor actionability.`,
    confidence: total / 100,
    bullets: suggestions.length ? suggestions : ['The update is structurally strong.'],
    score: total,
  };
}

export function summarizeInvestorUpdate(input: AIDraftInput) {
  const metricLine = input.metrics.slice(0, 3).map(formatMetricMetric).join('; ');
  const asks = input.asks?.length ? `Asks: ${input.asks.join('; ')}.` : 'No explicit ask listed yet.';
  return {
    title: `${input.companyName} investor summary`,
    summary: `${input.updateTitle} for ${input.audience}. ${input.summary}`,
    confidence: 0.88,
    bullets: [metricLine || 'No metrics added.', asks, `Suggested tone: ${input.tone ?? 'investor-ready'}.`],
  };
}

export function suggestFollowUps(investorName: string, context: string) {
  const keywords = normalizeWords(context);
  const action = keywords.includes('reply') || keywords.includes('questions') ? 'Reply with a short answer and attach the latest numbers.' : 'Follow up with a concise nudge and a clear next step.';
  return {
    title: `${investorName} follow-up plan`,
    summary: `Suggested follow-up based on the latest context.`,
    confidence: 0.84,
    bullets: [action, 'Send a tailored note within 48 hours.', 'Log the response in the investor CRM.'],
  };
}

export function generateAIResponse(action: AIAction, input: AIDraftInput & { text?: string; investorName?: string }) {
  if (action === 'subject_lines') return generateSubjectLines(input);
  if (action === 'rewrite') return {
    title: 'Tone rewrite',
    summary: `Rewritten for ${input.tone ?? 'investor-ready'} tone.`,
    confidence: 0.86,
    bullets: [rewriteForTone(input.text ?? input.summary, input.tone ?? 'investor-ready')],
  };
  if (action === 'score') return scoreUpdate(input);
  if (action === 'follow_up') return suggestFollowUps(input.investorName ?? 'Investor', input.text ?? input.summary);
  return summarizeInvestorUpdate(input);
}

function textHasNumbers(input: string) {
  return /\d/.test(input);
}
