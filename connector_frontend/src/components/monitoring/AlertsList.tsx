'use client';

import React from 'react';

// PUBLIC_INTERFACE
export function AlertsList() {
  /**
   * System alerts and notifications list
   */
  const alerts = [
    {
      id: '1',
      type: 'warning',
      title: 'High Response Time',
      message: 'API response time exceeded 500ms threshold',
      timestamp: '2 minutes ago',
    },
    {
      id: '2',
      type: 'info',
      title: 'Maintenance Scheduled',
      message: 'System maintenance scheduled for tonight at 2 AM UTC',
      timestamp: '1 hour ago',
    },
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700">View All</button>
      </div>
      
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <span className="text-lg mt-0.5">{getAlertIcon(alert.type)}</span>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{alert.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
              <p className="text-xs text-gray-500 mt-2">{alert.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
