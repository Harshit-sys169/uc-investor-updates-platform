import Link from 'next/link';
import { getCurrentWorkspace } from '@/lib/workspace';
import { buildEnterpriseSnapshot } from '@/lib/enterprise';

export default function BillingPage() {
  const workspace = getCurrentWorkspace();
  const enterprise = buildEnterpriseSnapshot(workspace);

  return (
    <main className="page">
      <section className="pageHeader">
        <div>
          <p className="eyebrow">Billing</p>
          <h1>Plan and usage</h1>
          <p className="lede">Usage, invoices, and plan limits are grouped here for admin review.</p>
        </div>
        <Link className="button buttonSecondary" href="/enterprise">
          Back to enterprise
        </Link>
      </section>

      <section className="statsGrid">
        {enterprise.billing.usage.map((metric) => (
          <article key={metric.label} className="card">
            <p className="cardLabel">{metric.label}</p>
            <h2>{metric.value}</h2>
            <p>{metric.detail}</p>
          </article>
        ))}
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <h2>Current plan</h2>
            <p>{enterprise.billing.plan.price}</p>
          </div>
        </div>
        <div className="grid">
          <article className="card">
            <p className="cardLabel">Plan name</p>
            <h2>{enterprise.billing.plan.name}</h2>
          </article>
          <article className="card">
            <p className="cardLabel">Seats</p>
            <h2>{enterprise.billing.plan.seats}</h2>
          </article>
          <article className="card">
            <p className="cardLabel">Messages</p>
            <h2>{enterprise.billing.plan.messages}</h2>
          </article>
          <article className="card">
            <p className="cardLabel">Storage</p>
            <h2>{enterprise.billing.plan.storage}</h2>
          </article>
        </div>
        <div className="grid">
          {enterprise.billing.plan.features.map((feature) => (
            <article key={feature} className="card">
              <p className="cardLabel">Included</p>
              <h2>{feature}</h2>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <h2>Invoices</h2>
            <p>Sample billing records for the enterprise milestone.</p>
          </div>
        </div>

        <div className="table">
          <div className="tableRow tableHead">
            <span>Invoice</span>
            <span>Date</span>
            <span>Amount</span>
            <span>Status</span>
          </div>
          {enterprise.billing.invoices.map((invoice) => (
            <div key={invoice.id} className="tableRow">
              <span>{invoice.id}</span>
              <span>{invoice.date}</span>
              <span>{invoice.amount}</span>
              <span>{invoice.status}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
