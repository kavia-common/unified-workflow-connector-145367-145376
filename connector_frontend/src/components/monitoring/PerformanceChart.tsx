'use client';

import React from 'react';

// PUBLIC_INTERFACE
export function PerformanceChart() {
  /**
   * Performance chart component showing system metrics over time
   */
  const mockData = [
    { time: '00:00', responseTime: 120, requests: 45 },
    { time: '04:00', responseTime: 110, requests: 32 },
    { time: '08:00', responseTime: 180, requests: 78 },
    { time: '12:00', responseTime: 150, requests: 92 },
    { time: '16:00', responseTime: 140, requests: 65 },
    { time: '20:00', responseTime: 160, requests: 48 },
  ];

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Response Time</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Requests</span>
          </div>
        </div>
      </div>
      
      {/* Simple chart representation */}
      <div className="h-64 bg-gray-50 rounded-lg flex items-end justify-between p-4">
        {mockData.map((point, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-4 bg-blue-500 rounded-t"
                style={{ height: `${(point.responseTime / 200) * 120}px` }}
              ></div>
              <div
                className="w-4 bg-green-500 rounded-t"
                style={{ height: `${(point.requests / 100) * 80}px` }}
              ></div>
            </div>
            <span className="text-xs text-gray-500">{point.time}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">156ms</div>
          <div className="text-sm text-gray-600">Avg Response Time</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">1.2k</div>
          <div className="text-sm text-gray-600">Total Requests</div>
        </div>
      </div>
    </div>
  );
}
