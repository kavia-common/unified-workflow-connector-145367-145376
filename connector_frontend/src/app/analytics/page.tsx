'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AnalyticsChart } from '@/components/analytics/AnalyticsChart';
import { UsageStats } from '@/components/analytics/UsageStats';
import { ConnectorUsage } from '@/components/analytics/ConnectorUsage';
import { TimeRangeSelector } from '@/components/analytics/TimeRangeSelector';
import { get } from '@/utils/api';

// PUBLIC_INTERFACE
export default function AnalyticsPage() {
  /**
   * Analytics dashboard for detailed system insights and metrics
   */
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await get(`/analytics?range=${timeRange}`);
      if (response.status === 'success') {
        // Use response data for future implementation
        console.log('Analytics data loaded:', response.data);
      } else {
        // Use mock data for development
        console.log('Using mock analytics data');
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded-md w-1/3 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded-md mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-gray-200 rounded-lg"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">
            Detailed insights into your connector platform usage and performance
          </p>
        </div>
        <TimeRangeSelector
          value={timeRange}
          onChange={setTimeRange}
        />
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          <AnalyticsChart timeRange={timeRange} />
          <UsageStats timeRange={timeRange} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <ConnectorUsage timeRange={timeRange} />
        </div>
      </div>
    </div>
  );
}
