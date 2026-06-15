import { getSessionUser } from './auth';
import type { WorkspaceFixture } from './workspace';

export type EnterpriseRole = 'owner' | 'admin' | 'member' | 'viewer';

export type OrgMember = {
  id: string;
  name: string;
  email: string;
  role: EnterpriseRole;
  status: 'active' | 'invited' | 'suspended';
  lastActive: string;
};

export type AuditEntry = {
  id: string;
  actor: string;
  actorRole: EnterpriseRole;
  action: string;
  scope: string;
  severity: 'low' | 'medium' | 'high';
  details: string;
  at: string;
};

export type BillingMetric = {
  label: string;
  value: string;
  detail: string;
};

export type BillingPlan = {
  name: string;
  price: string;
  seats: string;
  messages: string;
  storage: string;
  support: string;
  features: string[];
};

export type EnterpriseSnapshot = {
  workspaceName: string;
  currentRole: EnterpriseRole;
  permissions: string[];
  members: OrgMember[];
  auditLog: AuditEntry[];
  billing: {
    plan: BillingPlan;
    usage: BillingMetric[];
    invoices: Array<{
      id: string;
      date: string;
      amount: string;
      status: 'paid' | 'due';
    }>;
  };
  controls: Array<{
    title: string;
    description: string;
    status: string;
  }>;
};

export function canAccessEnterprise(role: EnterpriseRole) {
  return role === 'owner' || role === 'admin';
}

export function getPermissionSet(role: EnterpriseRole) {
  if (role === 'owner') {
    return [
      'Manage workspace members',
      'View audit trail',
      'Edit billing plan',
      'Manage integrations',
      'Change security settings',
    ];
  }

  if (role === 'admin') {
    return [
      'Manage members',
      'View audit trail',
      'Manage integrations',
      'Review usage',
    ];
  }

  if (role === 'member') {
    return ['Create updates', 'Manage investors', 'View analytics'];
  }

  return ['View workspace data'];
}

export function buildEnterpriseSnapshot(workspace: WorkspaceFixture): EnterpriseSnapshot {
  const session = getSessionUser();
  const currentRole = (session?.role === 'member' ? 'member' : 'owner') as EnterpriseRole;

  const members: OrgMember[] = [
    {
      id: 'member_1',
      name: session?.name ?? 'Founder',
      email: session?.email ?? 'founder@example.com',
      role: currentRole,
      status: 'active',
      lastActive: '5 minutes ago',
    },
    {
      id: 'member_2',
      name: 'Finance Lead',
      email: 'finance@' + workspace.domain,
      role: 'admin',
      status: 'active',
      lastActive: '1 hour ago',
    },
    {
      id: 'member_3',
      name: 'Investor Relations',
      email: 'ir@' + workspace.domain,
      role: 'member',
      status: 'invited',
      lastActive: 'Pending invite',
    },
    {
      id: 'member_4',
      name: 'Read-only Advisor',
      email: 'advisor@' + workspace.domain,
      role: 'viewer',
      status: 'suspended',
      lastActive: '2 weeks ago',
    },
  ];

  const auditLog: AuditEntry[] = [
    {
      id: 'audit_1',
      actor: session?.name ?? 'Founder',
      actorRole: currentRole,
      action: 'Changed workspace branding',
      scope: 'Settings',
      severity: 'low',
      details: `Updated logo, colors, and sender identity for ${workspace.name}.`,
      at: '10 minutes ago',
    },
    {
      id: 'audit_2',
      actor: 'Finance Lead',
      actorRole: 'admin',
      action: 'Exported usage report',
      scope: 'Billing',
      severity: 'medium',
      details: 'Downloaded MRR and seat usage CSV for review.',
      at: '2 hours ago',
    },
    {
      id: 'audit_3',
      actor: 'Investor Relations',
      actorRole: 'member',
      action: 'Sent monthly update',
      scope: 'Updates',
      severity: 'low',
      details: 'Update was delivered to 42 investors with tracking enabled.',
      at: '1 day ago',
    },
    {
      id: 'audit_4',
      actor: 'System',
      actorRole: 'viewer',
      action: 'Flagged login anomaly',
      scope: 'Security',
      severity: 'high',
      details: 'Unusual login pattern triggered a review alert.',
      at: '3 days ago',
    },
  ];

  const plan: BillingPlan = {
    name: 'Scale',
    price: '$149/month',
    seats: '10 seats included',
    messages: '5,000 monthly sends',
    storage: '100 GB storage',
    support: 'Priority email support',
    features: [
      'Audit trail',
      'Role-based access controls',
      'Usage monitoring',
      'API access',
      'Team collaboration',
    ],
  };

  return {
    workspaceName: workspace.name,
    currentRole,
    permissions: getPermissionSet(currentRole),
    members,
    auditLog,
    billing: {
      plan,
      usage: [
        { label: 'Seats used', value: '4 / 10', detail: 'Includes owner, admin, and members.' },
        { label: 'Messages sent', value: '2,480', detail: 'This billing period.' },
        { label: 'Storage used', value: '22 GB', detail: 'Investor files and update assets.' },
        { label: 'API calls', value: '38,240', detail: 'Webhook and analytics traffic.' },
      ],
      invoices: [
        { id: 'INV-1042', date: 'May 01, 2026', amount: '$149.00', status: 'paid' },
        { id: 'INV-1068', date: 'Jun 01, 2026', amount: '$149.00', status: 'due' },
      ],
    },
    controls: [
      { title: 'Single sign-on', description: 'SAML and workspace-level domain controls.', status: 'Planned' },
      { title: 'Audit exports', description: 'CSV and JSON exports for reviews and compliance.', status: 'Available' },
      { title: 'Seat enforcement', description: 'Invite and access limits by plan size.', status: 'Available' },
      { title: 'API keys', description: 'Scoped tokens for integrations and automation.', status: 'Planned' },
    ],
  };
}
