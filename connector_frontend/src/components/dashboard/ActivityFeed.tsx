'use client';

import React from 'react';
import { ActivityItem } from '@/types';

interface ActivityFeedProps {
  activities: ActivityItem[];
}

// PUBLIC_INTERFACE
export function ActivityFeed({ activities }: ActivityFeedProps) {
  /**
   * Activity feed component displaying recent system activity
   */
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'connection': return '🔗';
      case 'workflow': return '🔄';
      case 'integration': return '⚡';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  const getActivityColor = (status: ActivityItem['status']) => {
    switch (status) {
      case 'success': return 'bg-green-100 border-green-300';
      case 'warning': return 'bg-yellow-100 border-yellow-300';
      case 'error': return 'bg-red-100 border-red-300';
      default: return 'bg-blue-100 border-blue-300';
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700">View All</button>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <span className="text-4xl block mb-2">📋</span>
          <p className="text-sm">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center ${getActivityColor(activity.status)}`}>
                <span className="text-sm">{getActivityIcon(activity.type)}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </h4>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {formatTime(activity.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                
                {activity.connectorId && (
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-xs text-gray-500">Via</span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {activity.connectorId}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
