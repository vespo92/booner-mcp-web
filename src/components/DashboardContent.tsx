'use client';

import React, { useState, useEffect } from 'react';
import { useAgents, useSystemStatus } from '@/api/hooks';
import Card from '@/components/Card';
import StatsCard from '@/components/StatsCard';
import StatusBadge from '@/components/StatusBadge';
import Link from 'next/link';

// Define the Agent type
interface Agent {
  name: string;
  model: string;
  status: string;
}

// Define the OllamaModel type
interface OllamaModel {
  name: string;
  size: string;
  family: string;
  quantization: string;
  status: string;
}

export default function DashboardContent() {
  // Get agents data from hook with real-time updates
  const { agents, loading: agentsLoading, error: agentsError } = useAgents();
  
  // Get real-time system status (updates every 3 seconds)
  const { systemStatus, loading, error: systemError } = useSystemStatus(3000);
  
  // State for Ollama models
  const [ollamaModels, setOllamaModels] = useState<OllamaModel[]>([]);
  const [ollamaLoading, setOllamaLoading] = useState<boolean>(true);
  const [ollamaError, setOllamaError] = useState<string | null>(null);

  // Fetch Ollama models on component mount
  useEffect(() => {
    const fetchOllamaModels = async () => {
      try {
        setOllamaLoading(true);
        
        const ollamaUrl = process.env.NEXT_PUBLIC_OLLAMA_API_URL || 'http://10.0.0.10:11434';
        console.log('Fetching models from:', ollamaUrl);
        
        const response = await fetch(`${ollamaUrl}/api/tags`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch Ollama models: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Transform data into our format
        if (!data || !data.models || !Array.isArray(data.models)) {
          console.warn('Unexpected response format from Ollama:', data);
          // Return empty array to avoid errors
          setOllamaModels([]);
          return;
        }
        
        const models = data.models;
        const transformedModels = models.map((model: any) => {
          if (!model || typeof model !== 'object') {
            return {
              name: 'Unknown',
              size: 'Unknown',
              family: 'Unknown',
              quantization: 'Unknown',
              status: 'unknown'
            };
          }
          
          return {
          name: model.name || 'Unknown',
          size: model.size && typeof model.size === 'number' ? `${(model.size / (1024 * 1024 * 1024)).toFixed(1)} GB` : 'Unknown',
          family: model.family || 'Unknown',
          quantization: model.quantization || 'Unknown',
          status: 'active'
          };
        });
        
        setOllamaModels(transformedModels);
        setOllamaError(null);
      } catch (error) {
        console.error('Error fetching Ollama models:', error);
        setOllamaError(error instanceof Error ? error.message : 'Unknown error');
        
        // For demo purposes, set mock data if we can't connect
        setOllamaModels([
          {
            name: 'llama3:8b',
            size: '4.7 GB',
            family: 'llama',
            quantization: 'Q4_K_M',
            status: 'active'
          },
          {
            name: 'mixtral:8x7b',
            size: '12.2 GB',
            family: 'mixtral',
            quantization: 'Q4_0',
            status: 'active'
          }
        ]);
      } finally {
        setOllamaLoading(false);
      }
    };
    
    fetchOllamaModels();
    
    // Poll every 30 seconds
    const interval = setInterval(fetchOllamaModels, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard 
          title="Game Servers" 
          value="0" 
          icon={<svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
          </svg>} 
          link="/game-servers"
          linkText="Manage game servers"
        />
        <StatsCard 
          title="Web Applications" 
          value="0" 
          icon={<svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>} 
          link="/web-servers"
          linkText="Manage web applications"
        />
        <StatsCard 
          title="Active Tasks" 
          value="0" 
          icon={<svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>} 
          link="/tasks"
          linkText="View all tasks"
        />
      </div>

      {/* Ollama LLM Status Card */}
      <div className="mt-8">
        <Card title="Ollama LLM Status">
          {ollamaLoading ? (
            <div className="text-center py-8">
              <svg className="animate-spin h-8 w-8 mx-auto text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Loading Ollama LLM status...</p>
            </div>
          ) : ollamaError ? (
            <div className="text-center py-8 text-red-500 dark:text-red-400">
              <p>Error connecting to Ollama server: {ollamaError}</p>
              <p className="mt-2 text-sm">Check your connection to: {process.env.NEXT_PUBLIC_OLLAMA_API_URL || 'http://10.0.0.10:11434'}</p>
              <button 
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                onClick={() => window.location.reload()}
              >
                Retry Connection
              </button>
            </div>
          ) : ollamaModels.length === 0 ? (
            <div className="text-center py-8 text-yellow-500 dark:text-yellow-400">
              <p>No Ollama models found.</p>
              <Link 
                href="/settings"
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors inline-block"
              >
                Configure Ollama
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Model</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Family</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Size</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantization</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {ollamaModels.map((model, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{model.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{model.family}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{model.size}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{model.quantization}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <StatusBadge status={model.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Recent Tasks">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Task ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400" colSpan={4}>No tasks found</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right">
            <Link href="/tasks" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 text-sm font-medium">
              View all tasks →
            </Link>
          </div>
        </Card>

        <Card title="Agent Status">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Agent</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Model</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {agentsLoading ? (
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400" colSpan={3}>Loading agents...</td>
                  </tr>
                ) : agentsError ? (
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-red-500" colSpan={3}>Error loading agents: {agentsError}</td>
                  </tr>
                ) : agents && agents.length > 0 ? (
                  agents.map((agent: Agent) => (
                    <tr key={agent.name}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{agent.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{agent.model}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <StatusBadge status={agent.status} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Infrastructure Agent</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">mixtral</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <StatusBadge status="active" />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Game Server Agent</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">mixtral</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <StatusBadge status="active" />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Web Server Agent</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">mixtral</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <StatusBadge status="active" />
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <Card title="System Status">
          {loading ? (
            <div className="text-center py-8">
              <svg className="animate-spin h-8 w-8 mx-auto text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Loading system status...</p>
            </div>
          ) : systemStatus ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <h4 className="text-lg font-semibold mb-4">Main MCP Server</h4>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">CPU</p>
                      <p className="font-medium">{systemStatus.main_server.cpu}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">GPU</p>
                      <p className="font-medium">{systemStatus.main_server.gpu}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">RAM</p>
                      <p className="font-medium">{systemStatus.main_server.ram}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                      <StatusBadge status={systemStatus.main_server.status} />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Deployment Targets</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Host</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Load</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {systemStatus.deployment_targets.map((target, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{target.host}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            <StatusBadge status={target.status} />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                              <div 
                                className={`h-2.5 rounded-full ${target.load < 0.5 ? 'bg-green-500' : target.load < 0.8 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                                style={{ width: `${target.load * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs">{Math.round(target.load * 100)}%</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : systemError ? (
            <div className="text-center py-8 text-red-500 dark:text-red-400">
              <p>Error loading system status: {systemError}</p>
              <button 
                className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="text-center py-8 text-yellow-500 dark:text-yellow-400">
              <p>No system status data available.</p>
              <button 
                className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                onClick={() => window.location.reload()}
              >
                Check Again
              </button>
            </div>
          )}
        </Card>
      </div>

      <div className="mt-8 text-center">
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            href="/game-servers/deploy" 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Deploy Game Server
          </Link>
          <Link 
            href="/web-servers/deploy" 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Deploy Web App
          </Link>
          <Link 
            href="/infrastructure/task" 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Run Infrastructure Task
          </Link>
        </div>
      </div>
    </>
  );
}
