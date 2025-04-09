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
  const [wsUrl, setWsUrl] = useState<string>('');

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

    // Safely determine the WebSocket URL based on the API URL
    try {
      // Always use the browser-accessible URL for WebSockets (NEXT_PUBLIC_API_URL)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      console.log('DEBUG WebSocket: Initial API URL:', apiUrl);
      
      // Convert HTTP URL to WebSocket URL
      if (typeof apiUrl === 'string' && apiUrl.trim() !== '') {
        // Replace HTTP protocol with WebSocket protocol
        const wsUrl = apiUrl.trim()
          .replace('http://', 'ws://')
          .replace('https://', 'wss://') + '/ws';
        
        console.log('DEBUG WebSocket: Using WebSocket URL:', wsUrl);
        setWsUrl(wsUrl);
      } else {
        console.error('DEBUG WebSocket: Invalid API URL:', apiUrl);
        setUseWebSocket(false);
        return;
      }
    } catch (error) {
      console.error('DEBUG WebSocket: Error setting up WebSocket URL:', error);
      setUseWebSocket(false);
      return;
    }
    
    try {
      // Make sure wsUrl is properly defined before creating WebSocket
      if (!wsUrl) {
        console.error('DEBUG WebSocket: WebSocket URL is empty');
        setUseWebSocket(false);
        return;
      }
      
      console.log('DEBUG WebSocket: Creating new WebSocket with URL:', `${wsUrl}/system/status`);
      const newSocket = new WebSocket(`${wsUrl}/system/status`);
      console.log('DEBUG WebSocket: WebSocket instance created:', newSocket);
      
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
              // Check wsUrl again for safety
              if (!wsUrl) {
                console.error('DEBUG WebSocket: WebSocket URL is empty during reconnect');
                setUseWebSocket(false);
                return;
              }
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
          console.log('DEBUG WebSocket: Message received:', event);
          // Safely parse the message data
          let parsedData;
          try {
            if (typeof event.data === 'string') {
              console.log('DEBUG WebSocket: Message data is a string, parsing as JSON...');
              parsedData = JSON.parse(event.data);
              console.log('DEBUG WebSocket: Parsed data:', parsedData);
            } else {
              console.error('DEBUG WebSocket: Message data is not a string:', typeof event.data);
              return;
            }
          } catch (parseError) {
            console.error('DEBUG WebSocket: Error parsing message data:', parseError);
            console.log('DEBUG WebSocket: Raw message data:', event.data);
            return;
          }
          
          setSystemStatus(parsedData);
          setLoading(false);
          setError(null);
        } catch (err) {
          console.error('DEBUG WebSocket: Error handling message:', err);
        }
      };
      
      newSocket.onerror = (event) => {
        console.error('DEBUG WebSocket: WebSocket error:', event);
        setError('WebSocket connection error');
        attemptReconnect(); // Try to reconnect before falling back
      };
      
      newSocket.onclose = (event) => {
        console.log('DEBUG WebSocket: WebSocket connection closed:', event);
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

  // Check for specific errors and provide more helpful feedback
  useEffect(() => {
    if (error && error.includes('WebSocket')) {
      console.warn('WebSocket connection failed, using REST API fallback');
      // Add a more descriptive error for debugging
      const detailedError = `WebSocket connection failed (${wsUrl}/system/status). Using REST API fallback. Original error: ${error}`;
      setError(detailedError);
    }
  }, [error]);

  return { systemStatus, loading, error };
};
