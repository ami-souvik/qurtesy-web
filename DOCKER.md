# Docker Setup for Qurtesy Web Application

This document explains how to containerize and run the Qurtesy web application using Docker.

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- At least 2GB free disk space

## 🚀 Quick Start

### Development Environment

```bash
# Start development server with hot reloading
./docker.sh dev

# Or manually:
docker-compose --profile dev up --build
```

Access the application at: http://localhost:3000

### Production Environment

```bash
# Build and start production server
./docker.sh prod

# Or manually:
docker build -t qurtesy-web:latest .
docker-compose --profile prod up -d
```

Access the application at: http://localhost

## 📁 Docker Files Overview

### Core Files

- **Dockerfile** - Multi-stage production build with Nginx
- **Dockerfile.dev** - Development container with hot reloading
- **docker-compose.yml** - Orchestration for dev/prod environments
- **.dockerignore** - Excludes unnecessary files from build context
- **docker.sh** - Helper script for common operations

### Build Process

1. **Build Stage**: Uses Node.js Alpine to install dependencies and build
2. **Production Stage**: Uses Nginx Alpine to serve static files
3. **Optimization**: Includes gzip compression, caching headers, and security headers

## 🛠️ Available Commands

Using the helper script `./docker.sh`:

| Command | Description                                      |
| ------- | ------------------------------------------------ |
| `dev`   | Start development environment with hot reloading |
| `build` | Build production Docker image                    |
| `prod`  | Build and start production environment           |
| `stop`  | Stop all running containers                      |
| `clean` | Remove all containers and images                 |
| `logs`  | Show container logs (follow mode)                |
| `shell` | Open shell in running container                  |
| `help`  | Show available commands                          |

## 🔧 Manual Docker Commands

### Development

```bash
# Build development image
docker build -f Dockerfile.dev -t qurtesy-web:dev .

# Run development container
docker run -p 3000:5173 -v $(pwd):/app -v /app/node_modules qurtesy-web:dev

# Start with docker-compose
docker-compose --profile dev up --build
```

### Production

```bash
# Build production image
docker build -t qurtesy-web:latest .

# Run production container
docker run -p 80:80 qurtesy-web:latest

# Start with docker-compose
docker-compose --profile prod up -d
```

## 🌍 Environment Configurations

### Development Features

- Hot module reloading (HMR)
- Source maps enabled
- Volume mounting for live code changes
- Development dependencies included

### Production Features

- Optimized build with tree-shaking
- Static file serving via Nginx
- Gzip compression enabled
- Security headers configured
- Client-side routing support
- Asset caching (1 year for static assets)

## 🔍 Troubleshooting

### Common Issues

**Port already in use:**

```bash
# Check what's using the port
lsof -i :80  # or :3000 for dev
# Stop the conflicting service or use different port
docker run -p 8080:80 qurtesy-web:latest
```

**Build fails with memory issues:**

```bash
# Increase Docker memory limit in Docker Desktop
# Or build with limited parallelism
docker build --memory=2g --cpus=2 -t qurtesy-web:latest .
```

**Permission issues on macOS/Linux:**

```bash
# Make sure docker.sh is executable
chmod +x docker.sh

# Fix volume permissions if needed
sudo chown -R $(id -u):$(id -g) node_modules
```

### Logs and Debugging

```bash
# View container logs
docker-compose logs -f qurtesy-web

# Check container status
docker-compose ps

# Inspect container
docker inspect qurtesy-web

# Open shell in container
./docker.sh shell
```

## 📊 Performance Tips

### Build Optimization

- Uses multi-stage builds to reduce final image size
- Layer caching optimized (package.json copied first)
- .dockerignore excludes unnecessary files

### Runtime Optimization

- Nginx configured for optimal static file serving
- Gzip compression for smaller transfers
- Proper caching headers for browser optimization

### Development Experience

- Volume mounting for instant code changes
- Preserved node_modules for faster rebuilds

## 🔐 Security Considerations

### Nginx Security Headers

- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- X-XSS-Protection: enabled
- Content-Security-Policy: configured
- Referrer-Policy: no-referrer-when-downgrade

### Container Security

- Uses Alpine Linux (smaller attack surface)
- Non-root user in production
- Minimal production dependencies

## 📦 Image Sizes

- **Development**: ~500MB (includes dev dependencies)
- **Production**: ~25MB (Alpine + Nginx + built assets)

## 🚀 Deployment Options

### Local Development

```bash
./docker.sh dev
```

### Production Deployment

```bash
# Build and run locally
./docker.sh prod

# For cloud deployment, push to registry:
docker tag qurtesy-web:latest your-registry/qurtesy-web:latest
docker push your-registry/qurtesy-web:latest
```

### Alternative Ports

Edit `docker-compose.yml` to change ports:

```yaml
ports:
  - '8080:80' # External:Internal
```

---

For more information about the application itself, see the main README.md file.
