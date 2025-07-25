import express, { Request, Response, NextFunction } from 'express';
import { body, query, validationResult } from 'express-validator';
import { GraphService } from '../services/graphService';
import { logger } from '../utils/logger';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Validation middleware
const validateSearchParams = [
  query('invoiceNumber').optional().isString().trim(),
  query('amount').optional().isNumeric(),
  query('dateFrom').optional().isISO8601().toDate(),
  query('dateTo').optional().isISO8601().toDate(),
];

// Search invoices across all tenants
router.get('/search', validateSearchParams, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
      return;
    }

    const { invoiceNumber, amount, dateFrom, dateTo } = req.query;

    logger.info('Invoice search request', {
      filters: { invoiceNumber, amount, dateFrom, dateTo },
      ip: req.ip
    });

    const graphService = new GraphService();
    const results = await graphService.searchInvoicesAcrossAllTenants({
      invoiceNumber: invoiceNumber as string,
      amount: amount ? parseFloat(amount as string) : undefined,
      dateFrom: dateFrom as Date | undefined,
      dateTo: dateTo as Date | undefined
    });

    logger.info('Search completed', {
      invoicesFound: results.invoices.length,
      tenantsSearched: results.tenantsSearched
    });

    res.json(results);
  } catch (error) {
    logger.error('Invoice search failed', error);
    next(error);
  }
});

// Download specific invoice
router.get('/download/:invoiceId', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { invoiceId } = req.params;

    if (!invoiceId) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Invoice ID is required'
      });
      return;
    }

    logger.info('Invoice download request', { invoiceId, ip: req.ip });

    const graphService = new GraphService();
    const downloadData = await graphService.downloadInvoice(invoiceId);

    if (!downloadData) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Invoice not found or download not available'
      });
      return;
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoiceId}.pdf"`);
    res.send(downloadData);

  } catch (error) {
    logger.error('Invoice download failed', { invoiceId: req.params.invoiceId, error });
    next(error);
  }
});

// Get tenant status
router.get('/tenants/status', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const graphService = new GraphService();
    const tenantStatus = await graphService.getTenantStatus();

    res.json({
      tenants: tenantStatus,
      totalTenants: tenantStatus.length,
      activeTenants: tenantStatus.filter(t => t.status === 'active').length
    });
  } catch (error) {
    logger.error('Failed to get tenant status', error);
    next(error);
  }
});

export { router as invoiceRoutes };