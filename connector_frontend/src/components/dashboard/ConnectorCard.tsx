'use client';

import React from 'react';
import { Connector } from '@/types';

interface ConnectorCardProps {
  connector: Connector;
  onConnect: () => void;
  onDisconnect: () => void;
}

// PUBLIC_INTERFACE
export function ConnectorCard({ connector, onConnect, onDisconnect }: ConnectorCardProps) {
  /**
   * Card component displaying connector information and status
   */
  const getStatusColor = (status: Connector['status']) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Connector['status']) => {
    switch (status) {
      case 'connected': return 'Connected';
      case 'pending': return 'Connecting...';
      case 'error': return 'Error';
      default: return 'Not Connected';
    }
  };

  const getCategoryColor = (category: Connector['category']) => {
    switch (category) {
      case 'productivity': return 'bg-blue-100 text-blue-800';
      case 'development': return 'bg-purple-100 text-purple-800';
      case 'communication': return 'bg-green-100 text-green-800';
      case 'analytics': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="card p-6 hover:shadow-lg transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-2xl">
            {connector.icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{connector.displayName}</h3>
            <p className="text-sm text-gray-600">{connector.description}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(connector.status)}`}>
            {getStatusText(connector.status)}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(connector.category)}`}>
            {connector.category}
          </span>
        </div>
      </div>

      {/* Features */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Supported Actions:</p>
        <div className="flex flex-wrap gap-1">
          {connector.supportedActions.map((action) => (
            <span
              key={action}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
            >
              {action}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            {connector.isOAuthSupported ? '🔐' : '🔑'} 
            {connector.isOAuthSupported ? 'OAuth' : 'API Key'}
          </span>
          <a
            href={connector.documentationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700"
          >
            📚 Docs
          </a>
        </div>

        <div className="flex gap-2">
          {connector.status === 'connected' ? (
            <>
              <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50">
                Configure
              </button>
              <button
                onClick={onDisconnect}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded-md hover:bg-red-50"
              >
                Disconnect
              </button>
            </>
          ) : (
            <button
              onClick={onConnect}
              className="btn-primary text-sm py-1 px-4"
              disabled={connector.status === 'pending'}
            >
              {connector.status === 'pending' ? 'Connecting...' : 'Connect'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
