# Office 365 Multi-Tenant Invoice Search Tool

A comprehensive admin tool for searching and managing Office 365 invoice details across multiple Microsoft 365 tenants using Microsoft Graph API.

## 🚀 Features

- **Multi-tenant Support**: Search invoices across multiple Office 365 tenants simultaneously
- **Advanced Filtering**: Filter by invoice number, amount, date ranges
- **Professional UI**: Modern React-based admin dashboard with responsive design
- **Secure API**: Express backend with rate limiting, validation, and security middleware
- **PDF Downloads**: Direct invoice PDF download functionality
- **Docker Deployment**: Ready-to-deploy Docker containers for AWS EC2
- **Comprehensive Logging**: Winston-based logging with different levels
- **Health Monitoring**: Built-in health checks and status endpoints

## 🏗️ Architecture

### Frontend (React + TypeScript)
- Modern React 18 with TypeScript
- Tailwind CSS with custom Office 365 design system
- Responsive design with mobile support
- Real-time search and filtering
- Toast notifications for user feedback

### Backend (Node.js + Express)
- Express.js with TypeScript
- Microsoft Graph API integration
- Multi-tenant authentication support
- Rate limiting and security middleware
- Comprehensive error handling and logging

## 📋 Prerequisites

### Microsoft 365 Setup
1. **Azure App Registration**: Create an App Registration in Azure AD for each tenant
2. **Required Permissions**: Grant the following application permissions:
   - `Billing.Read.All`
   - `Directory.Read.All` (for tenant information)
3. **Admin Consent**: Grant admin consent for all permissions
4. **Client Secrets**: Create client secrets for each app registration

### Development Environment
- Node.js 18+ 
- npm or yarn
- Docker (for containerized deployment)
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd office365-invoice-search
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```

### 3. Configure Environment Variables
Edit `backend/.env` with your Microsoft 365 tenant details:

```env
# Server Configuration
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173

# Primary Tenant
TENANT_ID=your-tenant-id-here
CLIENT_ID=your-client-id-here
CLIENT_SECRET=your-client-secret-here
TENANT_NAME=Primary Tenant

# Additional Tenants (optional)
TENANT_1_ID=tenant-1-id
TENANT_1_CLIENT_ID=tenant-1-client-id
TENANT_1_CLIENT_SECRET=tenant-1-client-secret
TENANT_1_NAME=Tenant 1
```

### 4. Frontend Setup
```bash
# In the root directory
npm install
```

### 5. Development Mode
```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
npm run dev
```

Visit `http://localhost:5173` to access the application.

## 🐳 Docker Deployment

### Local Docker Build
```bash
# Build the Docker image
docker build -t office365-invoice-search .

# Run with Docker Compose
docker-compose up -d
```

### Production Deployment on AWS EC2

#### 1. EC2 Instance Setup
```bash
# Launch Amazon Linux 2 or Ubuntu instance
# Install Docker
sudo yum update -y
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### 2. Application Deployment
```bash
# Clone repository on EC2
git clone <repository-url>
cd office365-invoice-search

# Configure environment variables
cp docker-compose.yml docker-compose.prod.yml
# Edit docker-compose.prod.yml with your tenant configurations

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

#### 3. Security Group Configuration
- **Port 80**: HTTP access for frontend
- **Port 443**: HTTPS (recommended with reverse proxy)
- **Port 22**: SSH access (restrict to your IP)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (development/production) | No |
| `PORT` | Backend server port | No |
| `FRONTEND_URL` | Frontend URL for CORS | No |
| `TENANT_ID` | Primary tenant ID | Yes |
| `CLIENT_ID` | App registration client ID | Yes |
| `CLIENT_SECRET` | App registration client secret | Yes |
| `TENANT_NAME` | Display name for tenant | No |
| `API_KEY` | API key for additional security | No |
| `LOG_LEVEL` | Logging level (error/warn/info/debug) | No |

### Multi-Tenant Configuration
For multiple tenants, use numbered environment variables:
```env
TENANT_1_ID=tenant-1-id
TENANT_1_CLIENT_ID=tenant-1-client-id
TENANT_1_CLIENT_SECRET=tenant-1-client-secret
TENANT_1_NAME=Tenant 1

TENANT_2_ID=tenant-2-id
TENANT_2_CLIENT_ID=tenant-2-client-id
TENANT_2_CLIENT_SECRET=tenant-2-client-secret
TENANT_2_NAME=Tenant 2
```

## 📊 API Endpoints

### Invoice Search
```
GET /api/invoices/search
Query Parameters:
- invoiceNumber: string (optional)
- amount: number (optional)
- dateFrom: ISO date string (optional)
- dateTo: ISO date string (optional)
```

### Invoice Download
```
GET /api/invoices/download/:invoiceId
```

### Tenant Status
```
GET /api/invoices/tenants/status
```

### Health Check
```
GET /health
```

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Configurable CORS policies
- **Helmet Security**: Security headers and protections
- **Environment Isolation**: Secure environment variable handling
- **Request Logging**: Comprehensive request/response logging

## 📱 Frontend Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Search**: Instant search across all tenants
- **Status Indicators**: Visual status indicators for paid/unpaid invoices
- **Download Management**: Secure PDF download handling
- **Error Handling**: User-friendly error messages and retry options
- **Loading States**: Professional loading indicators

## 🔍 Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify tenant IDs and client credentials
   - Check app registration permissions
   - Ensure admin consent is granted

2. **API Rate Limits**
   - Microsoft Graph has rate limits
   - Implement exponential backoff in production

3. **Docker Issues**
   - Ensure ports 80 and 3001 are available
   - Check Docker daemon is running
   - Verify environment variables in docker-compose.yml

### Logs
```bash
# View application logs
docker-compose logs -f

# Backend logs only
docker-compose logs -f office365-invoice-search
```

## 🚀 Production Considerations

1. **Reverse Proxy**: Use nginx or Apache for SSL termination
2. **SSL Certificate**: Implement HTTPS with Let's Encrypt
3. **Monitoring**: Add application monitoring (e.g., DataDog, New Relic)
4. **Backup**: Regular backup of logs and configuration
5. **Scaling**: Consider load balancing for high traffic

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

Built with ❤️ for Office 365 administrators