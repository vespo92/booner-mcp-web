import { useState, useEffect } from 'react';
import { api } from './client';
import {
  Task,
  TaskResponse,
  GameServerDeployRequest,
  WebAppDeployRequest,
  InfrastructureTaskRequest,
  SystemStatus
} from './types';

// Hook for fetching agents
export const useAgents = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        const response = await api.getAgents();
        setAgents(response.data.agents);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch agents');
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  return { agents, loading, error };
};

// Hook for fetching tasks
export const useTasks = () => {
  const [tasks, setTasks] = useState<Record<string, Task>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await api.getTasks();
        setTasks(response.data.tasks);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
    
    // Poll for task updates every 5 seconds
    const interval = setInterval(fetchTasks, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return { tasks, loading, error };
};

// Hook for fetching a specific task
export const useTaskStatus = (taskId: string) => {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      if (!taskId) return;
      
      try {
        setLoading(true);
        const response = await api.getTaskStatus(taskId);
        setTask(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch task status');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
    
    // Poll for task updates every 2 seconds if task is not completed or failed
    const interval = setInterval(() => {
      if (task && (task.status === 'completed' || task.status === 'failed')) {
        clearInterval(interval);
      } else {
        fetchTask();
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [taskId, task?.status]);

  return { task, loading, error };
};

// Hook for deploying a game server
export const useDeployGameServer = () => {
  const [response, setResponse] = useState<TaskResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deployGameServer = async (data: GameServerDeployRequest) => {
    try {
      setLoading(true);
      const result = await api.deployGameServer(data);
      setResponse(result.data);
      setError(null);
      return result.data;
    } catch (err: any) {
      setError(err.message || 'Failed to deploy game server');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deployGameServer, response, loading, error };
};

// Hook for deploying a web application
export const useDeployWebApp = () => {
  const [response, setResponse] = useState<TaskResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deployWebApp = async (data: WebAppDeployRequest) => {
    try {
      setLoading(true);
      const result = await api.deployWebApp(data);
      setResponse(result.data);
      setError(null);
      return result.data;
    } catch (err: any) {
      setError(err.message || 'Failed to deploy web application');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deployWebApp, response, loading, error };
};

// Hook for running an infrastructure task
export const useRunInfrastructureTask = () => {
  const [response, setResponse] = useState<TaskResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const runInfrastructureTask = async (data: InfrastructureTaskRequest) => {
    try {
      setLoading(true);
      const result = await api.runInfrastructureTask(data);
      setResponse(result.data);
      setError(null);
      return result.data;
    } catch (err: any) {
      setError(err.message || 'Failed to run infrastructure task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { runInfrastructureTask, response, loading, error };
};

// Hook for fetching system status with real-time updates
export const useSystemStatus = (pollingInterval = 5000) => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [useWebSocket, setUseWebSocket] = useState<boolean>(true);

  // Function to fetch data via REST API (fallback)
  const fetchViaREST = async () => {
    try {
      setLoading(true);
      const response = await api.getSystemStatus();
      setSystemStatus(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch system status');
      console.error('REST API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Setup WebSocket connection for real-time updates
  useEffect(() => {
    if (!useWebSocket) return;

    // Get WebSocket URL from API URL and convert to WebSocket URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://10.0.0.4:8000';
    const wsUrl = apiUrl.replace('http://', 'ws://').replace('https://', 'wss://') + '/ws';
    
    try {
      const newSocket = new WebSocket(`${wsUrl}/system/status`);
      
      newSocket.onopen = () => {
        console.log('WebSocket connection established for system status');
        setError(null);
      };
      
      // Try to reconnect if connection fails
      let reconnectAttempts = 0;
      const maxReconnectAttempts = 3;
      
      const attemptReconnect = () => {
        if (reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts++;
          console.log(`Attempting to reconnect WebSocket (${reconnectAttempts}/${maxReconnectAttempts})...`);
          setTimeout(() => {
            try {
              const reconnectSocket = new WebSocket(`${wsUrl}/system/status`);
              setSocket(reconnectSocket);
              // Copy all handlers to new socket
              reconnectSocket.onopen = newSocket.onopen;
              reconnectSocket.onmessage = newSocket.onmessage;
              reconnectSocket.onerror = newSocket.onerror;
              reconnectSocket.onclose = newSocket.onclose;
            } catch (err) {
              console.error('Failed to reconnect WebSocket:', err);
              attemptReconnect();
            }
          }, 3000);
        } else {
          console.log('Max reconnect attempts reached, falling back to REST API');
          setUseWebSocket(false);
        }
      };

      
      newSocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setSystemStatus(data);
          setLoading(false);
          setError(null);
        } catch (err: any) {
          console.error('Error parsing WebSocket data:', err);
        }
      };
      
      newSocket.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError('WebSocket connection error');
        attemptReconnect(); // Try to reconnect before falling back
      };
      
      newSocket.onclose = () => {
        console.log('WebSocket connection closed');
        setSocket(null);
      };
      
      setSocket(newSocket);
      
      // Cleanup function
      return () => {
        if (newSocket.readyState === WebSocket.OPEN) {
          newSocket.close();
        }
      };
    } catch (err: any) {
      console.error('Failed to establish WebSocket connection:', err);
      setUseWebSocket(false); // Fall back to REST API
    }
  }, [useWebSocket]);

  // Fallback to REST API polling if WebSocket is not available
  useEffect(() => {
    if (useWebSocket && socket) return; // Using WebSocket, no need for polling
    
    // Fetch immediately
    fetchViaREST();
    
    // Set up polling
    const interval = setInterval(fetchViaREST, pollingInterval);
    
    return () => clearInterval(interval);
  }, [pollingInterval, useWebSocket, socket]);

  return { systemStatus, loading, error };
};
