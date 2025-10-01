'use client';

import React, { useState, useEffect } from 'react';
import { ConnectorCard } from '@/components/dashboard/ConnectorCard';
import { StatusCard } from '@/components/dashboard/StatusCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { Connector, Analytics, ActivityItem } from '@/types';
import { get } from '@/utils/api';

// PUBLIC_INTERFACE
export default function Dashboard() {
  /**
   * Main dashboard page displaying connector overview and system status
   */
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load connectors data (fallback to mock data)
      const connectorsResponse = await get<Connector[]>('/connectors');
      if (connectorsResponse.status === 'success') {
        setConnectors(connectorsResponse.data || []);
      } else {
        // Mock data fallback
        setConnectors(mockConnectors);
      }

      // Load analytics data (fallback to mock data)
      const analyticsResponse = await get<Analytics>('/analytics');
      if (analyticsResponse.status === 'success') {
        setAnalytics(analyticsResponse.data || null);
      } else {
        // Mock data fallback
        setAnalytics(mockAnalytics);
      }

      // Load recent activity (fallback to mock data)
      const activityResponse = await get<ActivityItem[]>('/activity/recent');
      if (activityResponse.status === 'success') {
        setRecentActivity(activityResponse.data || []);
      } else {
        // Mock data fallback
        setRecentActivity(mockActivity);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Use mock data on error
      setConnectors(mockConnectors);
      setAnalytics(mockAnalytics);
      setRecentActivity(mockActivity);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded-md w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-gray-200 rounded-lg"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor your integrations and workflows</p>
          <div className="mt-2">
            <a href="/connect" className="text-sm text-blue-700 hover:underline">
              Connect JIRA/Confluence →
            </a>
          </div>
        </div>
        <QuickActions />
      </div>

      {/* Status Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatusCard
            title="Active Connections"
            value={analytics.totalConnections}
            change="+12%"
            changeType="positive"
            icon="🔗"
          />
          <StatusCard
            title="Running Integrations"
            value={analytics.activeIntegrations}
            change="+5%"
            changeType="positive"
            icon="⚡"
          />
          <StatusCard
            title="Workflow Runs"
            value={analytics.workflowRuns}
            change="+23%"
            changeType="positive"
            icon="🔄"
          />
          <StatusCard
            title="System Uptime"
            value={`${analytics.uptime}%`}
            change="+0.1%"
            changeType="positive"
            icon="📊"
          />
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connectors Grid */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Connectors</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {connectors.map(connector => (
              <ConnectorCard
                key={connector.id}
                connector={connector}
                onConnect={() => {}}
                onDisconnect={() => {}}
              />
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="space-y-6">
          <ActivityFeed activities={recentActivity} />
        </div>
      </div>
    </div>
  );
}

// Mock data for development
const mockConnectors: Connector[] = [
  {
    id: 'jira',
    name: 'jira',
    displayName: 'Jira',
    description: 'Project management and issue tracking',
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
    description: 'Team collaboration and documentation',
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
    description: 'Code repository and collaboration',
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
    description: 'Team communication and messaging',
    icon: '💬',
    category: 'communication',
    status: 'pending',
    isOAuthSupported: true,
    requiredScopes: ['channels:read', 'chat:write'],
    website: 'https://slack.com',
    documentationUrl: 'https://api.slack.com/',
    supportedActions: ['search', 'send'],
  },
];

const mockAnalytics: Analytics = {
  totalConnections: 12,
  activeIntegrations: 8,
  workflowRuns: 245,
  errorRate: 0.02,
  responseTime: 150,
  uptime: 99.9,
  recentActivity: [],
};

const mockActivity: ActivityItem[] = [
  {
    id: '1',
    type: 'connection',
    title: 'Jira Connected',
    description: 'Successfully established connection to Jira workspace',
    timestamp: new Date().toISOString(),
    connectorId: 'jira',
    status: 'success',
  },
  {
    id: '2',
    type: 'workflow',
    title: 'Sync Workflow Completed',
    description: 'Issue synchronization completed for 15 items',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    status: 'success',
  },
  {
    id: '3',
    type: 'error',
    title: 'Connection Warning',
    description: 'Confluence token expires in 7 days',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    connectorId: 'confluence',
    status: 'warning',
  },
];
