import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCurrentWorkspace } from '@/lib/workspace';
import { getInvestorInsight } from '@/lib/investorIntelligence';

export default function InvestorDetailPage({ params }: { params: { investorId: string } }) {
  const workspace = getCurrentWorkspace();
  const investor = workspace.investors.find((item) => item.id === params.investorId);

  if (!investor) notFound();

  const insight = getInvestorInsight(workspace.investors, investor.id, ['food-tech', 'distribution', 'metrics', 'strategic']);

  return (
    <main className="page">
      <section className="pageHeader">
        <div>
          <p className="eyebrow">Investor detail</p>
          <h1>{investor.name}</h1>
          <p className="lede">Record preview within {workspace.name}.</p>
        </div>
        <Link className="button buttonSecondary" href="/investors">
          Back to investors
        </Link>
      </section>

      <section className="statsGrid">
        <article className="card">
          <p className="cardLabel">Fit score</p>
          <h2>{insight?.score ?? 0}/100</h2>
          <p>{insight?.fitLabel ?? 'Low'} priority investor.</p>
        </article>
        <article className="card">
          <p className="cardLabel">Engagement prediction</p>
          <h2>{insight?.engagementPrediction ?? 0}/100</h2>
          <p>{insight?.nextBestAction ?? 'No insight available.'}</p>
        </article>
        <article className="card">
          <p className="cardLabel">Firmographic segment</p>
          <h2>{insight?.enrichment.firmographicSegment ?? investor.type}</h2>
          <p>{insight?.enrichment.relationshipSignal ?? investor.stage}</p>
        </article>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <h2>Core profile</h2>
            <p>Current CRM record and enrichment preview.</p>
          </div>
        </div>
        <div className="grid">
          <article className="card">
            <p className="cardLabel">Contact</p>
            <h2>{investor.email}</h2>
            <p>Type: {investor.type}</p>
          </article>
          <article className="card">
            <p className="cardLabel">Lifecycle</p>
            <h2>{investor.stage}</h2>
            <p>Status: {investor.status}</p>
          </article>
          <article className="card">
            <p className="cardLabel">Last contact</p>
            <h2>{investor.lastContact}</h2>
            <p>{insight?.enrichment.lastTouchDays ?? 'Unknown'} days since last touch</p>
          </article>
        </div>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <h2>Enrichment and similarity</h2>
            <p>Reasoning used by the recommendation layer.</p>
          </div>
        </div>

        <div className="grid">
          <article className="card">
            <p className="cardLabel">Outreach preference</p>
            <h2>{insight?.enrichment.outreachPreference ?? 'Send a concise note'}</h2>
            <p>{insight?.reasoning.join(' • ')}</p>
          </article>

          <article className="card">
            <p className="cardLabel">Similar investors</p>
            <h2>{insight?.similarInvestors.length ?? 0}</h2>
            <p>
              {insight?.similarInvestors.map((item) => item.name).join(' · ') || 'No strong matches in the current sample set.'}
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
