'use client';

import React from 'react';

interface StatusCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: string;
}

// PUBLIC_INTERFACE
export function StatusCard({ title, value, change, changeType = 'neutral', icon }: StatusCardProps) {
  /**
   * Status card component for displaying key metrics
   */
  const getChangeColor = (type: typeof changeType) => {
    switch (type) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getChangeIcon = (type: typeof changeType) => {
    switch (type) {
      case 'positive': return '↗️';
      case 'negative': return '↘️';
      default: return '➡️';
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${getChangeColor(changeType)}`}>
                {getChangeIcon(changeType)} {change}
              </span>
              <span className="text-sm text-gray-500 ml-2">vs last period</span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-2xl">
          {icon}
        </div>
      </div>
    </div>
  );
}
