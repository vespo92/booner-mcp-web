'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Card from '@/components/Card';
import StatusBadge from '@/components/StatusBadge';

export default function Infrastructure() {
  const [taskDescription, setTaskDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [taskResult, setTaskResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!taskDescription.trim()) return;
    
    setIsLoading(true);
    setTaskResult(null);
    
    try {
      // Call API to run infrastructure task
      // const response = await api.runInfrastructureTask({ task: taskDescription });
      // setTaskResult(response.data);
      
      // For now, simulate a successful response after a delay
      setTimeout(() => {
        setTaskResult({
          task_id: 'mock-task-' + Date.now(),
          status: 'queued',
          message: 'Task queued for processing'
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to run infrastructure task:', error);
      setTaskResult({
        error: 'Failed to run infrastructure task'
      });
      setIsLoading(false);
    }
  };

  const deploymentTargets = [
    {
      host: '192.168.1.101',
      specs: 'Ryzen 5 3600, 32GB RAM',
      status: 'online',
      load: 25
    },
    {
      host: '192.168.1.102',
      specs: 'E5-2680 v4, 16GB RAM, RTX 3050',
      status: 'online',
      load: 15
    },
    {
      host: '192.168.1.103',
      specs: 'Ryzen 7 5700X3D, 32GB RAM',
      status: 'online',
      load: 35
    }
  ];

  return (
    <DashboardLayout title="Infrastructure">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Infrastructure Management</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Run infrastructure tasks and manage your deployment targets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Run Infrastructure Task">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="task-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Task Description
              </label>
              <textarea
                id="task-description"
                rows={5}
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Describe the infrastructure task you want to perform..."
                required
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Provide a clear description of what you want to do. For example: "Set up a database server" or "Configure a load balancer for web servers".
              </p>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Run Task'}
              </button>
            </div>
          </form>

          {taskResult && (
            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
              <h4 className="text-lg font-semibold mb-2">Task Result</h4>
              {taskResult.error ? (
                <div className="text-red-600 dark:text-red-400">{taskResult.error}</div>
              ) : (
                <div>
                  <p><span className="font-medium">Task ID:</span> {taskResult.task_id}</p>
                  <p><span className="font-medium">Status:</span> <StatusBadge status={taskResult.status} /></p>
                  <p><span className="font-medium">Message:</span> {taskResult.message}</p>
                  <div className="mt-2">
                    <a href={`/tasks/${taskResult.task_id}`} className="text-indigo-600 dark:text-indigo-400 hover:underline">
                      View task details →
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>

        <div>
          <Card title="System Status">
            <div className="mb-4">
              <h4 className="text-lg font-semibold mb-2">Main MCP Server</h4>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">CPU</p>
                    <p className="font-medium">AMD 5700X3D</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">GPU</p>
                    <p className="font-medium">4070 Ti Super, Quadro P4000</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">RAM</p>
                    <p className="font-medium">64GB</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <StatusBadge status="online" />
                  </div>
                </div>
              </div>
            </div>

            <h4 className="text-lg font-semibold mb-2">Deployment Targets</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Host</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Specs</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Load</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {deploymentTargets.map((target, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{target.host}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{target.specs}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <StatusBadge status={target.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${target.load}%` }}
                          ></div>
                        </div>
                        <span className="text-xs mt-1">{target.load}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <Card title="Recent Infrastructure Changes">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Change</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400" colSpan={3}>
                    No recent infrastructure changes
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
