import Link from 'next/link';
import { getCurrentWorkspace } from '@/lib/workspace';
import { buildEnterpriseSnapshot } from '@/lib/enterprise';

export default function SettingsPage() {
  const workspace = getCurrentWorkspace();
  const enterprise = buildEnterpriseSnapshot(workspace);

  return (
    <main className="page">
      <section className="pageHeader">
        <div>
          <p className="eyebrow">Settings</p>
          <h1>Workspace settings</h1>
          <p className="lede">Company profile, branding, roles, billing, and access controls are surfaced here.</p>
        </div>
        <div className="actions">
          <Link className="button buttonSecondary" href="/enterprise">
            Admin view
          </Link>
          <Link className="button buttonSecondary" href="/billing">
            Billing
          </Link>
        </div>
      </section>

      <section className="statsGrid">
        <article className="card">
          <p className="cardLabel">Active role</p>
          <h2>{enterprise.currentRole}</h2>
          <p>{enterprise.permissions.join(' • ')}</p>
        </article>
        <article className="card">
          <p className="cardLabel">Billing plan</p>
          <h2>{enterprise.billing.plan.name}</h2>
          <p>{enterprise.billing.plan.price}</p>
        </article>
        <article className="card">
          <p className="cardLabel">Organization</p>
          <h2>{workspace.name}</h2>
          <p>{workspace.domain}</p>
        </article>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <h2>Access controls</h2>
            <p>Role-aware controls for enterprise workflows.</p>
          </div>
        </div>
        <div className="grid">
          {enterprise.controls.map((control) => (
            <article key={control.title} className="card">
              <p className="cardLabel">{control.status}</p>
              <h2>{control.title}</h2>
              <p>{control.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
