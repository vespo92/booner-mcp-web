# Booner MCP Web Dashboard

This is the web interface for the Booner MCP (Management Control Panel) system, a comprehensive solution for managing game servers, web applications, and infrastructure using LLM agents.

## Features

- **Dashboard**: Real-time monitoring of system status, agents, tasks, and resources
- **Game Server Management**: Deploy, configure, and manage game servers
- **Web Server Management**: Deploy, configure, and manage web applications
- **Infrastructure Management**: Perform infrastructure tasks and automation
- **Task Tracking**: Monitor and manage ongoing and completed tasks
- **Settings**: Configure the MCP system, Ollama LLM integration, and deployment targets

## Architecture

The Booner MCP system consists of the following components:

- **Web Dashboard** (this repository): Next.js web interface for interacting with the MCP system
- **API Server**: Backend API for processing requests and managing tasks
- **Ollama Integration**: LLM-powered agents for automation
- **Task Queue**: Background task processing system

## Prerequisites

- Node.js 18+
- Docker and Docker Compose (for containerized deployment)
- Ollama (for LLM integration)
- Access to deployment targets (servers for game/web hosting)

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/booner-mcp-web.git
   cd booner-mcp-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment example and configure:
   ```bash
   cp .env.example .env.local
   ```
   Edit the `.env.local` file with your specific configuration.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Docker Deployment

For production deployment, we recommend using Docker Compose:

1. Make sure Docker and Docker Compose are installed on your system.

2. Configure environment variables:
   - Edit the `docker-compose.yml` file to update environment variables
   - Or create a `.env` file in the project root

3. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

4. Access the web interface at `http://10.0.0.4:3000`

### GPU Support

To use GPU acceleration with Ollama:

1. Ensure NVIDIA drivers and NVIDIA Container Toolkit are installed on the host.
2. The docker-compose file is already configured for GPU support.

## Authentication

The system uses JWT-based authentication. Default credentials:

- Username: `admin`
- Password: `adminpassword`

Change these credentials immediately after the first login through the Settings page.

## API Integration

The dashboard connects to the MCP API server. Endpoints include:

- `/agents`: Manage LLM agents
- `/tasks`: Manage and monitor tasks
- `/game/*`: Game server management
- `/web/*`: Web application management
- `/infrastructure/*`: Infrastructure tasks

## Ollama Integration

The system integrates with Ollama for LLM capabilities:

1. Models are loaded and managed through the Ollama API
2. Default endpoint is `http://10.0.0.10:11434`
3. Supported models include `llama3`, `mixtral`, `mistral`, and `phi3`

## Folder Structure

```
booner-mcp-web/
├── public/             # Static assets
├── src/                # Source code
│   ├── api/            # API client and types
│   ├── app/            # Next.js app router pages
│   ├── components/     # React components
│   │   └── ui/         # shadcn/ui components
│   ├── context/        # React context providers
│   ├── lib/            # Utility functions and helpers
│   └── services/       # Service integrations (Ollama, etc.)
├── .env.example        # Example environment variables
├── docker-compose.yml  # Docker Compose configuration
├── Dockerfile          # Docker build configuration
└── next.config.ts      # Next.js configuration
```

## Tasks Implementation

The tasks system allows tracking and management of background operations:

1. **Task Queue**: Tasks are stored in a queue system and processed asynchronously
2. **Status Tracking**: Monitor progress with statuses (queued, running, completed, failed)
3. **Results**: View detailed results and logs for completed tasks

## Game Server Management

The game server management system supports:

- Minecraft (Java and Bedrock)
- Valheim
- CS2
- Palworld
- Ark: Survival Evolved
- Terraria
- And other popular game servers

Features include:

- One-click deployment
- Configuration management
- Mod/plugin installation
- Backup and restore
- Monitoring and resource management

## Web Application Management

Supported web application types:

- Node.js applications
- Python (Flask/Django)
- PHP applications
- Static websites
- Reverse proxy configurations

Features include:

- Deployment from Git repositories
- Environment variable management
- NGINX configuration
- SSL certificate management with Let's Encrypt
- Monitoring and logging

## Infrastructure Management

Infrastructure tasks include:

- Server provisioning
- Network configuration
- Security updates
- Backup management
- Resource optimization

## Error Handling

The application implements comprehensive error handling:

- Client-side error boundaries
- Loading states for API requests
- Detailed error messages and logging
- Automatic retry mechanisms

## Testing

To run tests:

```bash
npm test
```

The testing suite includes:

- Unit tests with Jest
- Component tests with React Testing Library
- End-to-end tests with Cypress

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Run tests and linting
5. Commit your changes (`git commit -m 'Add some feature'`)
6. Push to the branch (`git push origin feature/your-feature`)
7. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact the Booner MCP development team at support@example.com
