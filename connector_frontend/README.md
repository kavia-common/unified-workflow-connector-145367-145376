# Connector Platform Frontend

A modern Next.js frontend application for the Connector Platform, featuring the Ocean Professional theme with comprehensive tools for managing integrations, workflows, and system monitoring.

## 🚀 Features

### Core Pages
- **Dashboard** - Overview with connector status, metrics, and activity feed
- **Connectors** - Management of all available connectors with filtering and authentication
- **Integrations** - Active integration management and creation
- **Workflows** - Workflow creation and management with templates
- **Monitoring** - Real-time system monitoring and health dashboards
- **Analytics** - Detailed usage analytics and insights
- **Settings** - User preferences and system configuration
- **Help** - Documentation and support system

### UI Components
- **Sidebar Navigation** with Ocean Professional styling
- **Header** with search, notifications, and user profile
- **Notification Drawer** with real-time alerts
- **Modal Components** for connections and creation workflows
- **Card-based Layout** with hover effects and smooth animations
- **Filter Components** with advanced search capabilities
- **Chart Placeholders** for analytics visualization

### Technical Features
- ✅ **TypeScript** with full type safety
- ✅ **Ocean Professional Theme** with specified color palette (#2563EB primary, #F59E0B secondary)
- ✅ **Responsive Design** for all screen sizes
- ✅ **Modern UI Components** with smooth animations and transitions
- ✅ **Error Handling** with toast notifications
- ✅ **State Management** with React Context providers
- ✅ **API Integration** ready for backend connection
- ✅ **Extensible Architecture** following plugin patterns

## 🎨 Design System

### Colors (Ocean Professional Theme)
- **Primary**: #2563EB (Blue)
- **Secondary**: #F59E0B (Amber)
- **Background**: #f9fafb (Light Gray)
- **Surface**: #ffffff (White)
- **Text**: #111827 (Dark Gray)
- **Error**: #EF4444 (Red)

### Design Principles
- Clean aesthetic with subtle shadows and rounded corners
- Minimalist design with accent highlights for interactive elements
- Smooth transitions and subtle gradients for visual depth
- Consistent spacing and typography using Inter font family

## 🛠️ Tech Stack

- **Framework**: Next.js 15.2.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Custom components with Headless UI
- **Icons**: Hero Icons and emoji-based icons
- **Notifications**: React Hot Toast
- **HTTP Client**: Fetch API with custom utilities
- **Animation**: Framer Motion for complex animations
- **Drag & Drop**: React DnD for workflow builder

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── analytics/               # Analytics dashboard
│   ├── connectors/              # Connector management
│   ├── help/                    # Help and documentation
│   ├── integrations/            # Integration management
│   ├── monitoring/              # System monitoring
│   ├── settings/                # User settings
│   ├── workflows/               # Workflow builder
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Dashboard page
├── components/                   # Reusable UI components
│   ├── analytics/               # Analytics-specific components
│   ├── connectors/              # Connector-related components
│   ├── dashboard/               # Dashboard components
│   ├── integrations/            # Integration components
│   ├── layout/                  # Layout components (Sidebar, Header)
│   ├── monitoring/              # Monitoring components
│   ├── notifications/           # Notification components
│   ├── settings/                # Settings components
│   └── workflows/               # Workflow components
├── connectors/                   # Connector client registry
├── contexts/                     # React Context providers
├── types/                        # TypeScript type definitions
└── utils/                        # Utility functions and API helpers
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables
Create a `.env.local` file with:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

## 🔌 Connector Architecture

The frontend implements a modular connector client registry following the plugin architecture:

### Connector Client Interface
```typescript
interface ConnectorClient {
  id: string;
  label: string;
  prefix: string; // e.g., '@jira_'
  icon: string;
  search(query: string, resource?: string): Promise<SearchResult[]>;
  create?(resource: string, payload: Record<string, unknown>): Promise<SearchResult>;
  getProjects?(): Promise<unknown[]>;
  getSpaces?(): Promise<unknown[]>;
}
```

### Available Connectors
- **Jira** - Project management and issue tracking
- **Confluence** - Team collaboration and documentation
- **GitHub** - Code repository and collaboration (placeholder)
- **Slack** - Team communication (placeholder)
- **Linear** - Modern issue tracking (placeholder)
- **Notion** - All-in-one workspace (placeholder)

## 🔐 Authentication & Security

### OAuth Flow
1. User clicks "Connect" on a connector
2. Frontend calls `/connectors/{id}/oauth/login`
3. Backend returns authorization URL
4. User is redirected to provider's OAuth page
5. Provider redirects back with authorization code
6. Backend exchanges code for tokens and stores them encrypted

### API Key Flow
1. User enters site URL, username, and API token
2. Frontend validates and sends credentials to backend
3. Backend validates credentials with provider
4. Credentials stored encrypted if validation succeeds

## 📊 Real-time Features

### Notification System
- Global notification context for state management
- Sliding drawer interface for notification history
- Real-time alerts for system events and status changes
- Toast notifications for user actions and errors

### Monitoring Dashboard
- Real-time system health indicators
- Performance metrics and charts
- Alert management and status tracking
- Auto-refresh capabilities with configurable intervals

## 🎯 Integration Points

### Backend API Integration
- RESTful API client with proper error handling
- Standardized request/response patterns
- Automatic token refresh and authentication
- Type-safe API calls with TypeScript

### WebSocket Support
- Real-time updates for system status
- Live notifications and alerts
- Connection state management
- Automatic reconnection handling

## 🔧 Development

### Code Quality
- ESLint configuration with Next.js and TypeScript rules
- Prettier for code formatting
- TypeScript strict mode enabled
- Comprehensive error handling

### Testing Strategy
- Component unit tests (to be implemented)
- Integration tests for API clients (to be implemented)
- E2E tests for critical user flows (to be implemented)

### Performance
- Static site generation with Next.js
- Optimized bundle sizes with code splitting
- Lazy loading for non-critical components
- Image optimization and caching

## 📝 API Documentation

### Frontend API Client
The application includes a comprehensive API client (`src/utils/api.ts`) with:
- Automatic authentication header injection
- Tenant context management
- Error handling and retry logic
- Type-safe request/response handling

### Connector Registry
Located in `src/connectors/index.ts`, provides:
- Centralized connector client management
- Extensible architecture for new connectors
- Standardized search and create operations
- Chat prefix detection for @-mentions

## 🔮 Future Enhancements

### Planned Features
- Advanced workflow builder with visual drag-and-drop
- Real-time collaboration features
- Advanced analytics and reporting
- Custom connector development tools
- Mobile-responsive optimizations
- Internationalization support

### Integration Roadmap
- Additional connector implementations
- Enhanced authentication methods
- Advanced monitoring and alerting
- Performance optimization tools
- API rate limiting and quotas

## 📄 License

This project is part of the Connector Platform and follows the same licensing terms.

## 🤝 Contributing

Please refer to the main project documentation for contribution guidelines and development setup instructions.
