'use client';

import React, { useState } from 'react';

// PUBLIC_INTERFACE
export function QuickActions() {
  /**
   * Quick actions component for common dashboard tasks
   */
  const [showMenu, setShowMenu] = useState(false);

  const quickActions = [
    { name: 'Connect New Connector', icon: '🔗', href: '/connectors' },
    { name: 'Create Workflow', icon: '🔄', href: '/workflows/new' },
    { name: 'View Analytics', icon: '📊', href: '/analytics' },
    { name: 'Check Integrations', icon: '⚡', href: '/integrations' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="btn-secondary flex items-center gap-2"
      >
        <span>⚡</span>
        Quick Actions
        <span className="text-sm">▼</span>
      </button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            {quickActions.map((action) => (
              <a
                key={action.name}
                href={action.href}
                className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setShowMenu(false)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{action.icon}</span>
                  <span className="font-medium">{action.name}</span>
                </div>
              </a>
            ))}
            
            <div className="border-t border-gray-100 mt-1 pt-1">
              <a
                href="/help"
                className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setShowMenu(false)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">❓</span>
                  <span className="font-medium">Get Help</span>
                </div>
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
