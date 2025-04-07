import { useState, useEffect } from 'react';
import { api } from './client';
import {
  Task,
  TaskResponse,
  GameServerDeployRequest,
  WebAppDeployRequest,
  InfrastructureTaskRequest
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
