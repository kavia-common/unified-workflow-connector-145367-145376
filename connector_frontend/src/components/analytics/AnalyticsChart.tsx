'use client';

import React from 'react';

interface AnalyticsChartProps {
  timeRange: string;
}

// PUBLIC_INTERFACE
export function AnalyticsChart({ timeRange }: AnalyticsChartProps) {
  /**
   * Analytics chart component showing usage trends
   */
  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case '24h': return 'Last 24 Hours';
      case '7d': return 'Last 7 Days';
      case '30d': return 'Last 30 Days';
      case '90d': return 'Last 90 Days';
      default: return 'Last 7 Days';
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Usage Analytics</h3>
        <span className="text-sm text-gray-600">{getTimeRangeLabel(timeRange)}</span>
      </div>
      
      {/* Placeholder chart */}
      <div className="h-64 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <div className="text-gray-600">Analytics Chart</div>
          <div className="text-sm text-gray-500 mt-1">Data visualization for {timeRange}</div>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">15.4k</div>
          <div className="text-sm text-gray-600">Total Requests</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">98.7%</div>
          <div className="text-sm text-gray-600">Success Rate</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">245ms</div>
          <div className="text-sm text-gray-600">Avg Response</div>
        </div>
      </div>
    </div>
  );
}
