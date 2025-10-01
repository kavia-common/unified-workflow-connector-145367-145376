// PUBLIC_INTERFACE
export interface Connector {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon: string;
  category: 'productivity' | 'development' | 'communication' | 'analytics';
  status: 'connected' | 'disconnected' | 'pending' | 'error';
  isOAuthSupported: boolean;
  requiredScopes: string[];
  website: string;
  documentationUrl: string;
  supportedActions: string[];
}

// PUBLIC_INTERFACE
export interface Connection {
  id: string;
  connectorId: string;
  tenantId: string;
  status: 'active' | 'expired' | 'revoked' | 'error';
  createdAt: string;
  lastRefreshed: string;
  scopes: string[];
  metadata: {
    siteUrl?: string;
    accountName?: string;
    lastError?: string;
  };
}

// PUBLIC_INTERFACE
export interface SearchResult {
  id: string;
  title: string;
  url: string;
  type: 'issue' | 'page' | 'project' | 'space' | 'repository' | 'document';
  subtitle?: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

// PUBLIC_INTERFACE
export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  connectorId: string;
  action: string;
  config: Record<string, unknown>;
  position: { x: number; y: number };
  inputs: WorkflowConnection[];
  outputs: WorkflowConnection[];
}

// PUBLIC_INTERFACE
export interface WorkflowConnection {
  id: string;
  sourceStepId: string;
  targetStepId: string;
  sourceOutput: string;
  targetInput: string;
}

// PUBLIC_INTERFACE
export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  steps: WorkflowStep[];
  connections: WorkflowConnection[];
  createdAt: string;
  updatedAt: string;
  lastRun?: string;
  runCount: number;
}

// PUBLIC_INTERFACE
export interface Integration {
  id: string;
  name: string;
  description: string;
  connectorIds: string[];
  status: 'active' | 'inactive' | 'error';
  createdAt: string;
  updatedAt: string;
  settings: Record<string, unknown>;
}

// PUBLIC_INTERFACE
export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

// PUBLIC_INTERFACE
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user';
  tenantId: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    emailNotifications: boolean;
  };
}

// PUBLIC_INTERFACE
export interface Analytics {
  totalConnections: number;
  activeIntegrations: number;
  workflowRuns: number;
  errorRate: number;
  responseTime: number;
  uptime: number;
  recentActivity: ActivityItem[];
}

// PUBLIC_INTERFACE
export interface ActivityItem {
  id: string;
  type: 'connection' | 'workflow' | 'integration' | 'error';
  title: string;
  description: string;
  timestamp: string;
  connectorId?: string;
  status: 'success' | 'error' | 'warning' | 'info';
}

// PUBLIC_INTERFACE
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'system';
  timestamp: string;
  references?: SearchResult[];
  attachments?: unknown[];
}

// PUBLIC_INTERFACE
export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  code?: string;
  retryAfter?: number;
}

// PUBLIC_INTERFACE
export interface PaginatedResponse<T = unknown> {
  items: T[];
  page: number;
  perPage: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}
