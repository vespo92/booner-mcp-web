import axios from 'axios';

// Create base axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// API endpoints
export const api = {
  // Agent endpoints
  getAgents: () => apiClient.get('/agents'),
  
  // Task endpoints
  getTasks: () => apiClient.get('/tasks'),
  getTaskStatus: (taskId: string) => apiClient.get(`/tasks/${taskId}`),
  
  // Game server endpoints
  deployGameServer: (data: any) => apiClient.post('/game/deploy', data),
  updateGameServer: (data: any) => apiClient.post('/game/update', data),
  startGameServer: (data: any) => apiClient.post('/game/start', data),
  stopGameServer: (data: any) => apiClient.post('/game/stop', data),
  backupGameServer: (data: any) => apiClient.post('/game/backup', data),
  
  // Web server endpoints
  deployWebApp: (data: any) => apiClient.post('/web/deploy', data),
  updateWebApp: (data: any) => apiClient.post('/web/update', data),
  configureNginx: (data: any) => apiClient.post('/web/nginx', data),
  setupMonitoring: (data: any) => apiClient.post('/web/monitoring', data),
  
  // Infrastructure endpoints
  runInfrastructureTask: (data: any) => apiClient.post('/infrastructure/task', data),
};

export default apiClient;
