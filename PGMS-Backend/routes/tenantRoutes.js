// tenantRoutes.js
const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenantController');
const authMiddleware = require('../middleware/authMiddleware');
const paymentController = require('../controllers/paymentController');

// Passing `io` instance to routes
const configureRoutes = (io) => {
  router.post('/register', tenantController.registerTenant);
  router.put('/registerForPg/:tenantId', tenantController.registerTenantForPG);
  router.post('/login', tenantController.loginTenant);

  router.post('/setToPaymentRecords', authMiddleware, tenantController.setToPaymentRecords);
  router.get('/getPaymentsOfTenant', authMiddleware, tenantController.getPaymentRecordsByTenantId);

  router.get('/payment', tenantController.handlePayment);
  router.get('/redirect-url/:merchantTransactionId', tenantController.getResponse);

  // Pass `io` to the paymentController
  router.post('/cashPayment', paymentController.setToPaymentRecords(io));
  router.get('/transactions/:tenantId', paymentController.getTenantTransactions);
  
  return router;
};

module.exports = configureRoutes;
