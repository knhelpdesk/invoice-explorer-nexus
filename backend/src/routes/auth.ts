import express from 'express';
import { logger } from '../utils/logger';

const router = express.Router();

// Basic authentication status endpoint
router.get('/status', (req, res) => {
  res.json({
    authenticated: true,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Tenant configuration endpoint (for admin verification)
router.get('/tenants', (req, res) => {
  // Return tenant names without sensitive information
  const tenantCount = Object.keys(process.env)
    .filter(key => key.match(/^TENANT_\d+_ID$/))
    .length;

  res.json({
    totalTenants: tenantCount || (process.env.TENANT_ID ? 1 : 0),
    configured: tenantCount > 0 || !!process.env.TENANT_ID
  });
});

export { router as authRoutes };