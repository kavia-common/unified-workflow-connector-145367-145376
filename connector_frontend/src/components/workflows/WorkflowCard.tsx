'use client';

import React from 'react';
import { Workflow } from '@/types';

interface WorkflowCardProps {
  workflow: Workflow;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
  onRun: () => void;
}

// PUBLIC_INTERFACE
export function WorkflowCard({ workflow, onEdit, onDelete, onToggleStatus, onRun }: WorkflowCardProps) {
  /**
   * Card component displaying workflow information and management actions
   */
  const getStatusColor = (status: Workflow['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Workflow['status']) => {
    switch (status) {
      case 'active': return '▶️';
      case 'inactive': return '⏸️';
      case 'draft': return '📝';
      default: return '⏸️';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatLastRun = (dateString?: string) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
  };

  return (
    <div className="card p-6 hover:shadow-lg transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}>
              {getStatusIcon(workflow.status)} {workflow.status}
            </span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{workflow.description}</p>
        </div>
      </div>

      {/* Workflow Steps Preview */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Workflow Steps:</p>
        <div className="bg-gray-50 rounded-lg p-3">
          {workflow.steps.length > 0 ? (
            <div className="flex items-center gap-2 overflow-x-auto">
              {workflow.steps.slice(0, 3).map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex items-center gap-2 px-2 py-1 bg-white rounded border whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-800">{step.name}</span>
                  </div>
                  {index < Math.min(workflow.steps.length - 1, 2) && (
                    <span className="text-gray-400">→</span>
                  )}
                </React.Fragment>
              ))}
              {workflow.steps.length > 3 && (
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  +{workflow.steps.length - 3} more
                </span>
              )}
            </div>
          ) : (
            <div className="text-center py-2">
              <span className="text-sm text-gray-500">No steps configured</span>
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{workflow.runCount}</div>
          <div className="text-xs text-gray-500">Total Runs</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-gray-800">
            {formatLastRun(workflow.lastRun)}
          </div>
          <div className="text-xs text-gray-500">Last Run</div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          <div>Created: {formatDate(workflow.createdAt)}</div>
          <div>Updated: {formatDate(workflow.updatedAt)}</div>
        </div>
        
        <div className="flex items-center gap-2">
          {workflow.status === 'active' && (
            <button
              onClick={onRun}
              className="px-2 py-1 text-xs text-blue-600 hover:text-blue-700 border border-blue-300 rounded-md hover:bg-blue-50"
            >
              ▶️ Run
            </button>
          )}
          
          <button
            onClick={onToggleStatus}
            className={`px-2 py-1 text-xs rounded-md transition-colors ${
              workflow.status === 'active'
                ? 'text-gray-600 hover:text-gray-800 border border-gray-300 hover:bg-gray-50'
                : 'text-green-600 hover:text-green-700 border border-green-300 hover:bg-green-50'
            }`}
          >
            {workflow.status === 'active' ? 'Pause' : 'Activate'}
          </button>
          
          <button
            onClick={onEdit}
            className="px-2 py-1 text-xs text-blue-600 hover:text-blue-700 border border-blue-300 rounded-md hover:bg-blue-50"
          >
            Edit
          </button>
          
          <button
            onClick={onDelete}
            className="px-2 py-1 text-xs text-red-600 hover:text-red-700 border border-red-300 rounded-md hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
