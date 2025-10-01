'use client';

import React from 'react';

interface UsageStatsProps {
  timeRange: string;
}

// PUBLIC_INTERFACE
export function UsageStats({ timeRange }: UsageStatsProps) {
  /**
   * Usage statistics component showing detailed metrics for the specified time range
   */
  // Stats would be filtered by timeRange in a real implementation
  console.log('Loading usage stats for timeRange:', timeRange);
  const stats = [
    { label: 'API Calls', value: '15,420', change: '+12%', changeType: 'positive' as const },
    { label: 'Unique Users', value: '45', change: '+8%', changeType: 'positive' as const },
    { label: 'Error Rate', value: '0.2%', change: '-0.1%', changeType: 'positive' as const },
    { label: 'Avg Session', value: '24m', change: '+5%', changeType: 'positive' as const },
  ];

  const getChangeColor = (type: 'positive' | 'negative') => {
    return type === 'positive' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Statistics</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">{stat.label}</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</div>
              </div>
              <div className={`text-sm font-medium ${getChangeColor(stat.changeType)}`}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-blue-900">Most Active Time</div>
            <div className="text-sm text-blue-700">2:00 PM - 4:00 PM UTC</div>
          </div>
          <div className="text-2xl">🕐</div>
        </div>
      </div>
    </div>
  );
}
