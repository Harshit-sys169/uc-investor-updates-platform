type StatCardProps = {
  label: string;
  value: string;
  change: string;
  description: string;
};

export function StatCard({ label, value, change, description }: StatCardProps) {
  return (
    <article className="card">
      <p className="cardLabel">{label}</p>
      <h2 style={{ fontSize: '2rem', margin: '0 0 6px' }}>{value}</h2>
      <p style={{ margin: '0 0 10px', color: 'var(--accent-2)', fontWeight: 600 }}>{change}</p>
      <p>{description}</p>
    </article>
  );
}
