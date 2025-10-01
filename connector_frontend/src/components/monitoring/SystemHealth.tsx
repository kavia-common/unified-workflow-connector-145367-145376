'use client';

import React from 'react';

// PUBLIC_INTERFACE
export function SystemHealth() {
  /**
   * System health overview component
   */
  const services = [
    { name: 'API Server', status: 'healthy', uptime: '99.9%' },
    { name: 'Database', status: 'healthy', uptime: '99.8%' },
    { name: 'Queue System', status: 'warning', uptime: '98.5%' },
    { name: 'File Storage', status: 'healthy', uptime: '99.9%' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '⚪';
    }
  };

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
      <div className="space-y-3">
        {services.map((service) => (
          <div key={service.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-lg">{getStatusIcon(service.status)}</span>
              <span className="font-medium text-gray-900">{service.name}</span>
            </div>
            <span className="text-sm text-gray-600">{service.uptime}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
