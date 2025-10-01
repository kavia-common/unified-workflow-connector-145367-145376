'use client';

import React, { useState, useEffect } from 'react';
import { Connector } from '@/types';
import { get, post } from '@/utils/api';
import toast from 'react-hot-toast';

interface CreateIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// PUBLIC_INTERFACE
export function CreateIntegrationModal({ isOpen, onClose, onSuccess }: CreateIntegrationModalProps) {
  /**
   * Modal component for creating new integrations between connected services
   */
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sourceConnector: '',
    targetConnector: '',
    triggerEvents: [] as string[],
    settings: {} as Record<string, unknown>,
  });

  useEffect(() => {
    if (isOpen) {
      loadConnectedServices();
    }
  }, [isOpen]);

  const loadConnectedServices = async () => {
    try {
      const response = await get<Connector[]>('/connectors');
      if (response.status === 'success') {
        // Filter only connected services
        const connected = (response.data || []).filter(c => c.status === 'connected');
        setConnectors(connected);
      } else {
        // Mock connected services for development
        setConnectors(mockConnectedServices);
      }
    } catch (error) {
      console.error('Failed to load connected services:', error);
      setConnectors(mockConnectedServices);
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const integrationData = {
        name: formData.name,
        description: formData.description,
        connectorIds: [formData.sourceConnector, formData.targetConnector],
        settings: {
          sourceConnector: formData.sourceConnector,
          targetConnector: formData.targetConnector,
          triggerEvents: formData.triggerEvents,
          ...formData.settings,
        },
      };

      const response = await post('/integrations', integrationData);
      
      if (response.status === 'success') {
        onSuccess();
        resetForm();
      } else {
        toast.error(response.message || 'Failed to create integration');
      }
    } catch (error) {
      console.error('Failed to create integration:', error);
      toast.error('Failed to create integration');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      name: '',
      description: '',
      sourceConnector: '',
      targetConnector: '',
      triggerEvents: [],
      settings: {},
    });
  };

  const getConnectorIcon = (connectorId: string) => {
    const icons: Record<string, string> = {
      jira: '🔧',
      confluence: '📄',
      github: '🐙',
      slack: '💬',
      linear: '📋',
      notion: '📝',
    };
    return icons[connectorId] || '🔗';
  };

  const availableEvents = {
    jira: ['issue_created', 'issue_updated', 'issue_resolved', 'comment_added'],
    confluence: ['page_created', 'page_updated', 'page_deleted'],
    github: ['push', 'pull_request', 'issue_opened', 'release'],
    slack: ['message_posted', 'reaction_added'],
    linear: ['issue_created', 'issue_updated', 'issue_completed'],
    notion: ['page_created', 'page_updated', 'database_updated'],
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Create New Integration</h2>
              <p className="text-sm text-gray-600 mt-1">Step {step} of 3</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-3 bg-gray-50">
            <div className="flex items-center gap-4">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      stepNum <= step
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div
                      className={`w-16 h-1 mx-2 ${
                        stepNum < step ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-96">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Integration Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Jira to Slack Notifications"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Describe what this integration does..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Select Connectors */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Source Service (Trigger) *
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {connectors.map((connector) => (
                      <label
                        key={connector.id}
                        className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                          formData.sourceConnector === connector.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="sourceConnector"
                          value={connector.id}
                          checked={formData.sourceConnector === connector.id}
                          onChange={(e) => setFormData({ ...formData, sourceConnector: e.target.value })}
                          className="sr-only"
                        />
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getConnectorIcon(connector.id)}</span>
                          <div>
                            <div className="font-medium text-gray-900">{connector.displayName}</div>
                            <div className="text-sm text-gray-600">{connector.description}</div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Target Service (Action) *
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {connectors.filter(c => c.id !== formData.sourceConnector).map((connector) => (
                      <label
                        key={connector.id}
                        className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                          formData.targetConnector === connector.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="targetConnector"
                          value={connector.id}
                          checked={formData.targetConnector === connector.id}
                          onChange={(e) => setFormData({ ...formData, targetConnector: e.target.value })}
                          className="sr-only"
                        />
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getConnectorIcon(connector.id)}</span>
                          <div>
                            <div className="font-medium text-gray-900">{connector.displayName}</div>
                            <div className="text-sm text-gray-600">{connector.description}</div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Configure Events */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Trigger Events *
                  </label>
                  <p className="text-sm text-gray-600 mb-4">
                    Select which events from {formData.sourceConnector} should trigger this integration.
                  </p>
                  <div className="space-y-2">
                    {(availableEvents[formData.sourceConnector as keyof typeof availableEvents] || []).map((event) => (
                      <label key={event} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.triggerEvents.includes(event)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                triggerEvents: [...formData.triggerEvents, event],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                triggerEvents: formData.triggerEvents.filter(e => e !== event),
                              });
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">
                          {event.replace(/_/g, ' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200">
            <div className="flex gap-3">
              {step > 1 && (
                <button
                  onClick={handlePrevious}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Previous
                </button>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              
              {step < 3 ? (
                <button
                  onClick={handleNext}
                  disabled={
                    (step === 1 && !formData.name) ||
                    (step === 2 && (!formData.sourceConnector || !formData.targetConnector))
                  }
                  className="btn-primary text-sm py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading || formData.triggerEvents.length === 0}
                  className="btn-primary text-sm py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Integration'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Mock data for development
const mockConnectedServices: Connector[] = [
  {
    id: 'jira',
    name: 'jira',
    displayName: 'Jira',
    description: 'Project management and issue tracking',
    icon: '🔧',
    category: 'productivity',
    status: 'connected',
    isOAuthSupported: true,
    requiredScopes: [],
    website: '',
    documentationUrl: '',
    supportedActions: [],
  },
  {
    id: 'slack',
    name: 'slack',
    displayName: 'Slack',
    description: 'Team communication platform',
    icon: '💬',
    category: 'communication',
    status: 'connected',
    isOAuthSupported: true,
    requiredScopes: [],
    website: '',
    documentationUrl: '',
    supportedActions: [],
  },
];
