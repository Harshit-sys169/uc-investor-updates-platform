export const overviewCards = [
  {
    label: 'Product scope',
    title: 'Core routes established',
    description: 'The first pass adds stable routes and a visual structure for the product.',
  },
  {
    label: 'Execution order',
    title: 'Foundation before features',
    description: 'Next tasks will connect authentication, tenant data, and API workflows.',
  },
  {
    label: 'Delivery path',
    title: 'Incremental build plan',
    description: 'Each milestone will be implemented and verified before moving forward.',
  },
];

export const dashboardStats = [
  {
    label: 'Drafts',
    value: '12',
    change: '+3 this week',
    description: 'Placeholder metric until the update table is connected.',
  },
  {
    label: 'Sent',
    value: '8',
    change: '+2 this week',
    description: 'Messages marked as delivered in the sample dataset.',
  },
  {
    label: 'Replies',
    value: '4',
    change: '+1 this week',
    description: 'Inbound responses awaiting workflow wiring.',
  },
  {
    label: 'Open rate',
    value: '61%',
    change: '+8 pts',
    description: 'Engagement metric to be backed by event tracking.',
  },
];

export const recentActivity = [
  {
    title: 'Seeded demo company',
    meta: 'Workspace created with sample records.',
    status: 'Ready',
  },
  {
    title: 'Navigation scaffold',
    meta: 'Main routes added and linked.',
    status: 'Complete',
  },
  {
    title: 'Health endpoint',
    meta: 'Service health check responds on /api/health.',
    status: 'Live',
  },
];

export const investors = [
  { name: 'Apex Ventures', email: 'partner@apex.vc', type: 'VC', status: 'Active' },
  { name: 'Nexa Capital', email: 'invest@nexa.com', type: 'Angel', status: 'Active' },
  { name: 'Blue Ridge Fund', email: 'hello@blueridge.fund', type: 'Fund', status: 'Inactive' },
  { name: 'Summit Group', email: 'team@summitgroup.io', type: 'Strategic', status: 'Active' },
];

export const updateTemplates = [
  {
    label: 'Structure',
    title: 'Monthly founder update',
    description: 'Highlights, metrics, challenges, asks, and next steps in a repeatable template.',
  },
  {
    label: 'Planning',
    title: 'Board-style summary',
    description: 'A more formal format for investor syncs and board distribution.',
  },
  {
    label: 'Tone',
    title: 'Concise investor note',
    description: 'Short-form communication for quick periodic touchpoints.',
  },
];

export const analyticsBlocks = [
  {
    label: 'Engagement',
    title: 'Open and click tracking',
    description: 'Event-level tracking will connect to email delivery and performance reporting.',
  },
  {
    label: 'Response',
    title: 'Reply capture',
    description: 'Inbound replies will be linked to investors and updates for review.',
  },
  {
    label: 'Trends',
    title: 'Time-series reporting',
    description: 'Cohort and campaign trends will be added once the database layer is connected.',
  },
];

export const deliveryOperations = [
  { title: 'Structured logs', description: 'JSON-formatted logs with request context.' },
  { title: 'Rate limiting', description: 'Per-path request throttling at the middleware layer.' },
  { title: 'Health probes', description: 'Readiness and health endpoints for deploys.' },
  { title: 'Container support', description: 'Dockerfile and compose config for local and production parity.' },
];


export const observabilityBlocks = [
  {
    label: 'Telemetry',
    title: 'Metrics and spans',
    description: 'Tracks latency, errors, queue depth, and request traces across services.',
  },
  {
    label: 'Alerts',
    title: 'Threshold-based rules',
    description: 'Defines critical signals for AI latency, webhook failures, and queue buildup.',
  },
  {
    label: 'Response',
    title: 'Incident workflow',
    description: 'Surfaces open incidents, owners, and operational status inside the product shell.',
  },
];
