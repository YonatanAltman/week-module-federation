# Production Deployment Guide - Module Federation

This document explains how to deploy your module federation system to production using the domain `https://my-awesome-week` for the host application and proper configuration for all remote applications.

## Architecture Overview

### Current Development Setup
- **Host Application**: `week` (runs on localhost:4200)
- **Remote Applications**: `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`, `sunday` (run on ports 4201-4207)

### Production Deployment Strategy

In production, your module federation system will be deployed as follows:

```
https://my-awesome-week/                    → Host Application (week)
https://monday.my-awesome-week/             → Monday Remote
https://tuesday.my-awesome-week/            → Tuesday Remote  
https://wednesday.my-awesome-week/          → Wednesday Remote
https://thursday.my-awesome-week/           → Thursday Remote
https://friday.my-awesome-week/             → Friday Remote
https://saturday.my-awesome-week/           → Saturday Remote
https://sunday.my-awesome-week/             → Sunday Remote
```

**Alternative Approach**: You could also deploy remotes as subpaths:
```
https://my-awesome-week/                    → Host Application (week)
https://my-awesome-week/remotes/monday/     → Monday Remote
https://my-awesome-week/remotes/tuesday/    → Tuesday Remote
etc...
```

## Configuration Changes Required

### 1. Update Production Webpack Configurations

#### Host Application (`apps/week/webpack.prod.config.ts`)

```typescript
import { withModuleFederation } from '@nx/module-federation/angular';
import config from './module-federation.config';

export default withModuleFederation(
  {
    ...config,
    remotes: [
      ['monday', 'https://monday.my-awesome-week'],
      ['tuesday', 'https://tuesday.my-awesome-week'],
      ['wednesday', 'https://wednesday.my-awesome-week'],
      ['thursday', 'https://thursday.my-awesome-week'],
      ['friday', 'https://friday.my-awesome-week'],
      ['saturday', 'https://saturday.my-awesome-week'],
      ['sunday', 'https://sunday.my-awesome-week'],
    ],
  },
  { dts: false }
);
```

#### Remote Applications (e.g., `apps/monday/webpack.prod.config.ts`)

Each remote application needs to specify its production URL. For example, for Monday:

```typescript
import { withModuleFederation } from '@nx/module-federation/angular';
import config from './module-federation.config';

export default withModuleFederation(
  {
    ...config,
    // Optional: Specify the public path for this remote
    publicPath: 'https://monday.my-awesome-week/',
  },
  { dts: false }
);
```

### 2. Environment Configuration

Create production environment files or update existing ones:

#### `apps/week/src/environments/environment.prod.ts`
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.my-awesome-week.com',
  remotes: {
    monday: 'https://monday.my-awesome-week',
    tuesday: 'https://tuesday.my-awesome-week',
    wednesday: 'https://wednesday.my-awesome-week',
    thursday: 'https://thursday.my-awesome-week',
    friday: 'https://friday.my-awesome-week',
    saturday: 'https://saturday.my-awesome-week',
    sunday: 'https://sunday.my-awesome-week',
  }
};
```

### 3. Build Scripts

Add production build scripts to your `package.json`:

```json
{
  "scripts": {
    "build:prod": "nx run-many --target=build --projects=week,monday,tuesday,wednesday,thursday,friday,saturday,sunday --configuration=production --parallel",
    "build:host": "nx build week --configuration=production",
    "build:remotes": "nx run-many --target=build --projects=monday,tuesday,wednesday,thursday,friday,saturday,sunday --configuration=production --parallel"
  }
}
```

## Deployment Process

### 1. Build All Applications

```bash
# Build all applications for production
npm run build:prod
```

This creates optimized bundles in:
- `dist/apps/week/` (Host application)
- `dist/apps/monday/` (Monday remote)
- `dist/apps/tuesday/` (Tuesday remote)
- etc...

### 2. Deploy Each Application

#### Host Application Deployment
Deploy the contents of `dist/apps/week/` to `https://my-awesome-week/`

#### Remote Applications Deployment
Deploy each remote to its respective subdomain:
- Deploy `dist/apps/monday/` to `https://monday.my-awesome-week/`
- Deploy `dist/apps/tuesday/` to `https://tuesday.my-awesome-week/`
- etc...

### 3. Server Configuration

#### Nginx Configuration Example

```nginx
# Host application
server {
    listen 443 ssl;
    server_name my-awesome-week;
    
    location / {
        root /var/www/week;
        try_files $uri $uri/ /index.html;
        
        # Enable CORS for module federation
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
        add_header Access-Control-Allow-Headers 'Content-Type';
    }
}

# Monday remote
server {
    listen 443 ssl;
    server_name monday.my-awesome-week;
    
    location / {
        root /var/www/monday;
        try_files $uri $uri/ /index.html;
        
        # Enable CORS for module federation
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
        add_header Access-Control-Allow-Headers 'Content-Type';
    }
}

# Repeat for other remotes...
```

#### Alternative: Single Server Deployment

If you prefer deploying everything on a single server with subpaths:

```nginx
server {
    listen 443 ssl;
    server_name my-awesome-week;
    
    # Host application
    location / {
        root /var/www/week;
        try_files $uri $uri/ /index.html;
    }
    
    # Remote applications
    location /remotes/monday/ {
        alias /var/www/monday/;
        try_files $uri $uri/ /index.html;
    }
    
    location /remotes/tuesday/ {
        alias /var/www/tuesday/;
        try_files $uri $uri/ /index.html;
    }
    
    # Add CORS headers for all locations
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
    add_header Access-Control-Allow-Headers 'Content-Type';
}
```

## How It Works in Production

### 1. Initial Load
- User visits `https://my-awesome-week/`
- Host application (`week`) loads from the main domain
- No remote applications are loaded initially (lazy loading)

### 2. Navigation to Remote Routes
- User navigates to `/monday` route
- Angular's router triggers lazy loading: `loadChildren: () => import('monday/Routes')`
- Webpack module federation fetches the remote module from `https://monday.my-awesome-week/`
- The remote module is loaded and rendered within the host application

### 3. Caching and Performance
- Each remote application is cached independently
- Remotes can be updated without affecting the host application
- Users only download the remotes they actually visit

## Environment-Specific Configurations

### Development vs Production

The key differences between development and production:

| Aspect | Development | Production |
|--------|-------------|------------|
| Host URL | `http://localhost:4200` | `https://my-awesome-week` |
| Remote URLs | `http://localhost:4201-4207` | `https://{day}.my-awesome-week` |
| Module Federation | Auto-discovery via Nx | Explicit URL configuration |
| CORS | Not required | Required for cross-origin loading |

### Staging Environment

For staging, you might use:
```
https://staging.my-awesome-week/           → Host
https://monday.staging.my-awesome-week/    → Monday Remote
etc...
```

Update the webpack.prod.config.ts files accordingly.

## Deployment Strategies

### 1. Independent Deployment
- Each remote can be deployed independently
- Host application doesn't need to be redeployed when remotes change
- Enables different teams to work on different remotes

### 2. Versioning Strategy
- Consider versioning your remotes for better control
- Example: `https://monday.my-awesome-week/v1.2.0/`

### 3. Rollback Strategy
- Keep previous versions available for quick rollbacks
- Use load balancers to switch between versions

## Security Considerations

### 1. CORS Configuration
- Configure CORS properly for cross-origin module loading
- Restrict origins in production (avoid `*` wildcard)

### 2. Content Security Policy (CSP)
```html
<meta http-equiv="Content-Security-Policy" 
      content="script-src 'self' https://*.my-awesome-week; object-src 'none';">
```

### 3. Authentication
- Ensure authentication is handled properly across all remotes
- Consider using shared authentication service or tokens

## Monitoring and Debugging

### 1. Loading Errors
- Monitor for module federation loading errors
- Implement fallback mechanisms for failed remote loads

### 2. Performance Monitoring
- Track loading times for each remote
- Monitor bundle sizes and loading performance

### 3. Debugging Tools
- Use browser developer tools to inspect module federation loading
- Check network tab for remote loading requests

## CDN Integration

For better performance, consider using a CDN:

```typescript
// In production webpack config
export default withModuleFederation(
  {
    ...config,
    remotes: [
      ['monday', 'https://cdn.my-awesome-week.com/monday'],
      ['tuesday', 'https://cdn.my-awesome-week.com/tuesday'],
      // etc...
    ],
  },
  { dts: false }
);
```

## Conclusion

This approach provides:

1. **Scalability**: Each remote can be developed and deployed independently
2. **Performance**: Lazy loading ensures users only download needed code
3. **Maintainability**: Clear separation of concerns between different parts of the application
4. **Team Independence**: Different teams can work on different remotes without conflicts

The key to successful deployment is proper configuration of the production webpack files and ensuring all remotes are accessible from their designated URLs with proper CORS configuration. 