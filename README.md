# Good Management

Frontend application for managing company processes, organizational structures, projects, programs, goals, employees, analytics, and communication.

The project is a large React-based SPA with modular API integration, real-time communication, interactive diagrams, drag-and-drop interfaces, and data visualization.

## Main Features

- Authentication and user-related flows
- Company and organizational structure management
- Projects and programs
- Goals, strategies, policies, and working plans
- Employee and position management
- Control panel and statistics
- Real-time communication and chat-related functionality
- Interactive organizational diagrams
- Drag-and-drop interfaces
- Data visualization and charts
- Desktop and mobile routing

## Tech Stack

### Core
- React 18
- JavaScript / JSX
- Redux Toolkit
- RTK Query
- React Router
- CRACO / Webpack

### UI and interaction
- Ant Design
- dnd-kit
- React Flow
- ECharts
- D3
- CSS Modules
- classnames

### Data and communication
- REST API
- Socket.IO
- JWT
- i18next

### Tooling
- Git
- GitHub Actions
- Nginx-based deployment
- React Testing Library / Jest tooling

## Architecture

The frontend is split into UI, routing, state management, API services, hooks, helpers, and shared logic.

```text
src/
├── UI/             # application pages, layouts and reusable UI
├── contexts/       # React contexts
├── helpers/        # shared helpers and configuration
├── hooks/          # custom hooks
├── navigation/     # desktop/mobile routing
├── store/          # Redux store, slices and RTK Query services
└── index.js        # application entry point
```

CRACO is used to extend the Create React App/Webpack configuration and provide aliases for application modules.

## State Management and API

Redux Toolkit is used for application state.

Server state and REST API communication are organized through a shared RTK Query `createApi` instance. Feature-specific API modules inject their endpoints through `injectEndpoints`, which keeps API logic separated by domain.

The API layer includes domains such as:

- users
- organizations
- goals
- strategies
- projects
- programs
- policies
- permissions
- control panel
- statistics
- messages and communication

## Real-time Communication

Socket.IO is used for real-time scenarios, including communication-related functionality and authorization flows.

REST API and sockets are used together depending on the type of interaction:

- REST / RTK Query for standard request-response operations and server state
- Socket.IO for events that require real-time updates

## Interactive UI

The project contains several non-trivial UI scenarios:

- sortable and draggable interfaces built with `dnd-kit`
- organizational diagrams built with `React Flow`
- custom React Flow nodes
- charts and statistics built with `ECharts`
- complex routing with lazy-loaded React components

## AI-assisted Development

Claude Code was used as a development assistant during the project.

It was mainly used for:

- generating draft implementations for repetitive UI and service code
- helping with repetitive RTK Query endpoint implementations
- suggesting refactoring options
- assisting with debugging and locating problems in the codebase
- accelerating navigation and analysis of a large existing codebase

I remained responsible for:

- task decomposition and implementation decisions
- architecture and technology choices
- integration with existing business logic and API contracts
- state-management decisions
- reviewing and correcting generated code
- debugging integration issues
- final implementation and acceptance of changes

AI-generated code was treated as a draft and reviewed before being integrated into the project.

## Environment Variables

The application expects several environment variables.

Create a `.env.local` file in the project root:

```env
REACT_APP_BASE_URL=
REACT_APP_SOCKET_URL=
REACT_APP_LINK_URL=
REACT_APP_TG_BOT_URL=
```

The actual values depend on the backend and deployment environment and are intentionally not stored in the repository.

## Local Development

The CI configuration uses Node.js `16.20.2`.

Install dependencies:

```bash
npm install --legacy-peer-deps
```

Start the development server:

```bash
npm start
```

Create a production build:

```bash
npm run build
```

Run tests:

```bash
npm test
```

A working backend and valid environment variables are required for the application's server-dependent functionality.

## CI/CD

The repository contains a GitHub Actions deployment workflow.

The deployment pipeline:

1. installs dependencies
2. builds the React application
3. injects environment variables through GitHub Secrets
4. uploads the production build to the server over SSH/SCP
5. reloads Nginx

Sensitive deployment values are stored in GitHub Secrets rather than in the repository.

## Project Notes

This repository contains the frontend part of the application.

The current codebase is primarily JavaScript/JSX. TypeScript is not claimed as part of this specific repository.

The project demonstrates work with a relatively large React codebase, modular server-state management, REST and real-time communication, complex UI interactions, visualization, and production deployment automation.
