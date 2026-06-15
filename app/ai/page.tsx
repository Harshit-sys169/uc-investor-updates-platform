'use client';

import { useMemo, useState } from 'react';
import { defaultDraft } from '@/lib/updateComposer';
import type { AIDraftInput, AIAction, AITone, AISuggestion } from '@/lib/ai';

const tones: AITone[] = ['investor-ready', 'concise', 'optimistic', 'formal'];

function currentDraftInput(): AIDraftInput {
  const metrics = defaultDraft.blocks.find((block) => block.type === 'metrics')?.items ?? [];
  const textBlock = defaultDraft.blocks.find((block) => block.type === 'text');
  return {
    companyName: 'Acme Foods',
    updateTitle: defaultDraft.title,
    audience: defaultDraft.audience,
    summary: textBlock && textBlock.type === 'text' ? textBlock.content : '',
    metrics,
    asks: ['Review the growth plan', 'Share intros to strategic partners'],
    tone: 'investor-ready',
  };
}

export default function AiPage() {
  const [action, setAction] = useState<AIAction>('subject_lines');
  const [tone, setTone] = useState<AITone>('investor-ready');
  const [prompt, setPrompt] = useState('Improve this investor update for clarity and actionability.');
  const [result, setResult] = useState<AISuggestion | null>(null);
  const [loading, setLoading] = useState(false);

  const draft = useMemo(() => currentDraftInput(), []);

  async function runAssistant() {
    setLoading(true);
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          tone,
          text: prompt,
          ...draft,
        }),
      });

      const payload = (await response.json()) as AISuggestion;
      setResult(payload);
    } catch {
      setResult({
        title: 'AI request failed',
        summary: 'The assistant route is unavailable in this environment.',
        confidence: 0,
        bullets: ['Check the API route and environment configuration.'],
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="pageHeader">
        <div>
          <p className="eyebrow">AI</p>
          <h1>Drafting assistant</h1>
          <p className="lede">Generate subject lines, rewrite tone, score update quality, and produce follow-up guidance from the current draft.</p>
        </div>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <p className="eyebrow">Assistant controls</p>
            <h2>Run a suggestion</h2>
          </div>
        </div>

        <div className="composerToolbar">
          <label className="field">
            <span>Action</span>
            <select value={action} onChange={(e) => setAction(e.target.value as AIAction)}>
              <option value="subject_lines">Subject lines</option>
              <option value="rewrite">Rewrite tone</option>
              <option value="score">Score update</option>
              <option value="follow_up">Follow-up plan</option>
              <option value="investor_summary">Investor summary</option>
            </select>
          </label>

          <label className="field">
            <span>Tone</span>
            <select value={tone} onChange={(e) => setTone(e.target.value as AITone)}>
              {tones.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="field fieldFull">
            <span>Prompt or source text</span>
            <textarea rows={5} value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          </label>
        </div>

        <div className="composerActions">
          <button type="button" className="button buttonPrimary" onClick={runAssistant} disabled={loading}>
            {loading ? 'Generating…' : 'Generate'}
          </button>
        </div>
      </section>

      <section className="grid">
        {[
          { label: 'Input context', title: draft.updateTitle, description: draft.summary, bullets: draft.metrics.map((metric) => `${metric.label}: ${metric.value} (${metric.change})`) },
          { label: 'Use cases', title: 'What the assistant can do', description: 'The AI layer is intentionally modular so different actions can be routed independently.', bullets: ['Subject line generation', 'Tone rewriting', 'Investor summaries', 'Update scoring', 'Follow-up suggestions'] },
        ].map((card) => (
          <article key={card.title} className="card">
            <p className="cardLabel">{card.label}</p>
            <h2>{card.title}</h2>
            <p>{card.description}</p>
            <ul className="checklist">
              {card.bullets.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
        ))}
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <p className="eyebrow">Result</p>
            <h2>Latest output</h2>
          </div>
        </div>

        {result ? (
          <article className="statusItem">
            <h3>{result.title}</h3>
            <p>{result.summary}</p>
            <p className="muted">Confidence: {Math.round(result.confidence * 100)}%</p>
            <ul className="statusList">
              {result.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
            </ul>
          </article>
        ) : (
          <p className="muted">Run the assistant to generate a result.</p>
        )}
      </section>
    </main>
  );
}
