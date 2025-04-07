'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Card from '@/components/Card';
import StatusBadge from '@/components/StatusBadge';
import Link from 'next/link';

export default function WebServers() {
  const [webApps, setWebApps] = useState([]);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isConfigureNginxModalOpen, setIsConfigureNginxModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  
  // Form state for deploying a new web app
  const [formData, setFormData] = useState({
    appType: '',
    appName: '',
    repoUrl: '',
    targetHost: '',
    envVars: ''
  });

  // Form state for configuring Nginx
  const [nginxFormData, setNginxFormData] = useState({
    domainName: '',
    enableSsl: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNginxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNginxFormData({
      ...nginxFormData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleDeploySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse environment variables if provided
    let envVars = null;
    if (formData.envVars) {
      try {
        envVars = JSON.parse(formData.envVars);
      } catch (error) {
        alert('Invalid JSON in environment variables');
        return;
      }
    }
    
    const data = {
      app_type: formData.appType,
      app_name: formData.appName,
      repo_url: formData.repoUrl,
      target_host: formData.targetHost || undefined,
      env_vars: envVars
    };
    
    try {
      // Call API to deploy web app
      // const response = await api.deployWebApp(data);
      // if (response.data && response.data.task_id) {
      //   alert(`Deployment task started. Task ID: ${response.data.task_id}`);
      //   setIsDeployModalOpen(false);
      //   // Ideally, refresh the list of web apps or show a pending status
      // }
      
      // For now, just close the modal
      setIsDeployModalOpen(false);
    } catch (error) {
      console.error('Failed to deploy web application:', error);
      alert('Failed to deploy web application. Check console for details.');
    }
  };

  const handleNginxSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedApp) return;
    
    const data = {
      app_type: selectedApp.appType,
      app_name: selectedApp.appName,
      target_host: selectedApp.targetHost,
      domain_name: nginxFormData.domainName,
      enable_ssl: nginxFormData.enableSsl
    };
    
    try {
      // Call API to configure Nginx
      // const response = await api.configureNginx(data);
      // if (response.data && response.data.task_id) {
      //   alert(`Nginx configuration task started. Task ID: ${response.data.task_id}`);
      //   setIsConfigureNginxModalOpen(false);
      // }
      
      // For now, just close the modal
      setIsConfigureNginxModalOpen(false);
    } catch (error) {
      console.error('Failed to configure Nginx:', error);
      alert('Failed to configure Nginx. Check console for details.');
    }
  };

  const openNginxModal = (app: any) => {
    setSelectedApp(app);
    setNginxFormData({
      domainName: `${app.appName}.example.com`,
      enableSsl: true
    });
    setIsConfigureNginxModalOpen(true);
  };

  return (
    <DashboardLayout title="Web Applications">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Web Applications</h2>
        <button
          onClick={() => setIsDeployModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Deploy New Application
        </button>
      </div>

      <Card title="Active Web Applications">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Application Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Host</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {webApps.length > 0 ? (
                webApps.map((app: any) => (
                  <tr key={app.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{app.appName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{app.appType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{app.host}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => openNginxModal(app)}
                        >
                          Configure Nginx
                        </button>
                        <button className="text-indigo-600 hover:text-indigo-900">Update</button>
                        <button className="text-red-600 hover:text-red-900">Stop</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400" colSpan={5}>
                    No web applications found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Deploy Web App Modal */}
      {isDeployModalOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Deploy Web Application</h3>
              <button
                onClick={() => setIsDeployModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleDeploySubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="appType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Application Type
                  </label>
                  <select
                    id="appType"
                    name="appType"
                    value={formData.appType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600"
                    required
                  >
                    <option value="">Select an application type</option>
                    <option value="nextjs">NextJS</option>
                    <option value="express">Express</option>
                    <option value="django">Django</option>
                    <option value="flask">Flask</option>
                    <option value="static">Static</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="appName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Application Name
                  </label>
                  <input
                    type="text"
                    id="appName"
                    name="appName"
                    value={formData.appName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="repoUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Git Repository URL
                  </label>
                  <input
                    type="text"
                    id="repoUrl"
                    name="repoUrl"
                    value={formData.repoUrl}
                    onChange={handleInputChange}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="https://github.com/username/repo.git"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="targetHost" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Target Host
                  </label>
                  <select
                    id="targetHost"
                    name="targetHost"
                    value={formData.targetHost}
                    onChange={handleInputChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="">Use default from config</option>
                    <option value="192.168.1.101">Ryzen 5 3600 (192.168.1.101)</option>
                    <option value="192.168.1.102">E5-2680 v4 (192.168.1.102)</option>
                    <option value="192.168.1.103">Ryzen 7 5700X3D (192.168.1.103)</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="envVars" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Environment Variables (JSON)
                  </label>
                  <textarea
                    id="envVars"
                    name="envVars"
                    value={formData.envVars}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder='{"NODE_ENV": "production", "PORT": "3000"}'
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsDeployModalOpen(false)}
                  className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Deploy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Configure Nginx Modal */}
      {isConfigureNginxModalOpen && selectedApp && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Configure Nginx for {selectedApp.appName}</h3>
              <button
                onClick={() => setIsConfigureNginxModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleNginxSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="domainName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Domain Name
                  </label>
                  <input
                    type="text"
                    id="domainName"
                    name="domainName"
                    value={nginxFormData.domainName}
                    onChange={handleNginxInputChange}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="enableSsl"
                      name="enableSsl"
                      type="checkbox"
                      checked={nginxFormData.enableSsl}
                      onChange={handleNginxInputChange}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="enableSsl" className="font-medium text-gray-700 dark:text-gray-300">
                      Enable SSL with Let's Encrypt
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">This will automatically generate and configure SSL certificates for your domain.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsConfigureNginxModalOpen(false)}
                  className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Configure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
