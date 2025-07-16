#!/bin/bash

# AWS EC2 Setup Script for Office 365 Invoice Search Tool
# Run this script on a fresh Amazon Linux 2 or Ubuntu instance

set -e

echo "🚀 Setting up AWS EC2 for Office 365 Invoice Search Tool..."

# Detect OS
if [ -f /etc/amazon-linux-release ]; then
    OS="amazon-linux"
elif [ -f /etc/lsb-release ]; then
    OS="ubuntu"
else
    echo "❌ Unsupported operating system"
    exit 1
fi

echo "📋 Detected OS: $OS"

# Update system
echo "📦 Updating system packages..."
if [ "$OS" = "amazon-linux" ]; then
    sudo yum update -y
elif [ "$OS" = "ubuntu" ]; then
    sudo apt-get update -y
    sudo apt-get upgrade -y
fi

# Install Docker
echo "🐳 Installing Docker..."
if [ "$OS" = "amazon-linux" ]; then
    sudo yum install -y docker
    sudo service docker start
    sudo systemctl enable docker
    sudo usermod -a -G docker ec2-user
elif [ "$OS" = "ubuntu" ]; then
    sudo apt-get install -y docker.io
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -a -G docker ubuntu
fi

# Install Docker Compose
echo "🔧 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Git
echo "📦 Installing Git..."
if [ "$OS" = "amazon-linux" ]; then
    sudo yum install -y git
elif [ "$OS" = "ubuntu" ]; then
    sudo apt-get install -y git
fi

# Install nginx (optional, for reverse proxy)
echo "🌐 Installing nginx..."
if [ "$OS" = "amazon-linux" ]; then
    sudo amazon-linux-extras install -y nginx1
elif [ "$OS" = "ubuntu" ]; then
    sudo apt-get install -y nginx
fi

# Configure firewall
echo "🔒 Configuring firewall..."
if [ "$OS" = "amazon-linux" ]; then
    # Amazon Linux typically uses Security Groups, not local firewall
    echo "Configure Security Groups in AWS Console:"
    echo "- Port 22: SSH (your IP only)"
    echo "- Port 80: HTTP"
    echo "- Port 443: HTTPS"
elif [ "$OS" = "ubuntu" ]; then
    sudo ufw allow ssh
    sudo ufw allow 80
    sudo ufw allow 443
    sudo ufw --force enable
fi

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /opt/office365-invoice-search
sudo chown $USER:$USER /opt/office365-invoice-search

# Create systemd service for auto-start
echo "⚙️ Creating systemd service..."
sudo tee /etc/systemd/system/office365-invoice-search.service > /dev/null <<EOF
[Unit]
Description=Office 365 Invoice Search Tool
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/office365-invoice-search
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable office365-invoice-search

echo "✅ EC2 setup complete!"
echo ""
echo "Next steps:"
echo "1. Clone your repository to /opt/office365-invoice-search"
echo "2. Configure environment variables in docker-compose.yml"
echo "3. Start the service: sudo systemctl start office365-invoice-search"
echo "4. Check status: sudo systemctl status office365-invoice-search"
echo ""
echo "Optional: Set up SSL with Let's Encrypt:"
echo "sudo certbot --nginx -d your-domain.com"