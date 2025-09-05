# Deployment Guide

## Production Deployment

### Prerequisites

- Node.js 14+ installed on server
- Web server (Nginx, Apache, or similar)
- SSL certificate for HTTPS (required for camera access)
- Domain name configured

### Build Process

1. **Create Production Build**
   ```bash
   npm run build
   ```
   This creates an optimized build in the `build/` directory.

2. **Build Output Structure**
   ```
   build/
   ├── static/
   │   ├── css/        # Minified CSS files
   │   ├── js/         # Minified JavaScript bundles
   │   └── media/      # Images and other assets
   ├── index.html      # Main HTML file
   └── manifest.json   # Web app manifest
   ```

### Deployment Options

## Option 1: Static Hosting (Recommended)

### Netlify Deployment

1. **Connect Repository**
   ```bash
   # Connect GitHub repo to Netlify
   # Build command: npm run build
   # Publish directory: build
   ```

2. **Configure Build Settings**
   ```toml
   # netlify.toml
   [build]
     command = "npm run build"
     publish = "build"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

3. **Environment Variables**
   ```
   REACT_APP_ENVIRONMENT=production
   ```

### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Configuration**
   ```json
   // vercel.json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

### GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add Scripts**
   ```json
   // package.json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     },
     "homepage": "https://yourusername.github.io/CoreTex"
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

## Option 2: Server Deployment

### Nginx Configuration

1. **Install Nginx**
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. **Configure Site**
   ```nginx
   # /etc/nginx/sites-available/cortex
   server {
       listen 80;
       server_name your-domain.com;
       
       # Redirect HTTP to HTTPS
       return 301 https://$server_name$request_uri;
   }

   server {
       listen 443 ssl http2;
       server_name your-domain.com;

       # SSL Configuration
       ssl_certificate /path/to/certificate.crt;
       ssl_certificate_key /path/to/private.key;
       ssl_protocols TLSv1.2 TLSv1.3;
       ssl_ciphers HIGH:!aNULL:!MD5;

       # Document root
       root /var/www/cortex/build;
       index index.html;

       # Handle client-side routing
       location / {
           try_files $uri $uri/ /index.html;
       }

       # Cache static assets
       location /static/ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }

       # Security headers
       add_header X-Content-Type-Options nosniff;
       add_header X-Frame-Options DENY;
       add_header X-XSS-Protection "1; mode=block";
       add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
   }
   ```

3. **Deploy Files**
   ```bash
   # Copy build files to server
   scp -r build/* user@server:/var/www/cortex/build/
   
   # Enable site
   sudo ln -s /etc/nginx/sites-available/cortex /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### Apache Configuration

1. **Configure Virtual Host**
   ```apache
   # /etc/apache2/sites-available/cortex.conf
   <VirtualHost *:80>
       ServerName your-domain.com
       Redirect permanent / https://your-domain.com/
   </VirtualHost>

   <VirtualHost *:443>
       ServerName your-domain.com
       DocumentRoot /var/www/cortex/build

       # SSL Configuration
       SSLEngine on
       SSLCertificateFile /path/to/certificate.crt
       SSLCertificateKeyFile /path/to/private.key

       # Handle client-side routing
       <Directory "/var/www/cortex/build">
           Options -Indexes
           AllowOverride All
           Require all granted
           
           # Fallback to index.html for client-side routing
           FallbackResource /index.html
       </Directory>

       # Cache static assets
       <LocationMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
           ExpiresActive On
           ExpiresDefault "access plus 1 year"
       </LocationMatch>
   </VirtualHost>
   ```

2. **Enable Modules**
   ```bash
   sudo a2enmod ssl
   sudo a2enmod rewrite
   sudo a2enmod expires
   sudo a2ensite cortex
   sudo systemctl reload apache2
   ```

## Option 3: Docker Deployment

### Dockerfile

```dockerfile
# Build stage
FROM node:16-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy build files
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration for Docker

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;

        root /usr/share/nginx/html;
        index index.html;

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location /static/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

### Docker Commands

```bash
# Build image
docker build -t cortex:latest .

# Run container
docker run -d -p 80:80 --name cortex cortex:latest

# With SSL (mount certificates)
docker run -d -p 443:443 \
  -v /path/to/certs:/etc/nginx/certs \
  --name cortex cortex:latest
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  cortex:
    build: .
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /path/to/certs:/etc/nginx/certs
    restart: unless-stopped
    
  # Optional: Add reverse proxy
  nginx-proxy:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./proxy.conf:/etc/nginx/nginx.conf
      - /path/to/certs:/etc/nginx/certs
```

## Environment Configuration

### Production Environment Variables

```bash
# .env.production
REACT_APP_ENVIRONMENT=production
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_SENTRY_DSN=your-sentry-dsn
REACT_APP_GOOGLE_ANALYTICS_ID=your-ga-id
```

### Build-time Optimizations

```json
// package.json
{
  "scripts": {
    "build": "GENERATE_SOURCEMAP=false react-scripts build",
    "build:analyze": "npm run build && npx serve -s build"
  }
}
```

## Performance Optimizations

### Asset Optimization

1. **Image Optimization**
   ```bash
   # Install optimization tools
   npm install --save-dev imagemin imagemin-webp
   
   # Create optimized images
   npx imagemin public/images/* --out-dir=public/images/optimized
   ```

2. **Bundle Analysis**
   ```bash
   # Analyze bundle size
   npx webpack-bundle-analyzer build/static/js/*.js
   ```

### Caching Strategy

1. **Service Worker**
   ```javascript
   // public/sw.js
   const CACHE_NAME = 'cortex-v1';
   const urlsToCache = [
     '/',
     '/static/js/bundle.js',
     '/static/css/main.css'
   ];

   self.addEventListener('install', (event) => {
     event.waitUntil(
       caches.open(CACHE_NAME)
         .then((cache) => cache.addAll(urlsToCache))
     );
   });
   ```

2. **HTTP Caching Headers**
   ```nginx
   # Cache static assets
   location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
   }

   # Cache HTML with validation
   location ~* \.html$ {
       expires 0;
       add_header Cache-Control "public, must-revalidate";
   }
   ```

## Security Configuration

### HTTPS Setup

1. **Let's Encrypt Certificate**
   ```bash
   # Install Certbot
   sudo apt install certbot python3-certbot-nginx
   
   # Obtain certificate
   sudo certbot --nginx -d your-domain.com
   
   # Auto-renewal
   sudo crontab -e
   # Add: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

2. **Security Headers**
   ```nginx
   # Additional security headers
   add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; media-src 'self'";
   add_header Referrer-Policy "strict-origin-when-cross-origin";
   add_header Permissions-Policy "camera=(), microphone=(), geolocation=()";
   ```

## Monitoring and Maintenance

### Health Checks

```bash
#!/bin/bash
# health-check.sh

URL="https://your-domain.com"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $URL)

if [ $HTTP_STATUS -eq 200 ]; then
    echo "Site is up"
    exit 0
else
    echo "Site is down (HTTP $HTTP_STATUS)"
    exit 1
fi
```

### Log Monitoring

```nginx
# Custom log format
log_format cortex '$remote_addr - $remote_user [$time_local] '
                  '"$request" $status $body_bytes_sent '
                  '"$http_referer" "$http_user_agent" $request_time';

access_log /var/log/nginx/cortex_access.log cortex;
error_log /var/log/nginx/cortex_error.log;
```

### Backup Strategy

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups/cortex"
DATE=$(date +"%Y%m%d_%H%M%S")

# Backup application files
tar -czf "$BACKUP_DIR/cortex_$DATE.tar.gz" /var/www/cortex/

# Backup configuration
cp /etc/nginx/sites-available/cortex "$BACKUP_DIR/nginx_config_$DATE"

# Keep only last 30 days of backups
find $BACKUP_DIR -name "cortex_*.tar.gz" -mtime +30 -delete
```

## Troubleshooting

### Common Issues

**Camera not working:**
- Ensure HTTPS is configured
- Check browser permissions
- Verify certificate is valid

**Build fails:**
- Check Node.js version compatibility
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall

**Performance issues:**
- Enable gzip compression
- Optimize images
- Use CDN for static assets
- Monitor bundle size

### Debugging Production Issues

```bash
# Check nginx logs
sudo tail -f /var/log/nginx/error.log

# Check system resources
htop
df -h

# Test SSL configuration
curl -I https://your-domain.com
```

## Rollback Procedure

```bash
#!/bin/bash
# rollback.sh

BACKUP_DIR="/backups/cortex"
LATEST_BACKUP=$(ls -t $BACKUP_DIR/cortex_*.tar.gz | head -n1)

if [ -f "$LATEST_BACKUP" ]; then
    echo "Rolling back to $LATEST_BACKUP"
    tar -xzf "$LATEST_BACKUP" -C /
    sudo systemctl reload nginx
    echo "Rollback completed"
else
    echo "No backup found"
    exit 1
fi
```