import axios from 'axios';

// Configure the Ollama API client
const ollamaClient = (baseUrl: string = process.env.NEXT_PUBLIC_OLLAMA_API_URL || 'http://10.0.0.10:11434') => {
  const client = axios.create({
    baseURL: baseUrl,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return {
    // Get list of available models
    getModels: async () => {
      const response = await client.get('/api/tags');
      return response.data.models;
    },

    // Generate a completion from a prompt
    generateCompletion: async ({
      model,
      prompt,
      stream = false,
      options = {},
    }: {
      model: string;
      prompt: string;
      stream?: boolean;
      options?: Record<string, any>;
    }) => {
      return client.post('/api/generate', {
        model,
        prompt,
        stream,
        options,
      });
    },

    // Create a chat completion with message history
    createChatCompletion: async ({
      model,
      messages,
      stream = false,
      options = {},
    }: {
      model: string;
      messages: Array<{ role: string; content: string }>;
      stream?: boolean;
      options?: Record<string, any>;
    }) => {
      return client.post('/api/chat', {
        model,
        messages,
        stream,
        options,
      });
    },

    // Execute code completion via embedded logic in prompt
    executeCodeCompletion: async ({
      model,
      code,
      language,
      task,
    }: {
      model: string;
      code: string;
      language: string;
      task: string;
    }) => {
      const prompt = `
      You are a helpful programming assistant. Please help with the following ${language} code:
      
      \`\`\`${language}
      ${code}
      \`\`\`
      
      Task: ${task}
      
      Instructions:
      1. Analyze the code and understand its functionality.
      2. Complete the requested task.
      3. Return ONLY the code solution without additional comments or explanations.
      4. Make sure the output is valid, properly formatted ${language} code.
      `;

      return client.post('/api/generate', {
        model,
        prompt,
        options: {
          temperature: 0.2,
        },
      });
    },

    // Generate infrastructure code for MCP
    generateInfrastructureCode: async ({
      model,
      task,
      environment,
      existingCode = '',
    }: {
      model: string;
      task: string;
      environment: string;
      existingCode?: string;
    }) => {
      const prompt = `
      You are a specialized infrastructure automation assistant. Please help with the following task:
      
      Environment: ${environment}
      Task: ${task}
      
      ${existingCode ? `Existing code:\n\`\`\`\n${existingCode}\n\`\`\`\n` : ''}
      
      Instructions:
      1. Create reliable and secure infrastructure code.
      2. Use best practices for ${environment}.
      3. Return ONLY the code solution without additional comments or explanations.
      4. Ensure proper error handling and security considerations.
      `;

      return client.post('/api/generate', {
        model,
        prompt,
        options: {
          temperature: 0.2,
        },
      });
    },

    // Generate web server configuration for MCP
    generateWebServerConfig: async ({
      model,
      serverType,
      appType,
      requirements,
    }: {
      model: string;
      serverType: string;
      appType: string;
      requirements: string;
    }) => {
      const prompt = `
      You are a specialized web server configuration assistant. Please create configuration for:
      
      Server Type: ${serverType}
      Application Type: ${appType}
      Requirements: ${requirements}
      
      Instructions:
      1. Create optimal web server configuration.
      2. Use best practices for ${serverType} and ${appType}.
      3. Return ONLY the configuration without additional comments or explanations.
      4. Ensure security, performance and reliability.
      `;

      return client.post('/api/generate', {
        model,
        prompt,
        options: {
          temperature: 0.2,
        },
      });
    },

    // Generate game server configuration for MCP
    generateGameServerConfig: async ({
      model,
      game,
      serverRequirements,
    }: {
      model: string;
      game: string;
      serverRequirements: string;
    }) => {
      const prompt = `
      You are a specialized game server configuration assistant. Please create configuration for:
      
      Game: ${game}
      Server Requirements: ${serverRequirements}
      
      Instructions:
      1. Create optimal game server configuration.
      2. Use best practices for ${game} servers.
      3. Return ONLY the configuration without additional comments or explanations.
      4. Ensure performance, stability and security.
      `;

      return client.post('/api/generate', {
        model,
        prompt,
        options: {
          temperature: 0.2,
        },
      });
    },
  };
};

export default ollamaClient;
