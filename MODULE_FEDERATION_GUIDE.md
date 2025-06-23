# Module Federation Guide for Single-Push Nx Workspace

This document explains the module federation architecture in this Nx workspace, how to run the applications, and how lazy loading works with micro-frontends.

## Architecture Overview

This workspace implements a **Module Federation** micro-frontend architecture using Angular and Nx. The setup consists of:

### Host Applications
- **`week`** - The main host application that loads and orchestrates all remote modules
- **`single-push`** - A standalone application (non-module federation)

### Remote Applications (Micro-frontends)
- **`friday`** - Remote module running on port 4201
- **`monday`** - Remote module running on port 4202  
- **`tuesday`** - Remote module running on port 4203
- **`wednesday`** - Remote module running on port 4204
- **`thursday`** - Remote module running on port 4205
- **`saturday`** - Remote module running on port 4206
- **`sunday`** - Remote module running on port 4207

### Shared Libraries
- **`auth`** - Authentication service and guards
- **`login`** - Login component
- **`ui/header`** - Header component
- **`ui/nav-bar`** - Navigation bar component

## How Module Federation Works

### Host Configuration (`week` app)

The `week` application acts as the **host** and is configured in `apps/week/module-federation.config.ts`:

```typescript
const config: ModuleFederationConfig = {
  name: 'week',
  remotes: [
    'friday',
    'monday', 
    'tuesday',
    'wednesday',
    'thursday',
    'saturday',
    'sunday',
  ],
};
```

### Remote Configuration (e.g., `monday` app)

Each remote application exposes its routes in `apps/monday/module-federation.config.ts`:

```typescript
const config: ModuleFederationConfig = {
  name: 'monday',
  exposes: {
    './Routes': 'apps/monday/src/app/remote-entry/entry.routes.ts',
  },
};
```

### Lazy Loading Implementation

The host application (`week`) implements lazy loading of remote modules in `apps/week/src/app/app.routes.ts`:

```typescript
export const appRoutes: Route[] = [
  {
    path: 'monday',
    canActivate: [authGuard],
    loadChildren: () => import('monday/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: 'tuesday', 
    canActivate: [authGuard],
    loadChildren: () => import('tuesday/Routes').then((m) => m!.remoteRoutes),
  },
  // ... other routes
];
```

**Key Points:**
- Routes use `loadChildren()` for lazy loading
- Authentication guard (`authGuard`) protects all remote routes
- Each remote module is loaded only when its route is accessed
- TypeScript imports like `'monday/Routes'` are resolved by webpack module federation

## Running the Applications

### Development Scripts

The workspace provides several npm scripts in `package.json`:

```bash
# Start the main host application
npm run start:week

# Start a specific remote application  
npm run start:friday

# Start ALL remote applications in parallel
npm run start:all-remotes

# Alternative command for the host
npm run start:mf
```

### Manual Commands

You can also use Nx commands directly:

```bash
# Start the host application
npx nx serve week

# Start individual remote applications
npx nx serve friday
npx nx serve monday
npx nx serve tuesday
npx nx serve wednesday
npx nx serve thursday
npx nx serve saturday
npx nx serve sunday

# Start multiple remotes in parallel
npx nx run-many --target=serve --projects=friday,monday,tuesday,wednesday,thursday,saturday,sunday --parallel
```

### Port Configuration

Each application runs on a specific port:

| Application | Port | Type | URL |
|-------------|------|------|-----|
| week | 4200 | Host | http://localhost:4200 |
| friday | 4201 | Remote | http://localhost:4201 |
| monday | 4202 | Remote | http://localhost:4202 |
| tuesday | 4203 | Remote | http://localhost:4203 |
| wednesday | 4204 | Remote | http://localhost:4204 |
| thursday | 4205 | Remote | http://localhost:4205 |
| saturday | 4206 | Remote | http://localhost:4206 |
| sunday | 4207 | Remote | http://localhost:4207 |

## Development Workflow

### For Full Development Experience

1. **Start all applications:**
   ```bash
   # Terminal 1: Start the host
   npm run start:week
   
   # Terminal 2: Start all remotes
   npm run start:all-remotes
   ```

2. **Or use parallel execution:**
   ```bash
   # Start everything in parallel
   npx nx run-many --target=serve --projects=week,friday,monday,tuesday,wednesday,thursday,saturday,sunday --parallel
   ```

### For Specific Feature Development

If you're only working on specific remote applications:

```bash
# Start the host
npm run start:week

# Start only the remotes you need
npx nx serve monday
npx nx serve friday
```

### Navigation and Testing

1. Open the host application: http://localhost:4200
2. Navigate to different routes:
   - http://localhost:4200/monday
   - http://localhost:4200/tuesday
   - http://localhost:4200/friday
   - etc.

Each route will lazily load the corresponding remote module.

## How Lazy Loading Works

### 1. Initial Load
- Only the host application (`week`) loads initially
- Remote applications are **not** loaded until their routes are accessed

### 2. Route Navigation
- When user navigates to `/monday`, Angular's router triggers the lazy loading
- The `loadChildren()` function executes: `import('monday/Routes')`
- Webpack module federation fetches the remote module from `http://localhost:4202`
- The remote module's routes are loaded and rendered

### 3. Authentication Flow
- All remote routes are protected by `authGuard`
- Users must authenticate before accessing any remote modules
- The login component can be loaded separately: `/login`

### 4. Caching and Performance
- Once a remote module is loaded, it's cached by the browser
- Subsequent navigations to the same remote are instant
- Each remote runs independently and can be updated separately

## Benefits of This Architecture

1. **Independent Development**: Teams can work on different remote applications independently
2. **Independent Deployment**: Each remote can be deployed separately
3. **Lazy Loading**: Improved initial load performance
4. **Scalability**: Easy to add new remote applications
5. **Technology Independence**: Different remotes could use different Angular versions or even different frameworks (with proper configuration)

## Building for Production

```bash
# Build all applications
npx nx run-many --target=build --projects=week,friday,monday,tuesday,wednesday,thursday,saturday,sunday --parallel

# Build specific applications
npx nx build week
npx nx build monday
```

## Troubleshooting

### Common Issues

1. **Remote not loading**: Ensure the remote application is running on its configured port
2. **CORS errors**: Check that all applications are running on localhost with correct ports
3. **Module not found**: Verify the module federation configuration and exposed modules
4. **Authentication issues**: Check that the auth guard is properly configured

### Debug Tips

- Open browser developer tools to see network requests for remote modules
- Check console for module federation-specific errors
- Verify that all required remote applications are running
- Use `npx nx graph` to visualize the project dependencies

## Further Reading

- [Nx Module Federation Documentation](https://nx.dev/recipes/module-federation)
- [Angular Module Federation](https://angular.io/guide/module-federation)
- [Webpack Module Federation](https://webpack.js.org/concepts/module-federation/) 