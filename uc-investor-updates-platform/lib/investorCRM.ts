export type InvestorStage = 'Prospect' | 'Warm' | 'Active' | 'Dormant';

export type InvestorRecord = {
  id: string;
  name: string;
  email: string;
  type: string;
  stage: InvestorStage;
  tags: string[];
  lastContact: string;
  notes: string;
  status: 'Active' | 'Inactive' | 'Warm';
};

export type ImportRow = {
  name: string;
  email: string;
  type?: string;
  stage?: InvestorStage;
  tags?: string[];
  notes?: string;
  lastContact?: string;
};

export type ImportResult = {
  imported: InvestorRecord[];
  duplicates: ImportRow[];
  invalid: ImportRow[];
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizeName(name: string) {
  return name.trim().replace(/\s+/g, ' ');
}

function toStage(value: unknown): InvestorStage {
  const normalized = String(value ?? '').trim().toLowerCase();
  if (normalized === 'warm') return 'Warm';
  if (normalized === 'active') return 'Active';
  if (normalized === 'dormant') return 'Dormant';
  return 'Prospect';
}

function toTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((tag) => String(tag).trim()).filter(Boolean);
  }
  return String(value ?? '')
    .split(/[;,|]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function stableId(email: string) {
  return `inv_${normalizeEmail(email).replace(/[^a-z0-9]/g, '_')}`;
}

export function buildInvestorSeed(companySlug: string): InvestorRecord[] {
  const acme: InvestorRecord[] = [
    {
      id: 'inv_partner_apex_vc',
      name: 'Apex Ventures',
      email: 'partner@apex.vc',
      type: 'VC',
      stage: 'Active',
      tags: ['lead', 'food-tech'],
      lastContact: '2026-05-20',
      notes: 'Interested in monthly metrics and margin expansion.',
      status: 'Active',
    },
    {
      id: 'inv_invest_nexa_com',
      name: 'Nexa Capital',
      email: 'invest@nexa.com',
      type: 'Angel',
      stage: 'Warm',
      tags: ['angel', 'secondary'],
      lastContact: '2026-05-12',
      notes: 'Prefers concise updates with metrics first.',
      status: 'Warm',
    },
    {
      id: 'inv_hello_blueridge_fund',
      name: 'Blue Ridge Fund',
      email: 'hello@blueridge.fund',
      type: 'Fund',
      stage: 'Dormant',
      tags: ['fund', 'follow-up'],
      lastContact: '2026-04-18',
      notes: 'Re-engage after product launch.',
      status: 'Inactive',
    },
    {
      id: 'inv_team_summitgroup_io',
      name: 'Summit Group',
      email: 'team@summitgroup.io',
      type: 'Strategic',
      stage: 'Active',
      tags: ['strategic', 'distribution'],
      lastContact: '2026-05-19',
      notes: 'Open to supply-chain distribution conversations.',
      status: 'Active',
    },
  ];

  const northstar: InvestorRecord[] = [
    {
      id: 'inv_partners_orbit_capital',
      name: 'Orbit Capital',
      email: 'partners@orbit.capital',
      type: 'VC',
      stage: 'Active',
      tags: ['vc', 'software'],
      lastContact: '2026-05-18',
      notes: 'Tracking follow-up after seed deck review.',
      status: 'Active',
    },
    {
      id: 'inv_hello_harborangels_io',
      name: 'Harbor Angels',
      email: 'hello@harborangels.io',
      type: 'Angel',
      stage: 'Warm',
      tags: ['angel', 'community'],
      lastContact: '2026-05-14',
      notes: 'Wants monthly progress and product screenshots.',
      status: 'Active',
    },
    {
      id: 'inv_team_signal_vc',
      name: 'Signal Syndicate',
      email: 'team@signal.vc',
      type: 'Fund',
      stage: 'Prospect',
      tags: ['fund', 'climate'],
      lastContact: '2026-05-03',
      notes: 'Needs a cleaner pipeline update before commitment.',
      status: 'Warm',
    },
    {
      id: 'inv_ops_vertex_partners',
      name: 'Vertex Partners',
      email: 'ops@vertex.partners',
      type: 'Strategic',
      stage: 'Active',
      tags: ['strategic', 'partner'],
      lastContact: '2026-05-21',
      notes: 'Best contact for enterprise distribution leads.',
      status: 'Active',
    },
  ];

  return companySlug === 'northstar-labs' ? northstar : acme;
}

export function deriveTagOptions(records: InvestorRecord[]) {
  return Array.from(new Set(records.flatMap((record) => record.tags))).sort();
}

export function searchInvestors(records: InvestorRecord[], query: string, activeTag?: string) {
  const q = query.trim().toLowerCase();

  return records.filter((record) => {
    const matchesQuery =
      !q ||
      record.name.toLowerCase().includes(q) ||
      record.email.toLowerCase().includes(q) ||
      record.type.toLowerCase().includes(q) ||
      record.notes.toLowerCase().includes(q) ||
      record.tags.some((tag) => tag.toLowerCase().includes(q));

    const matchesTag = !activeTag || record.tags.includes(activeTag);
    return matchesQuery && matchesTag;
  });
}

export function importRows(existing: InvestorRecord[], rows: ImportRow[]): ImportResult {
  const seen = new Set(existing.map((record) => normalizeEmail(record.email)));
  const imported: InvestorRecord[] = [];
  const duplicates: ImportRow[] = [];
  const invalid: ImportRow[] = [];

  for (const row of rows) {
    const name = normalizeName(row.name ?? '');
    const email = normalizeEmail(row.email ?? '');

    if (!name || !email || !email.includes('@')) {
      invalid.push(row);
      continue;
    }

    if (seen.has(email)) {
      duplicates.push({ ...row, name, email });
      continue;
    }

    seen.add(email);
    imported.push({
      id: stableId(email),
      name,
      email,
      type: row.type?.trim() || 'Investor',
      stage: row.stage ?? 'Prospect',
      tags: row.tags?.length ? row.tags : ['imported'],
      lastContact: row.lastContact ?? new Date().toISOString().slice(0, 10),
      notes: row.notes?.trim() || 'Imported from spreadsheet.',
      status: row.stage === 'Warm' || row.stage === 'Active' ? 'Active' : 'Warm',
    });
  }

  return { imported, duplicates, invalid };
}

export function parseCsv(text: string): ImportRow[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  const delimiter = lines[0].includes('\t') ? '\t' : ',';
  const headers = lines[0].split(delimiter).map((header) => header.trim().toLowerCase());

  return lines.slice(1).map((line) => {
    const values = line.split(delimiter).map((value) => value.trim());
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] ?? '';
    });

    return {
      name: row.name ?? row.company ?? '',
      email: row.email ?? row.contact_email ?? '',
      type: row.type || row.category || 'Investor',
      stage: toStage(row.stage),
      tags: toTags(row.tags),
      notes: row.notes || row.note || '',
      lastContact: row.lastcontact || row.last_contact || row.last_touch || '',
    } satisfies ImportRow;
  });
}

export async function parseWorkbook(file: File): Promise<ImportRow[]> {
  const { read, utils } = await import('xlsx');
  const buffer = await file.arrayBuffer();
  const workbook = read(buffer, { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });

  return rows.map((row) => ({
    name: String(row.name ?? row.Name ?? row.company ?? row.Company ?? '').trim(),
    email: String(row.email ?? row.Email ?? row.contact_email ?? row['Contact Email'] ?? '').trim(),
    type: String(row.type ?? row.Type ?? row.category ?? row.Category ?? 'Investor').trim(),
    stage: toStage(row.stage ?? row.Stage),
    tags: toTags(row.tags ?? row.Tags),
    notes: String(row.notes ?? row.Notes ?? row.note ?? row.Note ?? '').trim(),
    lastContact: String(row.lastContact ?? row.LastContact ?? row.last_contact ?? row['Last Contact'] ?? '').trim(),
  }));
}
