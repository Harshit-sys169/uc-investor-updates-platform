import { cookies } from 'next/headers';
import {
  dashboardStats as baseDashboardStats,
  recentActivity as baseRecentActivity,
  updateTemplates as baseUpdateTemplates,
  analyticsBlocks as baseAnalyticsBlocks,
} from './mockData';
import { buildInvestorSeed, type InvestorRecord } from './investorCRM';
import { getSessionUser } from './auth';

export type WorkspaceFixture = {
  slug: string;
  name: string;
  domain: string;
  dashboardStats: typeof baseDashboardStats;
  recentActivity: typeof baseRecentActivity;
  investors: InvestorRecord[];
  updateTemplates: typeof baseUpdateTemplates;
  analyticsBlocks: typeof baseAnalyticsBlocks;
};

const acmeSlug = 'acme-foods';
const northstarSlug = 'northstar-labs';

export const workspaceFixtures: WorkspaceFixture[] = [
  {
    slug: acmeSlug,
    name: 'Acme Foods',
    domain: 'acmefoods.vc',
    dashboardStats: baseDashboardStats,
    recentActivity: baseRecentActivity,
    investors: buildInvestorSeed(acmeSlug),
    updateTemplates: baseUpdateTemplates,
    analyticsBlocks: baseAnalyticsBlocks,
  },
  {
    slug: northstarSlug,
    name: 'Northstar Labs',
    domain: 'northstarlabs.io',
    dashboardStats: baseDashboardStats.map((stat, index) =>
      index === 0
        ? { ...stat, value: '7' }
        : index === 1
          ? { ...stat, value: '5' }
          : index === 2
            ? { ...stat, value: '9' }
            : { ...stat, value: '72%' },
    ),
    recentActivity: [
      { title: 'Imported 36 investors', meta: 'CSV import completed with 4 duplicates merged.', status: 'Live' },
      { title: 'Update scheduled', meta: 'Next monthly note planned for Friday 09:00 IST.', status: 'Queued' },
      { title: 'Inbox triaged', meta: '3 replies linked to investors and marked resolved.', status: 'Live' },
    ],
    investors: buildInvestorSeed(northstarSlug),
    updateTemplates: baseUpdateTemplates.map((template) => ({
      ...template,
      description: `${template.description} Styled for Northstar Labs and segmented by investor tier.`,
    })),
    analyticsBlocks: baseAnalyticsBlocks.map((block, index) =>
      index === 0 ? { ...block, title: 'Open rate by segment' } : index === 1 ? { ...block, title: 'Reply velocity' } : { ...block, title: 'Cohort retention' },
    ),
  },
];

export function getWorkspaceBySlug(slug?: string | null): WorkspaceFixture {
  return workspaceFixtures.find((workspace) => workspace.slug === slug) ?? workspaceFixtures[0];
}

export function getCurrentWorkspace() {
  const session = getSessionUser();
  const slug = cookies().get('uc_company_slug')?.value ?? session?.companySlug;
  return getWorkspaceBySlug(slug);
}

export function buildDemoSession(input: { name: string; email: string; companyName: string; role?: 'owner' | 'member' }) {
  const slug =
    input.companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48) || 'workspace';

  return {
    userId: `user_${slug}`,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    companySlug: slug,
    companyName: input.companyName.trim(),
    role: input.role ?? 'owner',
  };
}
