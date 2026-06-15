import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="page">
      <section className="panel">
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p className="lede">The requested route is not part of the current scaffold.</p>
        <div className="actions">
          <Link className="button buttonPrimary" href="/dashboard">
            Return to dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
