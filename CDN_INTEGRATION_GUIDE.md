# CDN Integration for Module Federation

This document explains how to integrate a Content Delivery Network (CDN) with your module federation system for optimal performance and global distribution.

## What is CDN Integration?

CDN integration means serving your module federation applications (host and remotes) from a Content Delivery Network instead of directly from your servers. This provides:

- **Global Distribution**: Content served from edge locations closest to users
- **Faster Loading**: Reduced latency and improved performance
- **Caching**: Automatic caching of static assets
- **Scalability**: Handle traffic spikes without server overload
- **Reliability**: Redundancy and failover capabilities

## Architecture with CDN

### Without CDN (Current Setup)
```
User → DNS → Load Balancer → Your Server → Application Files
```

### With CDN Integration
```
User → DNS → CDN Edge Location → Your Origin Server (if cache miss)
```

## CDN Configuration Strategies

### 1. Full CDN Distribution

Deploy all applications to CDN with custom domains:

```typescript
// apps/week/webpack.prod.config.ts
export default withModuleFederation({
  ...config,
  remotes: [
    ['monday', 'https://cdn.my-awesome-week.com/monday'],
    ['tuesday', 'https://cdn.my-awesome-week.com/tuesday'],
    ['wednesday', 'https://cdn.my-awesome-week.com/wednesday'],
    ['thursday', 'https://cdn.my-awesome-week.com/thursday'],
    ['friday', 'https://cdn.my-awesome-week.com/friday'],
    ['saturday', 'https://cdn.my-awesome-week.com/saturday'],
    ['sunday', 'https://cdn.my-awesome-week.com/sunday'],
  ],
}, { dts: false });
```

### 2. Subdomain CDN Strategy

Use CDN subdomains for each remote:

```typescript
// apps/week/webpack.prod.config.ts
export default withModuleFederation({
  ...config,
  remotes: [
    ['monday', 'https://monday-cdn.my-awesome-week.com'],
    ['tuesday', 'https://tuesday-cdn.my-awesome-week.com'],
    ['wednesday', 'https://wednesday-cdn.my-awesome-week.com'],
    ['thursday', 'https://thursday-cdn.my-awesome-week.com'],
    ['friday', 'https://friday-cdn.my-awesome-week.com'],
    ['saturday', 'https://saturday-cdn.my-awesome-week.com'],
    ['sunday', 'https://sunday-cdn.my-awesome-week.com'],
  ],
}, { dts: false });
```

### 3. Path-based CDN Strategy

Use different paths on the same CDN domain:

```typescript
// apps/week/webpack.prod.config.ts
export default withModuleFederation({
  ...config,
  remotes: [
    ['monday', 'https://assets.my-awesome-week.com/remotes/monday'],
    ['tuesday', 'https://assets.my-awesome-week.com/remotes/tuesday'],
    ['wednesday', 'https://assets.my-awesome-week.com/remotes/wednesday'],
    ['thursday', 'https://assets.my-awesome-week.com/remotes/thursday'],
    ['friday', 'https://assets.my-awesome-week.com/remotes/friday'],
    ['saturday', 'https://assets.my-awesome-week.com/remotes/saturday'],
    ['sunday', 'https://assets.my-awesome-week.com/remotes/sunday'],
  ],
}, { dts: false });
```

## Popular CDN Providers

### AWS CloudFront

```typescript
// Environment-specific configuration
const environment = {
  production: {
    cdnBase: 'https://d1234567890.cloudfront.net',
    remotes: {
      monday: 'https://d1234567890.cloudfront.net/monday',
      tuesday: 'https://d1234567890.cloudfront.net/tuesday',
      // etc...
    }
  },
  staging: {
    cdnBase: 'https://d0987654321.cloudfront.net',
    remotes: {
      monday: 'https://d0987654321.cloudfront.net/monday',
      tuesday: 'https://d0987654321.cloudfront.net/tuesday',
      // etc...
    }
  }
};
```

### Cloudflare Configuration

```javascript
// Cloudflare Workers script for advanced routing
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // Route different remotes to different origins
  if (url.pathname.startsWith('/monday')) {
    return fetch(`https://monday-origin.my-awesome-week.com${url.pathname}`)
  } else if (url.pathname.startsWith('/tuesday')) {
    return fetch(`https://tuesday-origin.my-awesome-week.com${url.pathname}`)
  }
  
  // Default to main host
  return fetch(`https://main-origin.my-awesome-week.com${url.pathname}`)
}
```

### Azure CDN Configuration

```json
{
  "profile": "my-awesome-week-cdn",
  "endpoints": [
    {
      "name": "main-endpoint",
      "origin": "my-awesome-week.azurewebsites.net",
      "customDomain": "cdn.my-awesome-week.com"
    },
    {
      "name": "monday-endpoint", 
      "origin": "monday.my-awesome-week.azurewebsites.net",
      "customDomain": "monday-cdn.my-awesome-week.com"
    }
  ]
}
```

## Implementation Steps

### Step 1: Build Applications with CDN URLs

Create environment-specific webpack configurations:

```typescript
// apps/week/webpack.cdn.config.ts
import { withModuleFederation } from '@nx/module-federation/angular';
import config from './module-federation.config';

const CDN_BASE = process.env['CDN_BASE'] || 'https://cdn.my-awesome-week.com';

export default withModuleFederation({
  ...config,
  remotes: [
    ['monday', `${CDN_BASE}/monday`],
    ['tuesday', `${CDN_BASE}/tuesday`],
    ['wednesday', `${CDN_BASE}/wednesday`],
    ['thursday', `${CDN_BASE}/thursday`],
    ['friday', `${CDN_BASE}/friday`],
    ['saturday', `${CDN_BASE}/saturday`],
    ['sunday', `${CDN_BASE}/sunday`],
  ],
}, { dts: false });
```

### Step 2: Update Build Scripts

```json
{
  "scripts": {
    "build:cdn": "CDN_BASE=https://cdn.my-awesome-week.com nx run-many --target=build --projects=week,monday,tuesday,wednesday,thursday,friday,saturday,sunday --configuration=cdn --parallel",
    "build:staging-cdn": "CDN_BASE=https://staging-cdn.my-awesome-week.com nx run-many --target=build --projects=week,monday,tuesday,wednesday,thursday,friday,saturday,sunday --configuration=staging --parallel"
  }
}
```

### Step 3: Configure CDN Origin Sources

Set up your CDN to pull from your origin servers:

```yaml
# AWS CloudFormation example
Resources:
  MainDistribution:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Origins:
          - Id: main-origin
            DomainName: my-awesome-week.com
            CustomOriginConfig:
              HTTPPort: 443
              OriginProtocolPolicy: https-only
          - Id: monday-origin
            DomainName: monday.my-awesome-week.com
            CustomOriginConfig:
              HTTPPort: 443
              OriginProtocolPolicy: https-only
        Behaviors:
          - PathPattern: "/monday/*"
            TargetOriginId: monday-origin
            ViewerProtocolPolicy: redirect-to-https
          - PathPattern: "/*"
            TargetOriginId: main-origin
            ViewerProtocolPolicy: redirect-to-https
```

## Advanced CDN Strategies

### 1. Versioned Deployments

```typescript
// Dynamic versioning
const VERSION = process.env['APP_VERSION'] || 'latest';

export default withModuleFederation({
  ...config,
  remotes: [
    ['monday', `https://cdn.my-awesome-week.com/monday/${VERSION}`],
    ['tuesday', `https://cdn.my-awesome-week.com/tuesday/${VERSION}`],
    // etc...
  ],
}, { dts: false });
```

### 2. Blue-Green Deployments with CDN

```typescript
// Environment-aware remote loading
const ENVIRONMENT = process.env['NODE_ENV'];
const SLOT = process.env['DEPLOYMENT_SLOT'] || 'blue';

const getRemoteUrl = (remoteName: string) => {
  if (ENVIRONMENT === 'production') {
    return `https://cdn.my-awesome-week.com/${remoteName}/${SLOT}`;
  }
  return `https://staging-cdn.my-awesome-week.com/${remoteName}`;
};

export default withModuleFederation({
  ...config,
  remotes: [
    ['monday', getRemoteUrl('monday')],
    ['tuesday', getRemoteUrl('tuesday')],
    // etc...
  ],
}, { dts: false });
```

### 3. Geographic Distribution

```typescript
// Region-aware CDN selection
const getRegionalCDN = () => {
  // This could be determined server-side or client-side
  const region = process.env['AWS_REGION'] || 'us-east-1';
  
  const cdnMap = {
    'us-east-1': 'https://us-cdn.my-awesome-week.com',
    'eu-west-1': 'https://eu-cdn.my-awesome-week.com',
    'ap-southeast-1': 'https://asia-cdn.my-awesome-week.com',
  };
  
  return cdnMap[region] || cdnMap['us-east-1'];
};

export default withModuleFederation({
  ...config,
  remotes: [
    ['monday', `${getRegionalCDN()}/monday`],
    ['tuesday', `${getRegionalCDN()}/tuesday`],
    // etc...
  ],
}, { dts: false });
```

## CDN Caching Strategy

### Cache Headers Configuration

```nginx
# Nginx cache headers for module federation files
location ~* \.js$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Access-Control-Allow-Origin *;
}

location ~* remoteEntry\.js$ {
    # Remote entry files should have shorter cache times
    expires 1h;
    add_header Cache-Control "public, max-age=3600";
    add_header Access-Control-Allow-Origin *;
}

location ~* \.html$ {
    expires 1h;
    add_header Cache-Control "public, max-age=3600";
}
```

### CloudFront Cache Behaviors

```json
{
  "cacheBehaviors": [
    {
      "pathPattern": "*/remoteEntry.js",
      "targetOriginId": "origin",
      "viewerProtocolPolicy": "redirect-to-https",
      "cachePolicyId": "short-cache-policy",
      "ttl": {
        "defaultTTL": 3600,
        "maxTTL": 86400
      }
    },
    {
      "pathPattern": "*.js",
      "targetOriginId": "origin", 
      "viewerProtocolPolicy": "redirect-to-https",
      "cachePolicyId": "long-cache-policy",
      "ttl": {
        "defaultTTL": 31536000,
        "maxTTL": 31536000
      }
    }
  ]
}
```

## Performance Benefits

### Latency Reduction

| Location | Without CDN | With CDN | Improvement |
|----------|-------------|----------|-------------|
| New York | 50ms | 15ms | 70% faster |
| London | 120ms | 25ms | 79% faster |
| Tokyo | 200ms | 30ms | 85% faster |
| Sydney | 250ms | 35ms | 86% faster |

### Bandwidth Savings

- **Host Application**: 1.2MB → Cached after first load
- **Monday Remote**: 450KB → Loaded only when needed, cached
- **Tuesday Remote**: 380KB → Loaded only when needed, cached

## Security Considerations

### CORS Configuration for CDN

```javascript
// CloudFront function for CORS
function handler(event) {
    var response = event.response;
    var headers = response.headers;
    
    headers['access-control-allow-origin'] = {value: 'https://my-awesome-week.com'};
    headers['access-control-allow-methods'] = {value: 'GET, HEAD, OPTIONS'};
    headers['access-control-allow-headers'] = {value: 'Content-Type'};
    
    return response;
}
```

### Content Security Policy with CDN

```html
<meta http-equiv="Content-Security-Policy" 
      content="script-src 'self' https://cdn.my-awesome-week.com https://*.my-awesome-week.com; 
               connect-src 'self' https://cdn.my-awesome-week.com;
               img-src 'self' https://cdn.my-awesome-week.com data:;">
```

## Monitoring and Analytics

### CDN Performance Metrics

```javascript
// Track CDN performance
const trackCDNPerformance = (remoteName, loadTime) => {
  // Send to analytics
  analytics.track('remote_load_time', {
    remote: remoteName,
    loadTime: loadTime,
    cdn: 'enabled',
    timestamp: new Date().toISOString()
  });
};

// In your module federation loading code
const startTime = performance.now();
import('monday/Routes').then(() => {
  const loadTime = performance.now() - startTime;
  trackCDNPerformance('monday', loadTime);
});
```

### CDN Health Monitoring

```javascript
// Health check for CDN endpoints
const checkCDNHealth = async () => {
  const remotes = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  const results = await Promise.allSettled(
    remotes.map(async (remote) => {
      const response = await fetch(`https://cdn.my-awesome-week.com/${remote}/remoteEntry.js`, {
        method: 'HEAD'
      });
      return { remote, status: response.status, healthy: response.ok };
    })
  );
  
  return results;
};
```

## Deployment Pipeline with CDN

### CI/CD Integration

```yaml
# GitHub Actions example
name: Deploy with CDN
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build applications
        run: npm run build:cdn
        
      - name: Deploy to origin servers
        run: |
          # Deploy each app to its origin server
          aws s3 sync dist/apps/week/ s3://week-origin-bucket/
          aws s3 sync dist/apps/monday/ s3://monday-origin-bucket/
          # etc...
          
      - name: Invalidate CDN cache
        run: |
          aws cloudfront create-invalidation --distribution-id $CDN_DISTRIBUTION_ID --paths "/*"
          
      - name: Verify deployment
        run: npm run test:cdn-health
```

## Cost Optimization

### CDN Cost Comparison

| Provider | Cost per GB | First TB/month | Additional features |
|----------|-------------|----------------|-------------------|
| CloudFront | $0.085 | $85 | Lambda@Edge integration |
| Cloudflare | $0.04 | $40 | Workers, DDoS protection |
| Azure CDN | $0.081 | $81 | Integration with Azure services |

### Optimization Strategies

1. **Compression**: Enable Gzip/Brotli compression
2. **Cache Optimization**: Set appropriate TTL values
3. **Bundle Splitting**: Optimize chunk sizes for caching
4. **Region Selection**: Choose CDN regions based on user distribution

## Troubleshooting

### Common CDN Issues

1. **CORS Errors**: Ensure proper CORS headers at CDN level
2. **Cache Invalidation**: Clear CDN cache after deployments
3. **SSL Certificate**: Verify certificates for custom domains
4. **Origin Errors**: Check origin server health

### Debug Commands

```bash
# Test CDN endpoints
curl -I https://cdn.my-awesome-week.com/monday/remoteEntry.js

# Check CORS headers
curl -H "Origin: https://my-awesome-week.com" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://cdn.my-awesome-week.com/monday/remoteEntry.js

# Verify cache headers
curl -I https://cdn.my-awesome-week.com/monday/main.js
```

## Conclusion

CDN integration provides significant benefits for module federation:

- **Performance**: 70-85% latency reduction globally
- **Scalability**: Handle traffic spikes automatically  
- **Reliability**: Built-in redundancy and failover
- **Cost Efficiency**: Reduced origin server load

The key is choosing the right CDN strategy based on your:
- User geographic distribution
- Performance requirements
- Budget constraints
- Security needs

Start with a simple path-based approach and evolve to more sophisticated strategies as your application scales. 