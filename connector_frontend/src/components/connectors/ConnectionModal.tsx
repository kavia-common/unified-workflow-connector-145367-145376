'use client';

import React, { useState } from 'react';
import { Connector } from '@/types';
import { post } from '@/utils/api';
import toast from 'react-hot-toast';

interface ConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  connector: Connector;
  onSuccess: () => void;
}

// PUBLIC_INTERFACE
export function ConnectionModal({ isOpen, onClose, connector, onSuccess }: ConnectionModalProps) {
  /**
   * Modal component for setting up connector connections via OAuth or API keys
   */
  const [loading, setLoading] = useState(false);
  const [connectionMethod, setConnectionMethod] = useState<'oauth' | 'apikey'>('oauth');
  const [apiKeyData, setApiKeyData] = useState({
    apiKey: '',
    siteUrl: '',
    username: '',
  });

  if (!isOpen) return null;

  const handleOAuthConnect = async () => {
    try {
      setLoading(true);
      
      // Get OAuth authorization URL
      const response = await post(`/connectors/${connector.id}/oauth/login`, {
        return_url: window.location.origin + '/connectors'
      });

      if (response.status === 'success' && response.data && typeof response.data === 'object' && 'authorization_url' in response.data) {
        // Redirect to OAuth provider
        window.location.href = (response.data as { authorization_url: string }).authorization_url;
      } else {
        toast.error('Failed to initiate OAuth connection');
      }
    } catch (error) {
      console.error('OAuth connection failed:', error);
      toast.error('Failed to connect via OAuth');
    } finally {
      setLoading(false);
    }
  };

  const handleApiKeyConnect = async () => {
    try {
      setLoading(true);
      
      const response = await post(`/connectors/${connector.id}/connect`, {
        method: 'apikey',
        credentials: apiKeyData,
      });

      if (response.status === 'success') {
        toast.success('Connected successfully!');
        onSuccess();
      } else {
        toast.error(response.message || 'Failed to connect');
      }
    } catch (error) {
      console.error('API key connection failed:', error);
      toast.error('Failed to connect with API key');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (connectionMethod === 'oauth') {
      handleOAuthConnect();
    } else {
      handleApiKeyConnect();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-xl">
                {connector.icon}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Connect {connector.displayName}
                </h2>
                <p className="text-sm text-gray-600">{connector.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Connection Method Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Connection Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setConnectionMethod('oauth')}
                  className={`p-3 border-2 rounded-lg text-sm font-medium transition-colors ${
                    connectionMethod === 'oauth'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                  disabled={!connector.isOAuthSupported}
                >
                  <div className="text-center">
                    <div className="text-lg mb-1">🔐</div>
                    <div>OAuth</div>
                    <div className="text-xs text-gray-500 mt-1">Recommended</div>
                  </div>
                </button>
                
                <button
                  onClick={() => setConnectionMethod('apikey')}
                  className={`p-3 border-2 rounded-lg text-sm font-medium transition-colors ${
                    connectionMethod === 'apikey'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg mb-1">🔑</div>
                    <div>API Key</div>
                    <div className="text-xs text-gray-500 mt-1">Manual</div>
                  </div>
                </button>
              </div>
            </div>

            {/* OAuth Instructions */}
            {connectionMethod === 'oauth' && (
              <div className="mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">OAuth Connection</h4>
                  <p className="text-sm text-blue-800 mb-3">
                    You&apos;ll be redirected to {connector.displayName} to authorize the connection.
                  </p>
                  <div className="text-xs text-blue-700">
                    <strong>Required Scopes:</strong>
                    <ul className="mt-1 ml-4 list-disc">
                      {connector.requiredScopes.map((scope) => (
                        <li key={scope}>{scope}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* API Key Form */}
            {connectionMethod === 'apikey' && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://your-domain.atlassian.net"
                    value={apiKeyData.siteUrl}
                    onChange={(e) => setApiKeyData({...apiKeyData, siteUrl: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username/Email
                  </label>
                  <input
                    type="email"
                    placeholder="your-email@company.com"
                    value={apiKeyData.username}
                    onChange={(e) => setApiKeyData({...apiKeyData, username: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Token
                  </label>
                  <input
                    type="password"
                    placeholder="Your API token"
                    value={apiKeyData.apiKey}
                    onChange={(e) => setApiKeyData({...apiKeyData, apiKey: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You can generate an API token in your {connector.displayName} account settings.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200">
            <a
              href={connector.documentationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              📚 View Documentation
            </a>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || (connectionMethod === 'apikey' && (!apiKeyData.apiKey || !apiKeyData.siteUrl))}
                className="btn-primary text-sm py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Connecting...' : `Connect via ${connectionMethod === 'oauth' ? 'OAuth' : 'API Key'}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
