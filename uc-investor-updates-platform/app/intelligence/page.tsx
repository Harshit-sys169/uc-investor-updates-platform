import Link from 'next/link';
import { getCurrentWorkspace } from '@/lib/workspace';
import { buildInvestorIntelligence } from '@/lib/investorIntelligence';

const focusTags = ['food-tech', 'distribution', 'metrics', 'strategic'];

export default function IntelligencePage() {
  const workspace = getCurrentWorkspace();
  const report = buildInvestorIntelligence(workspace.investors, focusTags, workspace.name);

  return (
    <main className="page">
      <section className="pageHeader">
        <div>
          <p className="eyebrow">Investor intelligence</p>
          <h1>{workspace.name} recommendation engine</h1>
          <p className="lede">
            Rank investors by fit, identify follow-up candidates, map relationships, and expose an enrichment layer for outreach planning.
          </p>
        </div>
        <Link className="button buttonSecondary" href="/investors">
          Back to CRM
        </Link>
      </section>

      <section className="statsGrid">
        <article className="card">
          <p className="cardLabel">High-fit investors</p>
          <h2>{report.summary.highFit}</h2>
          <p>Investors with the strongest match to the current focus tags.</p>
        </article>
        <article className="card">
          <p className="cardLabel">Warm pipeline</p>
          <h2>{report.summary.warmPipeline}</h2>
          <p>Contacts likely to respond to the next update.</p>
        </article>
        <article className="card">
          <p className="cardLabel">Follow-up due</p>
          <h2>{report.summary.followUpDue}</h2>
          <p>Relationships that should be reactivated.</p>
        </article>
        <article className="card">
          <p className="cardLabel">Average score</p>
          <h2>{report.summary.averageScore}</h2>
          <p>Portfolio-level engagement baseline.</p>
        </article>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <h2>Recommended investors</h2>
            <p>Ranked by fit score, engagement prediction, and current relationship signal.</p>
          </div>
        </div>

        <div className="table">
          <div className="tableRow tableHead">
            <span>Investor</span>
            <span>Why now</span>
            <span>Score</span>
            <span>Next action</span>
          </div>
          {report.recommendations.slice(0, 6).map((item) => (
            <div key={item.id} className="tableRow">
              <span>
                <strong>{item.name}</strong>
                <br />
                <span className="muted">{item.type} · {item.stage}</span>
              </span>
              <span>{item.reasoning.join(' • ')}</span>
              <span>{item.score}/100</span>
              <span>{item.nextBestAction}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <h2>Relationship graph</h2>
            <p>Shared tags and stage similarity create the strongest links.</p>
          </div>
        </div>

        <div className="grid">
          {report.relationshipGraph.edges.slice(0, 4).map((edge) => {
            const source = report.relationshipGraph.nodes.find((node) => node.id === edge.source);
            const target = report.relationshipGraph.nodes.find((node) => node.id === edge.target);
            return (
              <article key={`${edge.source}-${edge.target}`} className="card">
                <p className="cardLabel">Linked contacts</p>
                <h2>{source?.label} ↔ {target?.label}</h2>
                <p>Shared tags: {edge.sharedTags.length ? edge.sharedTags.join(', ') : 'stage similarity'}</p>
                <p>Group: {source?.group}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <h2>Clusters</h2>
            <p>Natural grouping for investor sequencing.</p>
          </div>
        </div>

        <div className="grid">
          {report.clusters.map((cluster) => (
            <article key={cluster.label} className="card">
              <p className="cardLabel">{cluster.label}</p>
              <h2>{cluster.members.length} members</h2>
              <p>{cluster.members.join(' · ')}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
