#!/bin/bash

# Office 365 Invoice Search Tool - Deployment Script
# Usage: ./scripts/deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
APP_NAME="office365-invoice-search"

echo "🚀 Deploying Office 365 Invoice Search Tool..."
echo "Environment: $ENVIRONMENT"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p logs config

# Set permissions
chmod 755 logs

# Build and deploy
echo "🔨 Building Docker image..."
docker-compose build

echo "🚀 Starting containers..."
docker-compose up -d

# Wait for health check
echo "⏳ Waiting for application to be ready..."
sleep 30

# Check if application is running
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Application is running successfully!"
    echo "🌐 Frontend: http://localhost"
    echo "🔧 Backend API: http://localhost:3001"
    echo "📊 Health Check: http://localhost:3001/health"
else
    echo "❌ Application failed to start. Check logs:"
    docker-compose logs
    exit 1
fi

echo "🎉 Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Configure your Microsoft 365 tenant credentials in docker-compose.yml"
echo "2. Restart the application: docker-compose restart"
echo "3. Monitor logs: docker-compose logs -f"