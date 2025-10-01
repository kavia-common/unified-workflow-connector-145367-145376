import { SearchResult } from '@/types';
import { get, post } from '@/utils/api';

// PUBLIC_INTERFACE
export interface ConnectorClient {
  id: string;
  label: string;
  prefix: string;
  icon: string;
  search(query: string, resource?: string): Promise<SearchResult[]>;
  create?(resource: string, payload: Record<string, unknown>): Promise<SearchResult>;
  getProjects?(): Promise<unknown[]>;
  getSpaces?(): Promise<unknown[]>;
}

// Jira connector client
const jiraClient: ConnectorClient = {
  id: 'jira',
  label: 'Jira',
  prefix: '@jira_',
  icon: '🔧',
  
  async search(query: string, resource = 'issue'): Promise<SearchResult[]> {
    const response = await get<SearchResult[]>(`/connectors/jira/search?q=${encodeURIComponent(query)}&resource=${resource}`);
    if (response.status === 'success') {
      return response.data || [];
    }
    throw new Error(response.message || 'Search failed');
  },

  async create(resource: string, payload: Record<string, unknown>): Promise<SearchResult> {
    const response = await post<SearchResult>(`/connectors/jira/${resource}`, payload);
    if (response.status === 'success') {
      return response.data!;
    }
    throw new Error(response.message || 'Create failed');
  },

  async getProjects(): Promise<unknown[]> {
    const response = await get<unknown[]>('/connectors/jira/projects');
    if (response.status === 'success') {
      return response.data || [];
    }
    throw new Error(response.message || 'Failed to fetch projects');
  }
};

// Confluence connector client
const confluenceClient: ConnectorClient = {
  id: 'confluence',
  label: 'Confluence',
  prefix: '@confluence_',
  icon: '📄',
  
  async search(query: string, resource = 'page'): Promise<SearchResult[]> {
    const response = await get<SearchResult[]>(`/connectors/confluence/search?q=${encodeURIComponent(query)}&resource=${resource}`);
    if (response.status === 'success') {
      return response.data || [];
    }
    throw new Error(response.message || 'Search failed');
  },

  async create(resource: string, payload: Record<string, unknown>): Promise<SearchResult> {
    const response = await post<SearchResult>(`/connectors/confluence/${resource}`, payload);
    if (response.status === 'success') {
      return response.data!;
    }
    throw new Error(response.message || 'Create failed');
  },

  async getSpaces(): Promise<unknown[]> {
    const response = await get<unknown[]>('/connectors/confluence/spaces');
    if (response.status === 'success') {
      return response.data || [];
    }
    throw new Error(response.message || 'Failed to fetch spaces');
  }
};

// GitHub connector client (placeholder for future)
const githubClient: ConnectorClient = {
  id: 'github',
  label: 'GitHub',
  prefix: '@github_',
  icon: '🐙',
  
  async search(query: string, resource = 'repository'): Promise<SearchResult[]> {
    const response = await get<SearchResult[]>(`/connectors/github/search?q=${encodeURIComponent(query)}&resource=${resource}`);
    if (response.status === 'success') {
      return response.data || [];
    }
    throw new Error(response.message || 'Search failed');
  },

  async create(resource: string, payload: Record<string, unknown>): Promise<SearchResult> {
    const response = await post<SearchResult>(`/connectors/github/${resource}`, payload);
    if (response.status === 'success') {
      return response.data!;
    }
    throw new Error(response.message || 'Create failed');
  }
};

// Registry of all available connector clients
export const connectorRegistry: Record<string, ConnectorClient> = {
  jira: jiraClient,
  confluence: confluenceClient,
  github: githubClient,
};

// PUBLIC_INTERFACE
export function getConnectorClient(id: string): ConnectorClient | undefined {
  /**
   * Get connector client by ID
   */
  return connectorRegistry[id];
}

// PUBLIC_INTERFACE
export function getAllConnectors(): ConnectorClient[] {
  /**
   * Get all available connector clients
   */
  return Object.values(connectorRegistry);
}

// PUBLIC_INTERFACE
export function getConnectorByPrefix(prefix: string): ConnectorClient | undefined {
  /**
   * Get connector client by chat prefix (e.g., '@jira_')
   */
  return Object.values(connectorRegistry).find(client => client.prefix === prefix);
}

// PUBLIC_INTERFACE
export function detectConnectorPrefix(text: string): string | null {
  /**
   * Detect connector prefix in text input
   */
  const prefixes = Object.values(connectorRegistry).map(client => client.prefix);
  const foundPrefix = prefixes.find(prefix => text.includes(prefix));
  return foundPrefix || null;
}
