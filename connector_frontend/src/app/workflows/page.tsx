'use client';

import React, { useState, useEffect } from 'react';
import { WorkflowCard } from '@/components/workflows/WorkflowCard';
import { CreateWorkflowModal } from '@/components/workflows/CreateWorkflowModal';
import { Workflow } from '@/types';
import { get } from '@/utils/api';
import toast from 'react-hot-toast';

// PUBLIC_INTERFACE
export default function WorkflowsPage() {
  /**
   * Workflows management page for creating and managing automated workflows
   */
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'draft'>('all');

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      setLoading(true);
      const response = await get<Workflow[]>('/workflows');
      
      if (response.status === 'success') {
        setWorkflows(response.data || []);
      } else {
        // Fallback to mock data
        setWorkflows(mockWorkflows);
      }
    } catch (error) {
      console.error('Failed to load workflows:', error);
      setWorkflows(mockWorkflows);
      toast.error('Failed to load workflows');
    } finally {
      setLoading(false);
    }
  };

  const filteredWorkflows = workflows.filter(workflow => {
    if (filter === 'all') return true;
    return workflow.status === filter;
  });

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    loadWorkflows();
    toast.success('Workflow created successfully!');
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
          <h1 className="text-3xl font-bold text-gray-900">Workflows</h1>
          <p className="text-gray-600 mt-1">
            Create and manage automated workflows between your connected services
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="btn-secondary">
            📚 Browse Templates
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            + New Workflow
          </button>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">Filter by status:</span>
        <div className="flex gap-2">
          {(['all', 'active', 'inactive', 'draft'] as const).map((status) => (
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
                {status === 'all' ? workflows.length : workflows.filter(w => w.status === status).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Workflows Grid */}
      {filteredWorkflows.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔄</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' ? 'No workflows yet' : `No ${filter} workflows`}
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first workflow to automate tasks between your connected services.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            Create Workflow
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkflows.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              onEdit={() => {}}
              onDelete={() => {}}
              onToggleStatus={() => {}}
              onRun={() => {}}
            />
          ))}
        </div>
      )}

      {/* Create Workflow Modal */}
      <CreateWorkflowModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}

// Mock data for development
const mockWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'Jira Issue Sync',
    description: 'Automatically sync Jira issues to Linear for better project tracking',
    status: 'active',
    steps: [],
    connections: [],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    lastRun: '2024-01-22T09:15:00Z',
    runCount: 156,
  },
  {
    id: '2',
    name: 'Slack Notifications',
    description: 'Send Slack messages when GitHub pull requests are created or updated',
    status: 'active',
    steps: [],
    connections: [],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-22T11:15:00Z',
    lastRun: '2024-01-22T08:45:00Z',
    runCount: 89,
  },
  {
    id: '3',
    name: 'Documentation Sync',
    description: 'Keep GitHub wiki in sync with Confluence documentation pages',
    status: 'draft',
    steps: [],
    connections: [],
    createdAt: '2024-01-20T15:00:00Z',
    updatedAt: '2024-01-21T16:45:00Z',
    runCount: 0,
  },
];
