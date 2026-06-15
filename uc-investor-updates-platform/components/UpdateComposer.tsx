'use client';

import { useMemo, useState } from 'react';
import { addBlock, defaultDraft, draftToJson, moveBlock, removeBlock, summarizeDraft, updateBlock, updateBlockLabels, type UpdateBlock, type UpdateBlockType, type UpdateDraft } from '@/lib/updateComposer';

type Template = {
  label: string;
  title: string;
  description: string;
};

type Props = {
  companyName: string;
  templates: Template[];
};

function blockSummary(block: UpdateBlock) {
  switch (block.type) {
    case 'header':
      return `Header • ${block.height}px`;
    case 'text':
      return `Text • ${block.content.slice(0, 42)}${block.content.length > 42 ? '…' : ''}`;
    case 'metrics':
      return `Metrics • ${block.items.length} items`;
    case 'cta':
      return `CTA • ${block.buttonText}`;
    case 'image':
      return `Image • ${block.caption}`;
    case 'divider':
      return `Divider • ${block.height}px`;
    case 'footer':
      return `Footer • ${block.companyName}`;
  }
}


function trackEvent(payload: Record<string, unknown>) {
  void fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => undefined);
}

function PreviewBlock({ block }: { block: UpdateBlock }) {
  if (block.type === 'header') {
    return (
      <div className="previewHeader" style={{ background: block.backgroundColor, minHeight: block.height }}>
        <div className="previewHeaderInner">
          <p className="previewKicker">Email header</p>
          <h3>Founder update</h3>
          <p className="muted">Header image URL: {block.imageUrl || 'not set'}</p>
        </div>
      </div>
    );
  }

  if (block.type === 'text') {
    return (
      <div className="detailCard">
        <p className="previewKicker">Text block</p>
        <p style={{ fontSize: block.fontSize, color: block.textColor, margin: 0, lineHeight: 1.7 }}>{block.content}</p>
      </div>
    );
  }

  if (block.type === 'metrics') {
    return (
      <div className="metricGrid">
        {block.items.map((item, index) => (
          <div key={`${item.label}-${index}`} className="metricCard">
            <p className="muted">{item.label}</p>
            <h3>{item.value}</h3>
            <p className="metricChange">{item.change}</p>
          </div>
        ))}
      </div>
    );
  }

  if (block.type === 'cta') {
    return (
      <div className="detailCard">
        <p className="previewKicker">CTA block</p>
        <a className="button buttonPrimary" href={block.url}>
          {block.buttonText}
        </a>
        <p className="muted" style={{ marginTop: 10 }}>Destination: {block.url}</p>
      </div>
    );
  }

  if (block.type === 'image') {
    return (
      <div className="detailCard">
        <p className="previewKicker">Image block</p>
        <div className="imagePlaceholder">Image URL: {block.imageUrl || 'not set'}</div>
        <p className="muted">{block.caption}</p>
      </div>
    );
  }

  if (block.type === 'divider') {
    return <hr style={{ border: 'none', borderTop: `${block.height}px solid ${block.color}`, margin: '14px 0' }} />;
  }

  return (
    <div className="footerPreview">
      <strong>{block.companyName}</strong>
      <p>{block.address}</p>
      <p>{block.website}</p>
    </div>
  );
}

function BlockEditor({
  block,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  block: UpdateBlock;
  onUpdate: (patch: Partial<UpdateBlock>) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <article className="detailCard">
      <div className="blockHeader">
        <div>
          <p className="cardLabel">{updateBlockLabels[block.type]}</p>
          <h3>{blockSummary(block)}</h3>
        </div>
        <div className="blockActions">
          <button type="button" className="button buttonSecondary" onClick={onMoveUp}>Up</button>
          <button type="button" className="button buttonSecondary" onClick={onMoveDown}>Down</button>
          <button type="button" className="button buttonSecondary" onClick={onDelete}>Remove</button>
        </div>
      </div>

      {block.type === 'header' ? (
        <div className="fieldGrid">
          <label className="field">
            <span>Image URL</span>
            <input value={block.imageUrl} onChange={(e) => onUpdate({ imageUrl: e.target.value })} />
          </label>
          <label className="field">
            <span>Background color</span>
            <input value={block.backgroundColor} onChange={(e) => onUpdate({ backgroundColor: e.target.value })} />
          </label>
          <label className="field">
            <span>Height</span>
            <input type="number" min={60} max={300} value={block.height} onChange={(e) => onUpdate({ height: Number(e.target.value) })} />
          </label>
        </div>
      ) : null}

      {block.type === 'text' ? (
        <div className="fieldGrid">
          <label className="field fieldFull">
            <span>Content</span>
            <textarea rows={6} value={block.content} onChange={(e) => onUpdate({ content: e.target.value })} />
          </label>
          <label className="field">
            <span>Font size</span>
            <input type="number" min={12} max={24} value={block.fontSize} onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })} />
          </label>
          <label className="field">
            <span>Text color</span>
            <input value={block.textColor} onChange={(e) => onUpdate({ textColor: e.target.value })} />
          </label>
        </div>
      ) : null}

      {block.type === 'metrics' ? (
        <div className="fieldGrid">
          {block.items.map((item, index) => (
            <div key={`${item.label}-${index}`} className="metricEditor">
              <label className="field">
                <span>Label</span>
                <input
                  value={item.label}
                  onChange={(e) =>
                    onUpdate({
                      items: block.items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, label: e.target.value } : entry)),
                    } as Partial<UpdateBlock>)
                  }
                />
              </label>
              <label className="field">
                <span>Value</span>
                <input
                  value={item.value}
                  onChange={(e) =>
                    onUpdate({
                      items: block.items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, value: e.target.value } : entry)),
                    } as Partial<UpdateBlock>)
                  }
                />
              </label>
              <label className="field">
                <span>Change</span>
                <input
                  value={item.change}
                  onChange={(e) =>
                    onUpdate({
                      items: block.items.map((entry, itemIndex) => (itemIndex === index ? { ...entry, change: e.target.value } : entry)),
                    } as Partial<UpdateBlock>)
                  }
                />
              </label>
            </div>
          ))}
        </div>
      ) : null}

      {block.type === 'cta' ? (
        <div className="fieldGrid">
          <label className="field">
            <span>Button text</span>
            <input value={block.buttonText} onChange={(e) => onUpdate({ buttonText: e.target.value })} />
          </label>
          <label className="field">
            <span>URL</span>
            <input value={block.url} onChange={(e) => onUpdate({ url: e.target.value })} />
          </label>
          <label className="field">
            <span>Background color</span>
            <input value={block.backgroundColor} onChange={(e) => onUpdate({ backgroundColor: e.target.value })} />
          </label>
        </div>
      ) : null}

      {block.type === 'image' ? (
        <div className="fieldGrid">
          <label className="field">
            <span>Image URL</span>
            <input value={block.imageUrl} onChange={(e) => onUpdate({ imageUrl: e.target.value })} />
          </label>
          <label className="field fieldFull">
            <span>Caption</span>
            <input value={block.caption} onChange={(e) => onUpdate({ caption: e.target.value })} />
          </label>
        </div>
      ) : null}

      {block.type === 'divider' ? (
        <div className="fieldGrid">
          <label className="field">
            <span>Color</span>
            <input value={block.color} onChange={(e) => onUpdate({ color: e.target.value })} />
          </label>
          <label className="field">
            <span>Height</span>
            <input type="number" min={1} max={8} value={block.height} onChange={(e) => onUpdate({ height: Number(e.target.value) })} />
          </label>
        </div>
      ) : null}

      {block.type === 'footer' ? (
        <div className="fieldGrid">
          <label className="field">
            <span>Company name</span>
            <input value={block.companyName} onChange={(e) => onUpdate({ companyName: e.target.value })} />
          </label>
          <label className="field">
            <span>Address</span>
            <input value={block.address} onChange={(e) => onUpdate({ address: e.target.value })} />
          </label>
          <label className="field fieldFull">
            <span>Website</span>
            <input value={block.website} onChange={(e) => onUpdate({ website: e.target.value })} />
          </label>
        </div>
      ) : null}
    </article>
  );
}

export function UpdateComposer({ companyName, templates }: Props) {
  const [draft, setDraft] = useState<UpdateDraft>(defaultDraft);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]?.title ?? 'Monthly update');
  const [mode, setMode] = useState<'draft' | 'test' | 'scheduled'>('draft');

  const summary = useMemo(() => summarizeDraft(draft), [draft]);

  function replaceDraft(next: UpdateDraft) {
    setDraft(next);
  }

  return (
    <div className="composerLayout">
      <section className="panel">
        <div className="panelHeader">
          <div>
            <p className="eyebrow">Composer</p>
            <h2>{companyName} update builder</h2>
            <p className="muted">Assemble blocks, edit copy, and preview the email before sending.</p>
          </div>
          <div className="composerSummary">
            <span>{summary.blockCount} blocks</span>
            <span>{summary.metricCount} metrics</span>
            <span>{summary.hasCTA ? 'CTA present' : 'No CTA'}</span>
            <span>{summary.hasFooter ? 'Footer present' : 'No footer'}</span>
          </div>
        </div>

        <div className="composerToolbar">
          <label className="field">
            <span>Update title</span>
            <input value={draft.title} onChange={(e) => replaceDraft({ ...draft, title: e.target.value })} />
          </label>
          <label className="field">
            <span>Email subject</span>
            <input value={draft.subject} onChange={(e) => replaceDraft({ ...draft, subject: e.target.value })} />
          </label>
          <label className="field">
            <span>Audience</span>
            <input value={draft.audience} onChange={(e) => replaceDraft({ ...draft, audience: e.target.value })} />
          </label>
          <label className="field">
            <span>Send window</span>
            <input value={draft.sendWindow} onChange={(e) => replaceDraft({ ...draft, sendWindow: e.target.value })} />
          </label>
        </div>

        <div className="templateRail">
          {templates.map((template) => (
            <button
              key={template.title}
              type="button"
              className={selectedTemplate === template.title ? 'templateCard templateCardActive' : 'templateCard'}
              onClick={() => {
                setSelectedTemplate(template.title);
                setDraft((current) => ({ ...current, title: template.title }));
                trackEvent({
                  companyId: 'acme-foods',
                  companyName,
                  updateId: 'draft-current',
                  updateTitle: template.title,
                  type: 'draft_saved',
                  channel: 'web',
                  label: `Template selected: ${template.title}`,
                });
              }}
            >
              <p className="cardLabel">{template.label}</p>
              <strong>{template.title}</strong>
              <span>{template.description}</span>
            </button>
          ))}
        </div>

        <div className="blockPalette">
          {(Object.keys(updateBlockLabels) as UpdateBlockType[]).map((type) => (
            <button key={type} type="button" className="button buttonSecondary" onClick={() => setDraft((current) => addBlock(current, type))}>
              Add {updateBlockLabels[type]}
            </button>
          ))}
        </div>

        <div className="composerActions">
          <button
            type="button"
            className="button buttonPrimary"
            onClick={() =>
              trackEvent({
                companyId: 'acme-foods',
                companyName,
                updateId: 'draft-current',
                updateTitle: draft.title,
                type: 'draft_saved',
                channel: 'web',
                label: `Draft saved: ${draft.title}`,
              })
            }
          >
            Save draft
          </button>
          <button
            type="button"
            className="button buttonSecondary"
            onClick={() =>
              trackEvent({
                companyId: 'acme-foods',
                companyName,
                updateId: 'draft-current',
                updateTitle: draft.title,
                type: 'test_sent',
                channel: 'web',
                label: `Test email queued: ${draft.title}`,
              })
            }
          >
            Send test email
          </button>
          <label className="field inlineField">
            <span>Mode</span>
            <select value={mode} onChange={(e) => setMode(e.target.value as typeof mode)}>
              <option value="draft">Draft</option>
              <option value="test">Test send</option>
              <option value="scheduled">Scheduled send</option>
            </select>
          </label>
        </div>

        <div className="blockList">
          {draft.blocks.map((block) => (
            <BlockEditor
              key={block.id}
              block={block}
              onUpdate={(patch) => setDraft((current) => updateBlock(current, block.id, patch))}
              onDelete={() => setDraft((current) => removeBlock(current, block.id))}
              onMoveUp={() => setDraft((current) => moveBlock(current, block.id, 'up'))}
              onMoveDown={() => setDraft((current) => moveBlock(current, block.id, 'down'))}
            />
          ))}
        </div>
      </section>

      <aside className="panel composerPreview">
        <div className="panelHeader">
          <div>
            <p className="eyebrow">Preview</p>
            <h2>Live email render</h2>
            <p className="muted">This is a basic block preview. The send pipeline will be connected later.</p>
          </div>
        </div>

        <div className="previewMeta detailCard">
          <p><strong>Subject:</strong> {draft.subject}</p>
          <p><strong>Audience:</strong> {draft.audience}</p>
          <p><strong>Window:</strong> {draft.sendWindow}</p>
          <p><strong>Template:</strong> {selectedTemplate}</p>
          <p><strong>Mode:</strong> {mode}</p>
        </div>

        <div className="emailPreview">
          {draft.blocks.map((block) => (
            <PreviewBlock key={block.id} block={block} />
          ))}
        </div>

        <div className="detailCard previewJson">
          <p className="previewKicker">JSON payload</p>
          <pre>{draftToJson(draft)}</pre>
        </div>
      </aside>
    </div>
  );
}
