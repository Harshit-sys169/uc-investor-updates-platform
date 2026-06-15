import Link from 'next/link';
import { StatCard } from '@/components/StatCard';
import { getCurrentWorkspace } from '@/lib/workspace';
import { buildInvestorIntelligence } from '@/lib/investorIntelligence';
import { buildEnterpriseSnapshot } from '@/lib/enterprise';
import { getObservabilitySnapshot } from '@/lib/observability';

export default function DashboardPage() {
  const workspace = getCurrentWorkspace();
  const { dashboardStats, recentActivity } = workspace;
  const intelligence = buildInvestorIntelligence(workspace.investors, ['food-tech', 'distribution', 'metrics'], workspace.name);
  const enterprise = buildEnterpriseSnapshot(workspace);
  const observability = getObservabilitySnapshot();

  return (
    <main className="page">
      <section className="pageHeader">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>{workspace.name} overview</h1>
          <p className="lede">This screen is scoped to the active workspace and will later become the command center for updates, sending, and tracking.</p>
        </div>
      </section>

      <section className="statsGrid">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="panel">
        <div className="panelHeader">
          <h2>Investor intelligence</h2>
          <Link className="button buttonSecondary" href="/intelligence">
            Open recommendations
          </Link>
        </div>
        <div className="grid">
          <article className="card">
            <p className="cardLabel">Top fit</p>
            <h2>{intelligence.recommendations[0]?.name ?? 'No investors'}</h2>
            <p>{intelligence.recommendations[0]?.nextBestAction ?? 'No recommendations available.'}</p>
          </article>
          <article className="card">
            <p className="cardLabel">Average score</p>
            <h2>{intelligence.summary.averageScore}</h2>
            <p>Built from the active workspace investors.</p>
          </article>
        </div>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <h2>Enterprise controls</h2>
          <Link className="button buttonSecondary" href="/enterprise">
            Open admin view
          </Link>
        </div>
        <div className="grid">
          <article className="card">
            <p className="cardLabel">Current role</p>
            <h2>{enterprise.currentRole}</h2>
            <p>{enterprise.permissions.length} permissions active for this session.</p>
          </article>
          <article className="card">
            <p className="cardLabel">Members</p>
            <h2>{enterprise.members.length}</h2>
            <p>Seats are tracked through the billing layer.</p>
          </article>
        </div>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <h2>Recent activity</h2>
          <p>Workspace-specific sample data until the database and API layers are connected.</p>
        </div>
        <div className="timeline">
          {recentActivity.map((item) => (
            <div key={item.title} className="timelineItem">
              <div>
                <p className="timelineTitle">{item.title}</p>
                <p className="timelineMeta">{item.meta}</p>
              </div>
              <span className="timelineStatus">{item.status}</span>
            </div>
          ))}
        </div>
      </section>


      <section className="panel">
        <div className="panelHeader">
          <div>
            <h2>Operational view</h2>
            <p>Signals from the observability layer and production readiness endpoints.</p>
          </div>
          <Link className="button buttonSecondary" href="/observability">Open observability</Link>
        </div>
        <div className="grid">
          <article className="card">
            <p className="cardLabel">Requests</p>
            <h2>{observability.requestCount}</h2>
            <p>Sample traces captured across APIs and background jobs.</p>
          </article>
          <article className="card">
            <p className="cardLabel">Incidents</p>
            <h2>{observability.openIncidents}</h2>
            <p>{observability.alertsFiring} alert rules are currently firing.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
