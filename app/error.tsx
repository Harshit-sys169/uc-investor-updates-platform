'use client';

import { useEffect } from 'react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="page">
      <section className="panel">
        <p className="eyebrow">Application error</p>
        <h1>Something went wrong</h1>
        <p className="lede">
          The request failed inside the app shell. The error boundary isolates the failure and keeps the rest of the platform recoverable.
        </p>
        <div className="actions">
          <button className="button buttonPrimary" onClick={reset}>
            Try again
          </button>
        </div>
      </section>
    </main>
  );
}
