#!/bin/bash

# Docker management script for Qurtesy Web Application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  dev         Start development environment"
    echo "  build       Build production image"
    echo "  prod        Start production environment"
    echo "  stop        Stop all containers"
    echo "  clean       Remove containers and images"
    echo "  logs        Show container logs"
    echo "  shell       Open shell in running container"
    echo "  help        Show this help message"
}

# Function to build production image
build_production() {
    print_status "Building production Docker image..."
    docker build -t qurtesy-web:latest .
    print_success "Production image built successfully!"
}

# Function to start development environment
start_dev() {
    print_status "Starting development environment..."
    docker-compose --profile dev up --build
}

# Function to start production environment
start_prod() {
    print_status "Starting production environment..."
    docker-compose --profile prod up -d
    print_success "Production environment started on http://localhost"
}

# Function to stop all containers
stop_containers() {
    print_status "Stopping all containers..."
    docker-compose down
    print_success "All containers stopped!"
}

# Function to clean up
clean_up() {
    print_warning "This will remove all containers and images. Continue? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Cleaning up containers and images..."
        docker-compose down --rmi all --volumes --remove-orphans
        print_success "Cleanup completed!"
    else
        print_status "Cleanup cancelled."
    fi
}

# Function to show logs
show_logs() {
    docker-compose logs -f
}

# Function to open shell
open_shell() {
    container_id=$(docker-compose ps -q qurtesy-web 2>/dev/null || docker-compose ps -q qurtesy-web-dev 2>/dev/null)
    if [ -n "$container_id" ]; then
        print_status "Opening shell in container..."
        docker exec -it "$container_id" /bin/sh
    else
        print_error "No running container found. Start the application first."
        exit 1
    fi
}

# Main script logic
case "${1:-help}" in
    "dev")
        start_dev
        ;;
    "build")
        build_production
        ;;
    "prod")
        build_production
        start_prod
        ;;
    "stop")
        stop_containers
        ;;
    "clean")
        clean_up
        ;;
    "logs")
        show_logs
        ;;
    "shell")
        open_shell
        ;;
    "help"|*)
        show_usage
        ;;
esac
