import Link from 'next/link';
import { getCurrentWorkspace } from '@/lib/workspace';
import { buildEnterpriseSnapshot } from '@/lib/enterprise';

export default function AuditPage() {
  const workspace = getCurrentWorkspace();
  const enterprise = buildEnterpriseSnapshot(workspace);

  return (
    <main className="page">
      <section className="pageHeader">
        <div>
          <p className="eyebrow">Audit</p>
          <h1>Audit trail</h1>
          <p className="lede">Track changes, exports, security events, and delivery actions with a role-aware history.</p>
        </div>
        <Link className="button buttonSecondary" href="/enterprise">
          Back to enterprise
        </Link>
      </section>

      <section className="statsGrid">
        <article className="card">
          <p className="cardLabel">High severity</p>
          <h2>{enterprise.auditLog.filter((entry) => entry.severity === 'high').length}</h2>
          <p>Items requiring review.</p>
        </article>
        <article className="card">
          <p className="cardLabel">Medium severity</p>
          <h2>{enterprise.auditLog.filter((entry) => entry.severity === 'medium').length}</h2>
          <p>Operational and billing activity.</p>
        </article>
        <article className="card">
          <p className="cardLabel">Low severity</p>
          <h2>{enterprise.auditLog.filter((entry) => entry.severity === 'low').length}</h2>
          <p>Routine workspace actions.</p>
        </article>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <h2>Recent events</h2>
            <p>Each row includes actor, scope, and severity for admin review.</p>
          </div>
        </div>

        <div className="timeline">
          {enterprise.auditLog.map((entry) => (
            <div key={entry.id} className="timelineItem">
              <div>
                <p className="timelineTitle">{entry.action}</p>
                <p className="timelineMeta">
                  {entry.actor} · {entry.actorRole} · {entry.scope}
                </p>
                <p className="muted">{entry.details}</p>
              </div>
              <span className="timelineStatus">{entry.severity}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
