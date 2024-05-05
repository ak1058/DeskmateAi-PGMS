const express = require('express');
const tenantController = require('../controllers/tenantController');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// Pass the Socket.IO instance when creating routes
module.exports = (io) => {
  const tenantPayRoutes = express.Router();
  const adminPayRoutes = express.Router();

  tenantPayRoutes.post('/cashPayment', authMiddleware, tenantController.setToPaymentRecords(io));
  adminPayRoutes.post('/approveCashPayment', authMiddleware, adminController.approveCashPayment(io));

  return { tenantPayRoutes, adminPayRoutes };
};
