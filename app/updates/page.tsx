import { UpdateComposer } from '@/components/UpdateComposer';
import { updateTemplates } from '@/lib/mockData';

export default function UpdatesPage() {
  return (
    <main className="page">
      <section className="pageHeader">
        <div>
          <p className="eyebrow">Updates</p>
          <h1>Update composer</h1>
          <p className="lede">Draft founder updates with reusable blocks, live preview, and tracking-ready send scaffolding.</p>
        </div>
      </section>

      <UpdateComposer companyName="Acme Foods" templates={updateTemplates} />
    </main>
  );
}
