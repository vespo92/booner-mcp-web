'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Card from '@/components/Card';
import StatusBadge from '@/components/StatusBadge';
import Link from 'next/link';

export default function GameServers() {
  const [servers, setServers] = useState([]);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  
  // Form state for deploying a new game server
  const [formData, setFormData] = useState({
    game: '',
    serverName: '',
    targetHost: '',
    customConfig: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse custom config if provided
    let customConfig = null;
    if (formData.customConfig) {
      try {
        customConfig = JSON.parse(formData.customConfig);
      } catch (error) {
        alert('Invalid JSON in custom configuration');
        return;
      }
    }
    
    const data = {
      game: formData.game,
      server_name: formData.serverName,
      target_host: formData.targetHost || undefined,
      custom_config: customConfig
    };
    
    try {
      // Call API to deploy game server
      // const response = await api.deployGameServer(data);
      // if (response.data && response.data.task_id) {
      //   alert(`Deployment task started. Task ID: ${response.data.task_id}`);
      //   setIsDeployModalOpen(false);
      //   // Ideally, refresh the list of servers or show a pending status
      // }
      
      // For now, just close the modal
      setIsDeployModalOpen(false);
    } catch (error) {
      console.error('Failed to deploy game server:', error);
      alert('Failed to deploy game server. Check console for details.');
    }
  };

  return (
    <DashboardLayout title="Game Servers">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Game Servers</h2>
        <button
          onClick={() => setIsDeployModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Deploy New Server
        </button>
      </div>

      <Card title="Active Game Servers">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Server Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Game</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Host</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {servers.length > 0 ? (
                servers.map((server: any) => (
                  <tr key={server.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{server.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{server.game}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{server.host}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <StatusBadge status={server.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-900">Start</button>
                        <button className="text-red-600 hover:text-red-900">Stop</button>
                        <button className="text-green-600 hover:text-green-900">Backup</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400" colSpan={5}>
                    No game servers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Deploy Game Server Modal */}
      {isDeployModalOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Deploy Game Server</h3>
              <button
                onClick={() => setIsDeployModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="game" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Game Type
                  </label>
                  <select
                    id="game"
                    name="game"
                    value={formData.game}
                    onChange={handleInputChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600"
                    required
                  >
                    <option value="">Select a game</option>
                    <option value="cs2">Counter-Strike 2</option>
                    <option value="minecraft">Minecraft</option>
                    <option value="killingfloor2">Killing Floor 2</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="serverName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Server Name
                  </label>
                  <input
                    type="text"
                    id="serverName"
                    name="serverName"
                    value={formData.serverName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                  <label htmlFor="customConfig" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Custom Configuration (JSON)
                  </label>
                  <textarea
                    id="customConfig"
                    name="customConfig"
                    value={formData.customConfig}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder='{"recommended_ram": 8192}'
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
    </DashboardLayout>
  );
}
