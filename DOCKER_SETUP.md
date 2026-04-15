# BookNest Docker Deployment Guide

This directory supports Docker deployment for easier multi-device setup.

## Prerequisites

- Docker installed: https://www.docker.com/products/docker-desktop
- Docker Compose (included with Docker Desktop)

## Quick Start

### Build the Docker Image

```bash
docker build -t booknest:latest .
```

### Run with Docker Compose

```bash
docker-compose up
```

This will:
- Start API server on port 3001
- Start Frontend (Vite) on port 5173
- Mount volumes for live code updates

### Access the Application

- **Frontend:** http://localhost:5173/
- **API:** http://127.0.0.1:3001/

### Stop Services

```bash
docker-compose down
```

## Benefits

✅ **Identical environment** across all devices  
✅ **Easy scaling** if needed  
✅ **No dependency conflicts** (Node.js, npm versions)  
✅ **Portable** – same configuration everywhere

## Troubleshooting

### Port already in use

Change ports in `docker-compose.yml`:
```yaml
ports:
  - "5173:5173"  # Change first number
  - "3001:3001"  # Change first number
```

### Rebuild without cache

```bash
docker-compose build --no-cache
```

### View logs

```bash
docker-compose logs -f
```

For manual Docker setup, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
