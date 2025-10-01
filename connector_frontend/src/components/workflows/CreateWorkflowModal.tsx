'use client';

import React, { useState } from 'react';
import { post } from '@/utils/api';
import toast from 'react-hot-toast';

interface CreateWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// PUBLIC_INTERFACE
export function CreateWorkflowModal({ isOpen, onClose, onSuccess }: CreateWorkflowModalProps) {
  /**
   * Modal component for creating new workflows
   */
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    template: '',
  });

  const workflowTemplates = [
    {
      id: 'blank',
      name: 'Blank Workflow',
      description: 'Start from scratch with an empty workflow',
      icon: '📋',
    },
    {
      id: 'jira-slack',
      name: 'Jira to Slack',
      description: 'Send Slack notifications when Jira issues are updated',
      icon: '🔧💬',
    },
    {
      id: 'github-linear',
      name: 'GitHub to Linear',
      description: 'Create Linear issues from GitHub issues',
      icon: '🐙📋',
    },
    {
      id: 'confluence-github',
      name: 'Confluence to GitHub',
      description: 'Sync documentation from Confluence to GitHub wiki',
      icon: '📄🐙',
    },
  ];

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error('Please enter a workflow name');
      return;
    }

    try {
      setLoading(true);
      
      const workflowData = {
        name: formData.name,
        description: formData.description,
        template: formData.template,
        status: 'draft',
      };

      const response = await post('/workflows', workflowData);
      
      if (response.status === 'success') {
        onSuccess();
        resetForm();
      } else {
        toast.error(response.message || 'Failed to create workflow');
      }
    } catch (error) {
      console.error('Failed to create workflow:', error);
      toast.error('Failed to create workflow');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      template: '',
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={handleClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Create New Workflow</h2>
              <p className="text-sm text-gray-600 mt-1">
                Automate tasks between your connected services
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workflow Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Jira Issue Notifications"
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
                  placeholder="Describe what this workflow does..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Template Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choose a Template
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {workflowTemplates.map((template) => (
                  <label
                    key={template.id}
                    className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.template === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="template"
                      value={template.id}
                      checked={formData.template === template.id}
                      onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{template.icon}</span>
                        <div className="font-medium text-gray-900">{template.name}</div>
                      </div>
                      <div className="text-sm text-gray-600">{template.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Template Info */}
            {formData.template && formData.template !== 'blank' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Template Features</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Pre-configured triggers and actions</li>
                  <li>• Optimized for common use cases</li>
                  <li>• Easy to customize after creation</li>
                  <li>• Includes example configurations</li>
                </ul>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              {formData.template === 'blank' ? (
                'You can add steps and configure triggers after creation.'
              ) : (
                'Template will be applied and you can modify it as needed.'
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !formData.name.trim()}
                className="btn-primary text-sm py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Workflow'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
