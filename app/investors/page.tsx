import Link from 'next/link';
import { getCurrentWorkspace } from '@/lib/workspace';
import { buildInvestorIntelligence } from '@/lib/investorIntelligence';

export default function InvestorsPage() {
  const workspace = getCurrentWorkspace();
  const report = buildInvestorIntelligence(workspace.investors, ['food-tech', 'distribution', 'metrics'], workspace.name);

  return (
    <main className="page">
      <section className="pageHeader">
        <div>
          <p className="eyebrow">Investors</p>
          <h1>{workspace.name} investor database</h1>
          <p className="lede">Import investor lists from CSV or XLSX, dedupe by email, segment by tags, and inspect each contact from a working CRM view.</p>
        </div>
        <Link className="button buttonSecondary" href="/intelligence">
          View intelligence
        </Link>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <h2>Sample list</h2>
          <p>Seeded placeholders to validate layout and navigation.</p>
        </div>

        <div className="table">
          <div className="tableRow tableHead">
            <span>Name</span>
            <span>Email</span>
            <span>Type</span>
            <span>Score</span>
          </div>
          {report.recommendations.map((investor) => (
            <div key={investor.id} className="tableRow">
              <span>{investor.name}</span>
              <span>{investor.email}</span>
              <span>{investor.type}</span>
              <span>{investor.score}/100</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
