'use client';

import React, { useState } from 'react';

// PUBLIC_INTERFACE
export default function HelpPage() {
  /**
   * Help and documentation page for user support
   */
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('getting-started');

  const helpCategories = [
    { id: 'getting-started', name: 'Getting Started', icon: '🚀' },
    { id: 'connectors', name: 'Connectors', icon: '🔗' },
    { id: 'integrations', name: 'Integrations', icon: '⚡' },
    { id: 'workflows', name: 'Workflows', icon: '🔄' },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: '🔧' },
    { id: 'api', name: 'API Reference', icon: '📚' },
  ];

  const helpArticles = {
    'getting-started': [
      { title: 'Welcome to Connector Platform', content: 'Learn the basics of using the connector platform.' },
      { title: 'Setting Up Your First Integration', content: 'Step-by-step guide to create your first integration.' },
      { title: 'Understanding the Dashboard', content: 'Overview of dashboard features and metrics.' },
    ],
    'connectors': [
      { title: 'Connecting to Jira', content: 'How to set up and configure Jira connections.' },
      { title: 'Slack Integration Guide', content: 'Complete guide for Slack connector setup.' },
      { title: 'GitHub Connector Setup', content: 'Steps to connect and use GitHub integration.' },
    ],
    'integrations': [
      { title: 'Creating Custom Integrations', content: 'Build integrations between your tools.' },
      { title: 'Managing Integration Settings', content: 'Configure and customize your integrations.' },
      { title: 'Integration Best Practices', content: 'Tips for effective integration management.' },
    ],
    'workflows': [
      { title: 'Building Your First Workflow', content: 'Create automated workflows between services.' },
      { title: 'Workflow Templates', content: 'Use pre-built templates for common use cases.' },
      { title: 'Advanced Workflow Features', content: 'Complex workflow configurations and triggers.' },
    ],
    'troubleshooting': [
      { title: 'Common Connection Issues', content: 'Resolve typical connector problems.' },
      { title: 'Authentication Problems', content: 'Fix OAuth and API key authentication issues.' },
      { title: 'Performance Optimization', content: 'Improve system performance and reliability.' },
    ],
    'api': [
      { title: 'API Authentication', content: 'How to authenticate with the platform API.' },
      { title: 'Connector API Reference', content: 'Complete API documentation for connectors.' },
      { title: 'Webhook Configuration', content: 'Set up webhooks for real-time updates.' },
    ],
  };

  const filteredArticles = helpArticles[activeCategory as keyof typeof helpArticles]?.filter(
    article => 
      searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Help & Documentation</h1>
        <p className="text-gray-600 mt-2">
          Find answers to your questions and learn how to use the connector platform
        </p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">🔍</span>
          </div>
          <input
            type="text"
            placeholder="Search help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories */}
        <div className="lg:col-span-1">
          <div className="card p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
            <nav className="space-y-1">
              {helpCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left ${
                    activeCategory === category.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Articles */}
        <div className="lg:col-span-3">
          <div className="space-y-4">
            {filteredArticles.length === 0 ? (
              <div className="card p-8 text-center">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery ? 'No articles found' : 'No articles in this category'}
                </h3>
                <p className="text-gray-600">
                  {searchQuery 
                    ? 'Try adjusting your search terms or browse other categories.'
                    : 'Articles for this category will be added soon.'}
                </p>
              </div>
            ) : (
              filteredArticles.map((article, index) => (
                <div key={index} className="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{article.content}</p>
                  <div className="flex items-center gap-4 text-sm text-blue-600">
                    <span>Read more →</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="mailto:support@connector-platform.com"
            className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <span className="text-2xl">📧</span>
            <div>
              <div className="font-medium text-gray-900">Contact Support</div>
              <div className="text-sm text-gray-600">Get help from our team</div>
            </div>
          </a>
          
          <a
            href="#"
            className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <span className="text-2xl">💬</span>
            <div>
              <div className="font-medium text-gray-900">Community Forum</div>
              <div className="text-sm text-gray-600">Join the discussion</div>
            </div>
          </a>
          
          <a
            href="#"
            className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <span className="text-2xl">📹</span>
            <div>
              <div className="font-medium text-gray-900">Video Tutorials</div>
              <div className="text-sm text-gray-600">Watch step-by-step guides</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
