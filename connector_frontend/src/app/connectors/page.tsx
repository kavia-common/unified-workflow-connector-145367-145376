'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ConnectorCard } from '@/components/dashboard/ConnectorCard';
import { ConnectorFilter } from '@/components/connectors/ConnectorFilter';
import { ConnectionModal } from '@/components/connectors/ConnectionModal';
import { Connector } from '@/types';
import { get } from '@/utils/api';
import toast from 'react-hot-toast';

// PUBLIC_INTERFACE
export default function ConnectorsPage() {
  /**
   * Connectors management page with filtering and connection capabilities
   */
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [filteredConnectors, setFilteredConnectors] = useState<Connector[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConnector, setSelectedConnector] = useState<Connector | null>(null);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    search: '',
  });

  const filterConnectors = useCallback(() => {
    let filtered = [...connectors];

    if (filters.category !== 'all') {
      filtered = filtered.filter(c => c.category === filters.category);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(c => c.status === filters.status);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(c =>
        c.displayName.toLowerCase().includes(searchLower) ||
        c.description.toLowerCase().includes(searchLower)
      );
    }

    setFilteredConnectors(filtered);
  }, [connectors, filters]);

  useEffect(() => {
    loadConnectors();
  }, []);

  useEffect(() => {
    filterConnectors();
  }, [filterConnectors]);

  const loadConnectors = async () => {
    try {
      setLoading(true);
      const response = await get<Connector[]>('/connectors');
      
      if (response.status === 'success') {
        setConnectors(response.data || []);
      } else {
        // Fallback to mock data
        setConnectors(mockConnectors);
      }
    } catch (err) {
      console.error('Failed to load connectors:', err);
      setConnectors(mockConnectors);
      toast.error('Failed to load connectors');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (connector: Connector) => {
    setSelectedConnector(connector);
    setShowConnectionModal(true);
  };

  const handleDisconnect = async (connector: Connector) => {
    if (confirm(`Are you sure you want to disconnect ${connector.displayName}?`)) {
      try {
        // TODO: Implement disconnect API call
        toast.success(`${connector.displayName} disconnected`);
        loadConnectors();
      } catch (err) {
        console.error('Failed to disconnect:', err);
        toast.error('Failed to disconnect');
      }
    }
  };

  const handleConnectionSuccess = () => {
    setShowConnectionModal(false);
    setSelectedConnector(null);
    loadConnectors();
    toast.success('Connector connected successfully!');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded-md w-1/3 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded-md mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Connectors</h1>
          <p className="text-gray-600 mt-1">
            Connect and manage integrations with external tools
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="btn-secondary">
            📚 Browse Marketplace
          </button>
          <button className="btn-primary">
            + Request Connector
          </button>
        </div>
      </div>

      {/* Filters */}
      <ConnectorFilter
        filters={filters}
        onFiltersChange={setFilters}
        totalCount={connectors.length}
        filteredCount={filteredConnectors.length}
      />

      {/* Connectors Grid */}
      {filteredConnectors.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔌</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filters.search || filters.category !== 'all' || filters.status !== 'all'
              ? 'No connectors match your filters'
              : 'No connectors available'}
          </h3>
          <p className="text-gray-600 mb-6">
            {filters.search || filters.category !== 'all' || filters.status !== 'all'
              ? 'Try adjusting your filters to see more results.'
              : 'Start by connecting your first integration.'}
          </p>
          <button
            onClick={() => setFilters({ category: 'all', status: 'all', search: '' })}
            className="btn-primary"
          >
            {filters.search || filters.category !== 'all' || filters.status !== 'all'
              ? 'Clear Filters'
              : 'Browse Available Connectors'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConnectors.map((connector) => (
            <ConnectorCard
              key={connector.id}
              connector={connector}
              onConnect={() => handleConnect(connector)}
              onDisconnect={() => handleDisconnect(connector)}
            />
          ))}
        </div>
      )}

      {/* Connection Modal */}
      {selectedConnector && (
        <ConnectionModal
          isOpen={showConnectionModal}
          onClose={() => {
            setShowConnectionModal(false);
            setSelectedConnector(null);
          }}
          connector={selectedConnector}
          onSuccess={handleConnectionSuccess}
        />
      )}
    </div>
  );
}

// Mock data for development
const mockConnectors: Connector[] = [
  {
    id: 'jira',
    name: 'jira',
    displayName: 'Jira',
    description: 'Project management and issue tracking platform',
    icon: '🔧',
    category: 'productivity',
    status: 'connected',
    isOAuthSupported: true,
    requiredScopes: ['read:jira-user', 'read:jira-work', 'write:jira-work'],
    website: 'https://atlassian.com/jira',
    documentationUrl: 'https://developer.atlassian.com/server/jira/',
    supportedActions: ['search', 'create', 'update', 'comment'],
  },
  {
    id: 'confluence',
    name: 'confluence',
    displayName: 'Confluence',
    description: 'Team collaboration and documentation platform',
    icon: '📄',
    category: 'productivity',
    status: 'connected',
    isOAuthSupported: true,
    requiredScopes: ['read:confluence-content.all', 'write:confluence-content'],
    website: 'https://atlassian.com/confluence',
    documentationUrl: 'https://developer.atlassian.com/server/confluence/',
    supportedActions: ['search', 'create', 'read'],
  },
  {
    id: 'github',
    name: 'github',
    displayName: 'GitHub',
    description: 'Code repository and collaboration platform',
    icon: '🐙',
    category: 'development',
    status: 'disconnected',
    isOAuthSupported: true,
    requiredScopes: ['repo', 'read:user'],
    website: 'https://github.com',
    documentationUrl: 'https://docs.github.com/en/rest',
    supportedActions: ['search', 'create', 'read'],
  },
  {
    id: 'slack',
    name: 'slack',
    displayName: 'Slack',
    description: 'Team communication and messaging platform',
    icon: '💬',
    category: 'communication',
    status: 'pending',
    isOAuthSupported: true,
    requiredScopes: ['channels:read', 'chat:write'],
    website: 'https://slack.com',
    documentationUrl: 'https://api.slack.com/',
    supportedActions: ['search', 'send'],
  },
  {
    id: 'linear',
    name: 'linear',
    displayName: 'Linear',
    description: 'Modern issue tracking and project management',
    icon: '📋',
    category: 'productivity',
    status: 'disconnected',
    isOAuthSupported: true,
    requiredScopes: ['read', 'write'],
    website: 'https://linear.app',
    documentationUrl: 'https://developers.linear.app/',
    supportedActions: ['search', 'create', 'update'],
  },
  {
    id: 'notion',
    name: 'notion',
    displayName: 'Notion',
    description: 'All-in-one workspace for notes and collaboration',
    icon: '📝',
    category: 'productivity',
    status: 'disconnected',
    isOAuthSupported: true,
    requiredScopes: ['read_content', 'insert_content'],
    website: 'https://notion.so',
    documentationUrl: 'https://developers.notion.com/',
    supportedActions: ['search', 'create', 'read'],
  },
];
