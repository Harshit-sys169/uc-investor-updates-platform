import { analyticsBlocks } from '@/lib/mockData';
import {
  eventsByDay,
  eventsByInvestor,
  eventsByType,
  sampleTrackingEvents,
  sortEvents,
  summarizeTracking,
} from '@/lib/analytics';

function ChartBars({ labels, values, title }: { labels: string[]; values: number[]; title: string }) {
  const max = Math.max(...values, 1);
  return (
    <div className="panel">
      <div className="panelHeader">
        <div>
          <p className="eyebrow">{title}</p>
          <h2>Tracking trend</h2>
        </div>
      </div>
      <div className="barChart">
        {labels.map((label, index) => (
          <div key={label} className="barChartItem">
            <div className="barChartValue" style={{ height: `${Math.max(18, (values[index] / max) * 180)}px` }} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const summary = summarizeTracking(sampleTrackingEvents);
  const byDay = eventsByDay(sampleTrackingEvents, 7);
  const byType = eventsByType(sampleTrackingEvents);
  const byInvestor = eventsByInvestor(sampleTrackingEvents);
  const recent = sortEvents(sampleTrackingEvents).slice(0, 6);

  return (
    <main className="page">
      <section className="pageHeader">
        <div>
          <p className="eyebrow">Analytics</p>
          <h1>Engagement metrics</h1>
          <p className="lede">Tracking scaffolding for opens, clicks, replies, delivery events, and campaign-level reporting.</p>
        </div>
      </section>

      <section className="statsGrid">
        <article className="card">
          <p className="cardLabel">Open rate</p>
          <h2>{summary.openRate}</h2>
          <p>{summary.opened} opens out of {summary.sent} sends</p>
        </article>
        <article className="card">
          <p className="cardLabel">Click rate</p>
          <h2>{summary.clickRate}</h2>
          <p>{summary.clicked} clicks from tracked sends</p>
        </article>
        <article className="card">
          <p className="cardLabel">Reply rate</p>
          <h2>{summary.replyRate}</h2>
          <p>{summary.replied} replies captured in the workflow</p>
        </article>
        <article className="card">
          <p className="cardLabel">Events logged</p>
          <h2>{sampleTrackingEvents.length}</h2>
          <p>{summary.bounced} bounces and {summary.unsubscribed} unsubscribes</p>
        </article>
      </section>

      <section className="analyticsLayout">
        <ChartBars title="Last 7 days" labels={byDay.map((item) => item.label.slice(5))} values={byDay.map((item) => item.value)} />
        <div className="panel">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Breakdown</p>
              <h2>Event types</h2>
            </div>
          </div>
          <div className="stackedList">
            {byType.map((item) => (
              <div key={item.type} className="stackedRow">
                <span className="stackedLabel">{item.type}</span>
                <div className="stackedBarWrap">
                  <div className="stackedBar" style={{ width: `${Math.max(8, item.count * 18)}px` }} />
                </div>
                <span className="stackedCount">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="analyticsLayout">
        <div className="panel">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Investors</p>
              <h2>Most engaged contacts</h2>
            </div>
          </div>
          <div className="timeline">
            {byInvestor.length ? byInvestor.map((item) => (
              <div key={item.label} className="timelineItem">
                <div>
                  <p className="timelineTitle">{item.label}</p>
                  <p className="timelineMeta">Tracked interactions across the current campaign set.</p>
                </div>
                <span className="timelineStatus">{item.value} events</span>
              </div>
            )) : (
              <p className="muted">No investor-level events recorded yet.</p>
            )}
          </div>
        </div>

        <div className="panel">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Recent activity</p>
              <h2>Event stream</h2>
            </div>
          </div>
          <div className="timeline">
            {recent.map((event) => (
              <div key={event.id} className="timelineItem">
                <div>
                  <p className="timelineTitle">{event.label}</p>
                  <p className="timelineMeta">
                    {event.updateTitle}
                    {event.investorName ? ` · ${event.investorName}` : ''}
                  </p>
                </div>
                <span className="timelineStatus">{event.type}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panelHeader">
          <div>
            <p className="eyebrow">Instrumentation</p>
            <h2>Tracking scaffold</h2>
          </div>
        </div>
        <div className="grid">
          {analyticsBlocks.map((block) => (
            <article key={block.title} className="card">
              <p className="cardLabel">{block.label}</p>
              <h2>{block.title}</h2>
              <p>{block.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
