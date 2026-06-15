import { describe, expect, it } from 'vitest';
import {
  addBlock,
  defaultDraft,
  draftToJson,
  moveBlock,
  removeBlock,
  summarizeDraft,
  updateBlock,
} from '../lib/updateComposer';

describe('update composer helpers', () => {
  it('adds a new block', () => {
    const draft = addBlock(defaultDraft, 'text');
    expect(draft.blocks).toHaveLength(defaultDraft.blocks.length + 1);
    expect(draft.blocks.at(-1)?.type).toBe('text');
  });

  it('updates a block by id', () => {
    const target = defaultDraft.blocks[1];
    const draft = updateBlock(defaultDraft, target.id, { content: 'Updated copy' });
    const updated = draft.blocks.find((block) => block.id === target.id);
    expect(updated && 'content' in updated ? updated.content : undefined).toBe('Updated copy');
  });

  it('removes a block', () => {
    const draft = removeBlock(defaultDraft, defaultDraft.blocks[0].id);
    expect(draft.blocks).toHaveLength(defaultDraft.blocks.length - 1);
  });

  it('moves blocks up and down', () => {
    const second = defaultDraft.blocks[1];
    const movedUp = moveBlock(defaultDraft, second.id, 'up');
    expect(movedUp.blocks[0].id).toBe(second.id);

    const movedDown = moveBlock(movedUp, second.id, 'down');
    expect(movedDown.blocks[1].id).toBe(second.id);
  });

  it('summarizes the draft', () => {
    const summary = summarizeDraft(defaultDraft);
    expect(summary.blockCount).toBe(defaultDraft.blocks.length);
    expect(summary.hasCTA).toBe(true);
    expect(summary.hasFooter).toBe(true);
    expect(summary.metricCount).toBeGreaterThan(0);
  });

  it('serializes to json', () => {
    const json = draftToJson(defaultDraft);
    expect(json).toContain('May founder update');
    expect(json).toContain('Acme Foods');
  });
});
