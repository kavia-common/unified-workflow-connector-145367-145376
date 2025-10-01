'use client';

import React from 'react';

interface MetricsCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: string;
  status: 'healthy' | 'warning' | 'error';
}

// PUBLIC_INTERFACE
export function MetricsCard({ title, value, change, changeType = 'neutral', icon, status }: MetricsCardProps) {
  /**
   * Metrics card component for real-time monitoring display
   */
  const getStatusColor = (status: MetricsCardProps['status']) => {
    switch (status) {
      case 'healthy': return 'border-green-200 bg-green-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'error': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-white';
    }
  };

  const getChangeColor = (type: typeof changeType) => {
    switch (type) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className={`card p-6 border-2 ${getStatusColor(status)}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className={`text-sm font-medium mt-2 ${getChangeColor(changeType)}`}>
              {change} vs last period
            </p>
          )}
        </div>
        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-2xl">
          {icon}
        </div>
      </div>
    </div>
  );
}
