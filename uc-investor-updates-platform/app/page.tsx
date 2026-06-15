import Link from 'next/link';
import { overviewCards } from '@/lib/mockData';

export default function HomePage() {
  return (
    <main className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">UC Investor Updates Platform</p>
          <h1>Draft, send, and track investor updates in one place.</h1>
          <p className="lede">
            This scaffold now includes the product shell, workflow surfaces, investor CRM,
            AI tools, analytics, enterprise controls, observability, and a dedicated showcase page
            for recruiters and reviewers.
          </p>

          <div className="actions">
            <Link className="button buttonPrimary" href="/dashboard">
              Open dashboard
            </Link>
            <Link className="button buttonSecondary" href="/investors">
              View investors
            </Link>
            <Link className="button buttonSecondary" href="/showcase">
              View showcase
            </Link>
          </div>
        </div>

        <div className="heroPanel">
          <p className="panelTitle">First milestone</p>
          <ul className="checklist">
            <li>App Router scaffold</li>
            <li>Shared navigation</li>
            <li>Route placeholders</li>
            <li>Reusable cards</li>
            <li>Health endpoint</li>
            <li>Enterprise controls</li>
            <li>Recruiter-facing showcase</li>
          </ul>
        </div>
      </section>

      <section className="grid">
        {overviewCards.map((card) => (
          <article key={card.title} className="card">
            <p className="cardLabel">{card.label}</p>
            <h2>{card.title}</h2>
            <p>{card.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
