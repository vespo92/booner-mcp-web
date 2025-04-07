'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Card from '@/components/Card';

export default function SettingsPage() {
  // API Configuration
  const [apiUrl, setApiUrl] = useState<string>(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');
  
  // LLM Configuration
  const [ollamaUrl, setOllamaUrl] = useState<string>('http://10.0.0.10:11434');
  const [defaultModel, setDefaultModel] = useState<string>('llama3');
  
  // Deployment Targets
  const [deploymentTargets, setDeploymentTargets] = useState<string[]>([
    '192.168.1.101',
    '192.168.1.102',
    '192.168.1.103'
  ]);
  const [newTarget, setNewTarget] = useState<string>('');

  // Theme Settings
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Handle form submissions
  const handleApiConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save API configuration
    alert('API configuration saved');
  };

  const handleLlmConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save LLM configuration
    alert('LLM configuration saved');
  };

  const handleAddDeploymentTarget = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTarget && !deploymentTargets.includes(newTarget)) {
      setDeploymentTargets([...deploymentTargets, newTarget]);
      setNewTarget('');
    }
  };

  const handleRemoveDeploymentTarget = (target: string) => {
    setDeploymentTargets(deploymentTargets.filter(t => t !== target));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Apply dark mode to document
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <DashboardLayout title="Settings">
      <div className="grid grid-cols-1 gap-8">
        <Card title="API Configuration">
          <form onSubmit={handleApiConfigSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                API URL
              </label>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                URL of the Booner MCP API server
              </p>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Save API Configuration
              </button>
            </div>
          </form>
        </Card>

        <Card title="LLM Configuration">
          <form onSubmit={handleLlmConfigSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ollama URL
              </label>
              <input
                type="text"
                value={ollamaUrl}
                onChange={(e) => setOllamaUrl(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                URL of the Ollama API server
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Model
              </label>
              <select
                value={defaultModel}
                onChange={(e) => setDefaultModel(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="llama3">Llama 3</option>
                <option value="mixtral">Mixtral</option>
                <option value="mistral">Mistral</option>
                <option value="phi3">Phi-3</option>
              </select>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Default model to use for agents
              </p>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Save LLM Configuration
              </button>
            </div>
          </form>
        </Card>

        <Card title="Deployment Targets">
          <div className="mb-4">
            <form onSubmit={handleAddDeploymentTarget} className="flex space-x-2">
              <input
                type="text"
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
                placeholder="IP Address"
                className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Add
              </button>
            </form>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">IP Address</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {deploymentTargets.map((target) => (
                  <tr key={target}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{target}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <button
                        onClick={() => handleRemoveDeploymentTarget(target)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Theme Settings">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
            <div className="relative inline-block w-12 mr-2 align-middle select-none">
              <input
                type="checkbox"
                name="toggle"
                id="darkModeToggle"
                checked={darkMode}
                onChange={toggleDarkMode}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label
                htmlFor="darkModeToggle"
                className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                  darkMode ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
              ></label>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
