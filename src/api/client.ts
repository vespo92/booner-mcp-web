import axios from 'axios';

// Safely determine the base URL
const getBaseUrl = () => {
  // Check if we should use the internal API URL (for container-to-container communication)
  const internalApiUrl = process.env.INTERNAL_API_URL;
  if (internalApiUrl && typeof internalApiUrl === 'string' && internalApiUrl.trim() !== '' && typeof window === 'undefined') {
    console.log('Using internal API URL for server-side requests:', internalApiUrl);
    return internalApiUrl.trim();
  }
  
  // For client-side requests and fallback, use the public API URL
  const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (publicApiUrl && typeof publicApiUrl === 'string' && publicApiUrl.trim() !== '') {
    return publicApiUrl.trim();
  }
  
  // Fallback to localhost if not configured
  return 'http://localhost:8000';
};

// Create base axios instance
const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Set a timeout to prevent hanging requests
});

// Add interceptors for handling errors consistently
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error details to help with debugging
    console.error('API request failed:', error.message, error.config?.url);
    return Promise.reject(error);
  }
);

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
  
  // System status endpoints
  getSystemStatus: () => apiClient.get('/system/status'),
};

export default apiClient;
