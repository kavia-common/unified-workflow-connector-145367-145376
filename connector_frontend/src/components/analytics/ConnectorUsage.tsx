'use client';

import React from 'react';

interface ConnectorUsageProps {
  timeRange: string;
}

// PUBLIC_INTERFACE
export function ConnectorUsage({ timeRange }: ConnectorUsageProps) {
  /**
   * Connector usage breakdown component for the specified time range
   */
  // Data would be filtered by timeRange in a real implementation
  console.log('Loading connector usage for timeRange:', timeRange);
  const connectorData = [
    { name: 'Jira', usage: 45, icon: '🔧', calls: 6800 },
    { name: 'Slack', usage: 32, icon: '💬', calls: 4900 },
    { name: 'GitHub', usage: 23, icon: '🐙', calls: 3500 },
    { name: 'Confluence', usage: 15, icon: '📄', calls: 2300 },
    { name: 'Linear', usage: 8, icon: '📋', calls: 1200 },
  ];

  const totalCalls = connectorData.reduce((sum, connector) => sum + connector.calls, 0);

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Connector Usage</h3>
      
      <div className="space-y-4">
        {connectorData.map((connector) => (
          <div key={connector.name} className="flex items-center gap-3">
            <span className="text-lg">{connector.icon}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-900">{connector.name}</span>
                <span className="text-sm text-gray-600">{connector.usage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${connector.usage}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {connector.calls.toLocaleString()} calls
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900">Total API Calls</span>
          <span className="text-lg font-bold text-blue-600">
            {totalCalls.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
