// Task types
export interface Task {
  task_id: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  result?: any;
  error?: string;
}

export interface TaskResponse {
  task_id: string;
  status: string;
  message: string;
}

// Game server types
export interface GameServer {
  server_name: string;
  game: string;
  target_host: string;
  status: string;
}

export interface GameServerDeployRequest {
  game: string;
  target_host?: string;
  server_name: string;
  custom_config?: Record<string, any>;
}

// Web server types
export interface WebApp {
  app_name: string;
  app_type: string;
  repo_url: string;
  target_host: string;
  status: string;
}

export interface WebAppDeployRequest {
  app_type: string;
  repo_url: string;
  target_host?: string;
  app_name: string;
  custom_config?: Record<string, any>;
  env_vars?: Record<string, string>;
}

// Infrastructure types
export interface InfrastructureTaskRequest {
  task: string;
}

// System types
export interface SystemStatus {
  main_server: {
    cpu: string;
    gpu: string;
    ram: string;
    status: string;
  };
  deployment_targets: DeploymentTarget[];
}

export interface DeploymentTarget {
  host: string;
  specs: string;
  status: string;
  load: number;
}

// Agent types
export interface Agent {
  name: string;
  model: string;
  status: string;
}
