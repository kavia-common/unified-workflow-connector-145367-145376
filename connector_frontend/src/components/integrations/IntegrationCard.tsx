'use client';

import React from 'react';
import { Integration } from '@/types';

interface IntegrationCardProps {
  integration: Integration;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

// PUBLIC_INTERFACE
export function IntegrationCard({ integration, onEdit, onDelete, onToggleStatus }: IntegrationCardProps) {
  /**
   * Card component displaying integration information and management actions
   */
  const getStatusColor = (status: Integration['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Integration['status']) => {
    switch (status) {
      case 'active': return '✅';
      case 'inactive': return '⏸️';
      case 'error': return '❌';
      default: return '⏸️';
    }
  };

  const getConnectorIcon = (connectorId: string) => {
    const icons: Record<string, string> = {
      jira: '🔧',
      confluence: '📄',
      github: '🐙',
      slack: '💬',
      linear: '📋',
      notion: '📝',
    };
    return icons[connectorId] || '🔗';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="card p-6 hover:shadow-lg transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{integration.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
              {getStatusIcon(integration.status)} {integration.status}
            </span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{integration.description}</p>
        </div>
      </div>

      {/* Connectors */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Connected Services:</p>
        <div className="flex items-center gap-2">
          {integration.connectorIds.map((connectorId, index) => (
            <React.Fragment key={connectorId}>
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg">
                <span className="text-lg">{getConnectorIcon(connectorId)}</span>
                <span className="text-sm font-medium text-blue-700 capitalize">
                  {connectorId}
                </span>
              </div>
              {index < integration.connectorIds.length - 1 && (
                <span className="text-gray-400">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Settings Preview */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Configuration:</p>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="space-y-1">
            {Object.entries(integration.settings).slice(0, 3).map(([key, value]) => (
              <div key={key} className="flex justify-between text-xs">
                <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                <span className="text-gray-800 font-medium">
                  {typeof value === 'string' ? value : JSON.stringify(value)}
                </span>
              </div>
            ))}
            {Object.keys(integration.settings).length > 3 && (
              <div className="text-xs text-gray-500 text-center pt-1">
                +{Object.keys(integration.settings).length - 3} more settings
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          <div>Created: {formatDate(integration.createdAt)}</div>
          <div>Updated: {formatDate(integration.updatedAt)}</div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleStatus}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              integration.status === 'active'
                ? 'text-gray-600 hover:text-gray-800 border border-gray-300 hover:bg-gray-50'
                : 'text-green-600 hover:text-green-700 border border-green-300 hover:bg-green-50'
            }`}
          >
            {integration.status === 'active' ? 'Pause' : 'Activate'}
          </button>
          
          <button
            onClick={onEdit}
            className="px-3 py-1 text-xs text-blue-600 hover:text-blue-700 border border-blue-300 rounded-md hover:bg-blue-50"
          >
            Edit
          </button>
          
          <button
            onClick={onDelete}
            className="px-3 py-1 text-xs text-red-600 hover:text-red-700 border border-red-300 rounded-md hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
