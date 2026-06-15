import Link from 'next/link';
import {
  showcaseArtifacts,
  showcaseDemoSteps,
  showcaseHighlights,
  showcaseHiringAngles,
  showcaseStats,
} from '@/lib/showcase';

export default function ShowcasePage() {
  return (
    <main className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">Portfolio showcase</p>
          <h1>Built to read like a real product, not a classroom demo.</h1>
          <p className="lede">
            This layer is for recruiters, founders, and internship reviewers. It presents the
            product story, the implementation depth, and the reasons the repository deserves a
            second look.
          </p>

          <div className="actions">
            <Link className="button buttonPrimary" href="/dashboard">
              Open product
            </Link>
            <Link className="button buttonSecondary" href="/docs/SHOWCASE.md">
              Read the showcase guide
            </Link>
          </div>
        </div>

        <div className="heroPanel">
          <p className="panelTitle">Why this stands out</p>
          <ul className="checklist">
            {showcaseHiringAngles.slice(0, 4).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid">
        {showcaseStats.map((item) => (
          <article key={item.label} className="card">
            <p className="cardLabel">{item.label}</p>
            <h2>{item.value}</h2>
            <p>{item.detail}</p>
          </article>
        ))}
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <p className="eyebrow">Core highlights</p>
            <h2>What a reviewer sees in under a minute</h2>
          </div>
        </div>

        <div className="grid">
          {showcaseHighlights.map((item) => (
            <article key={item.title} className="card">
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <p className="eyebrow">Demo flow</p>
            <h2>Suggested live walkthrough</h2>
          </div>
        </div>

        <div className="timeline">
          {showcaseDemoSteps.map((item, index) => (
            <div key={item} className="timelineItem">
              <div>
                <p className="timelineTitle">Step {index + 1}</p>
                <p className="timelineMeta">{item}</p>
              </div>
              <span className="timelineStatus">Demo</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <p className="eyebrow">Positioning</p>
            <h2>Why this repo is hireable</h2>
          </div>
        </div>

        <div className="grid">
          {showcaseHiringAngles.map((item) => (
            <article key={item} className="card">
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <p className="eyebrow">Portfolio assets</p>
            <h2>Repository materials that help reviewers decide quickly</h2>
          </div>
        </div>

        <div className="grid">
          {showcaseArtifacts.map((item) => (
            <article key={item} className="card">
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
