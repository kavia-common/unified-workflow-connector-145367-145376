'use client';

import React, { useState, useEffect } from 'react';
import { IntegrationCard } from '@/components/integrations/IntegrationCard';
import { CreateIntegrationModal } from '@/components/integrations/CreateIntegrationModal';
import { Integration } from '@/types';
import { get } from '@/utils/api';
import toast from 'react-hot-toast';

// PUBLIC_INTERFACE
export default function IntegrationsPage() {
  /**
   * Integrations management page for viewing and managing active integrations
   */
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'error'>('all');

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    try {
      setLoading(true);
      const response = await get<Integration[]>('/integrations');
      
      if (response.status === 'success') {
        setIntegrations(response.data || []);
      } else {
        // Fallback to mock data
        setIntegrations(mockIntegrations);
      }
    } catch (error) {
      console.error('Failed to load integrations:', error);
      setIntegrations(mockIntegrations);
      toast.error('Failed to load integrations');
    } finally {
      setLoading(false);
    }
  };

  const filteredIntegrations = integrations.filter(integration => {
    if (filter === 'all') return true;
    return integration.status === filter;
  });

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    loadIntegrations();
    toast.success('Integration created successfully!');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded-md w-1/3 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded-md mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
          <p className="text-gray-600 mt-1">
            Manage your active integrations and workflows
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
        >
          + New Integration
        </button>
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">Filter by status:</span>
        <div className="flex gap-2">
          {(['all', 'active', 'inactive', 'error'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                filter === status
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">
                {status === 'all' ? integrations.length : integrations.filter(i => i.status === status).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Integrations Grid */}
      {filteredIntegrations.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚡</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' ? 'No integrations yet' : `No ${filter} integrations`}
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first integration to connect multiple tools together.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            Create Integration
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIntegrations.map((integration) => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              onEdit={() => {}}
              onDelete={() => {}}
              onToggleStatus={() => {}}
            />
          ))}
        </div>
      )}

      {/* Create Integration Modal */}
      <CreateIntegrationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}

// Mock data for development
const mockIntegrations: Integration[] = [
  {
    id: '1',
    name: 'Jira to Slack Notifications',
    description: 'Automatically post Slack messages when Jira issues are created or updated',
    connectorIds: ['jira', 'slack'],
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    settings: {
      jiraProject: 'PROJECT-1',
      slackChannel: '#dev-notifications',
      triggerEvents: ['created', 'updated', 'resolved'],
    },
  },
  {
    id: '2',
    name: 'Confluence to GitHub Sync',
    description: 'Sync documentation from Confluence to GitHub wiki pages',
    connectorIds: ['confluence', 'github'],
    status: 'active',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-22T11:15:00Z',
    settings: {
      confluenceSpace: 'DEV',
      githubRepo: 'company/docs',
      syncFrequency: 'daily',
    },
  },
  {
    id: '3',
    name: 'GitHub to Linear Issues',
    description: 'Create Linear issues from GitHub issues for better project tracking',
    connectorIds: ['github', 'linear'],
    status: 'inactive',
    createdAt: '2024-01-05T15:00:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
    settings: {
      githubRepo: 'company/frontend',
      linearTeam: 'Development',
      labelFilter: ['bug', 'enhancement'],
    },
  },
];
