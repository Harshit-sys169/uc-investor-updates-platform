import Link from 'next/link';
import { getCurrentWorkspace } from '@/lib/workspace';
import { buildEnterpriseSnapshot } from '@/lib/enterprise';

export default function EnterprisePage() {
  const workspace = getCurrentWorkspace();
  const enterprise = buildEnterpriseSnapshot(workspace);

  return (
    <main className="page">
      <section className="pageHeader">
        <div>
          <p className="eyebrow">Enterprise</p>
          <h1>{workspace.name} admin console</h1>
          <p className="lede">
            Role management, billing state, audit readiness, and access controls are exposed as first-class product surfaces.
          </p>
        </div>
        <div className="actions">
          <Link className="button buttonSecondary" href="/audit">
            Audit log
          </Link>
          <Link className="button buttonSecondary" href="/billing">
            Billing
          </Link>
        </div>
      </section>

      <section className="statsGrid">
        <article className="card">
          <p className="cardLabel">Current role</p>
          <h2>{enterprise.currentRole}</h2>
          <p>Permissions: {enterprise.permissions.length}</p>
        </article>
        <article className="card">
          <p className="cardLabel">Plan</p>
          <h2>{enterprise.billing.plan.name}</h2>
          <p>{enterprise.billing.plan.price}</p>
        </article>
        <article className="card">
          <p className="cardLabel">Members</p>
          <h2>{enterprise.members.length}</h2>
          <p>Owner, admin, member, and viewer roles are represented.</p>
        </article>
        <article className="card">
          <p className="cardLabel">Audit coverage</p>
          <h2>{enterprise.auditLog.length}</h2>
          <p>Tracked actions across settings, billing, updates, and security.</p>
        </article>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <h2>Permission set</h2>
            <p>Capabilities available to the current session.</p>
          </div>
        </div>
        <div className="grid">
          {enterprise.permissions.map((permission) => (
            <article key={permission} className="card">
              <p className="cardLabel">Allowed</p>
              <h2>{permission}</h2>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <h2>Team members</h2>
            <p>Invites, role assignment, and access state.</p>
          </div>
        </div>

        <div className="table">
          <div className="tableRow tableHead">
            <span>Member</span>
            <span>Role</span>
            <span>Status</span>
            <span>Last active</span>
          </div>
          {enterprise.members.map((member) => (
            <div key={member.id} className="tableRow">
              <span>
                <strong>{member.name}</strong>
                <br />
                <span className="muted">{member.email}</span>
              </span>
              <span>{member.role}</span>
              <span>{member.status}</span>
              <span>{member.lastActive}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
