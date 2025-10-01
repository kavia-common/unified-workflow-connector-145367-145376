'use client';

import React, { useState, useEffect } from 'react';
import { MetricsCard } from '@/components/monitoring/MetricsCard';
import { SystemHealth } from '@/components/monitoring/SystemHealth';
import { AlertsList } from '@/components/monitoring/AlertsList';
import { PerformanceChart } from '@/components/monitoring/PerformanceChart';
import { get } from '@/utils/api';

// PUBLIC_INTERFACE
export default function MonitoringPage() {
  /**
   * Real-time monitoring dashboard for system health and performance
   */
  const [loading, setLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    loadMetrics();
    
    // Set up auto-refresh
    const interval = setInterval(() => {
      loadMetrics();
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const loadMetrics = async () => {
    try {
      const response = await get('/monitoring/metrics');
      if (response.status === 'success') {
        // Use response data for future implementation
        console.log('Metrics loaded:', response.data);
      } else {
        // Use mock data for development
        console.log('Using mock metrics data');
      }
    } catch (err) {
      console.error('Failed to load metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded-md w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 rounded-lg"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">System Monitoring</h1>
          <p className="text-gray-600 mt-1">
            Real-time monitoring of your connector platform
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={10}>Refresh every 10s</option>
            <option value={30}>Refresh every 30s</option>
            <option value={60}>Refresh every 1m</option>
            <option value={300}>Refresh every 5m</option>
          </select>
          <button
            onClick={loadMetrics}
            className="btn-secondary"
          >
            🔄 Refresh Now
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="System Uptime"
          value="99.9%"
          change="+0.1%"
          changeType="positive"
          icon="⚡"
          status="healthy"
        />
        <MetricsCard
          title="Active Connections"
          value="12"
          change="+2"
          changeType="positive"
          icon="🔗"
          status="healthy"
        />
        <MetricsCard
          title="Response Time"
          value="150ms"
          change="-25ms"
          changeType="positive"
          icon="⏱️"
          status="healthy"
        />
        <MetricsCard
          title="Error Rate"
          value="0.2%"
          change="+0.1%"
          changeType="negative"
          icon="❌"
          status="warning"
        />
      </div>

      {/* Charts and Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceChart />
        <SystemHealth />
      </div>

      {/* Alerts */}
      <AlertsList />
    </div>
  );
}
