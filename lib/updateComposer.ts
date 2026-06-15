export type UpdateBlockType = 'header' | 'text' | 'metrics' | 'cta' | 'image' | 'divider' | 'footer';

export type UpdateBlock =
  | { id: string; type: 'header'; imageUrl: string; backgroundColor: string; height: number }
  | { id: string; type: 'text'; content: string; fontSize: number; textColor: string }
  | { id: string; type: 'metrics'; items: Array<{ label: string; value: string; change: string }> }
  | { id: string; type: 'cta'; buttonText: string; url: string; backgroundColor: string }
  | { id: string; type: 'image'; imageUrl: string; caption: string }
  | { id: string; type: 'divider'; color: string; height: number }
  | { id: string; type: 'footer'; companyName: string; address: string; website: string };

export type UpdateDraft = {
  title: string;
  subject: string;
  audience: string;
  sendWindow: string;
  blocks: UpdateBlock[];
};

export const updateBlockLabels: Record<UpdateBlockType, string> = {
  header: 'Header',
  text: 'Text',
  metrics: 'Metrics',
  cta: 'CTA',
  image: 'Image',
  divider: 'Divider',
  footer: 'Footer',
};

export const defaultDraft: UpdateDraft = {
  title: 'May founder update',
  subject: 'Acme Foods | May 2026 update',
  audience: 'All active investors',
  sendWindow: 'Friday 09:00 IST',
  blocks: [
    {
      id: 'block-header',
      type: 'header',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      backgroundColor: '#111827',
      height: 130,
    },
    {
      id: 'block-text-1',
      type: 'text',
      content:
        'We closed the month with stronger repeat orders, better margins, and a cleaner production cadence. The team focused on consistency, not just top-line growth.',
      fontSize: 16,
      textColor: '#e5e7eb',
    },
    {
      id: 'block-metrics',
      type: 'metrics',
      items: [
        { label: 'Revenue', value: '$82k', change: '+14%' },
        { label: 'Gross margin', value: '41%', change: '+3 pts' },
        { label: 'On-time delivery', value: '96%', change: '+2 pts' },
      ],
    },
    {
      id: 'block-cta',
      type: 'cta',
      buttonText: 'View the full update',
      url: 'https://example.com/updates/may-2026',
      backgroundColor: '#8b5cf6',
    },
    {
      id: 'block-footer',
      type: 'footer',
      companyName: 'Acme Foods',
      address: 'Bengaluru, India',
      website: 'https://acmefoods.example',
    },
  ],
};

export function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function addBlock(draft: UpdateDraft, type: UpdateBlockType): UpdateDraft {
  const id = createId(type);

  const block: UpdateBlock =
    type === 'header'
      ? { id, type, imageUrl: '', backgroundColor: '#111827', height: 120 }
      : type === 'text'
        ? { id, type, content: 'Write the section copy here.', fontSize: 16, textColor: '#e5e7eb' }
        : type === 'metrics'
          ? { id, type, items: [{ label: 'Metric', value: '0', change: '+0%' }] }
          : type === 'cta'
            ? { id, type, buttonText: 'Call to action', url: 'https://example.com', backgroundColor: '#8b5cf6' }
            : type === 'image'
              ? { id, type, imageUrl: '', caption: 'Add a caption for this image.' }
              : type === 'divider'
                ? { id, type, color: '#334155', height: 1 }
                : { id, type, companyName: 'Company name', address: 'Company address', website: 'https://example.com' };

  return { ...draft, blocks: [...draft.blocks, block] };
}

export function updateBlock(draft: UpdateDraft, blockId: string, patch: Partial<UpdateBlock>): UpdateDraft {
  return {
    ...draft,
    blocks: draft.blocks.map((block) => (block.id === blockId ? ({ ...block, ...patch } as UpdateBlock) : block)),
  };
}

export function removeBlock(draft: UpdateDraft, blockId: string): UpdateDraft {
  return { ...draft, blocks: draft.blocks.filter((block) => block.id !== blockId) };
}

export function moveBlock(draft: UpdateDraft, blockId: string, direction: 'up' | 'down'): UpdateDraft {
  const index = draft.blocks.findIndex((block) => block.id === blockId);
  if (index < 0) return draft;

  const target = direction === 'up' ? index - 1 : index + 1;
  if (target < 0 || target >= draft.blocks.length) return draft;

  const blocks = [...draft.blocks];
  [blocks[index], blocks[target]] = [blocks[target], blocks[index]];
  return { ...draft, blocks };
}

export function summarizeDraft(draft: UpdateDraft) {
  return {
    blockCount: draft.blocks.length,
    metricCount: draft.blocks.filter((block) => block.type === 'metrics').reduce((sum, block) => sum + block.items.length, 0),
    hasCTA: draft.blocks.some((block) => block.type === 'cta'),
    hasFooter: draft.blocks.some((block) => block.type === 'footer'),
  };
}

export function draftToJson(draft: UpdateDraft) {
  return JSON.stringify(draft, null, 2);
}
