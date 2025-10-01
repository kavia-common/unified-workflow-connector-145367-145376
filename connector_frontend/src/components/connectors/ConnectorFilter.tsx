'use client';

import React from 'react';

interface ConnectorFilterProps {
  filters: {
    category: string;
    status: string;
    search: string;
  };
  onFiltersChange: (filters: { category: string; status: string; search: string }) => void;
  totalCount: number;
  filteredCount: number;
}

// PUBLIC_INTERFACE
export function ConnectorFilter({ filters, onFiltersChange, totalCount, filteredCount }: ConnectorFilterProps) {
  /**
   * Filter component for connectors page with category, status, and search filters
   */
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'productivity', label: 'Productivity' },
    { value: 'development', label: 'Development' },
    { value: 'communication', label: 'Communication' },
    { value: 'analytics', label: 'Analytics' },
  ];

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'connected', label: 'Connected' },
    { value: 'disconnected', label: 'Not Connected' },
    { value: 'pending', label: 'Connecting' },
    { value: 'error', label: 'Error' },
  ];

  const updateFilter = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      category: 'all',
      status: 'all',
      search: '',
    });
  };

  const hasActiveFilters = filters.category !== 'all' || filters.status !== 'all' || filters.search !== '';

  return (
    <div className="card p-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
            <input
              type="text"
              placeholder="Search connectors..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Results info and clear filters */}
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Showing {filteredCount} of {totalCount} connectors
          </div>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">Active filters:</span>
            
            {filters.search && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                Search: &quot;{filters.search}&quot;
                <button
                  onClick={() => updateFilter('search', '')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ✕
                </button>
              </span>
            )}
            
            {filters.category !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                Category: {categories.find(c => c.value === filters.category)?.label}
                <button
                  onClick={() => updateFilter('category', 'all')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ✕
                </button>
              </span>
            )}
            
            {filters.status !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                Status: {statuses.find(s => s.value === filters.status)?.label}
                <button
                  onClick={() => updateFilter('status', 'all')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ✕
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
