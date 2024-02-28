const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenantController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', tenantController.registerTenant);
router.post('/login', tenantController.loginTenant);

router.post('/setToPaymentRecords', authMiddleware, tenantController.setToPaymentRecords);
router.get('/getPaymentsOfTenant', authMiddleware, tenantController.getPaymentRecordsByTenantId);

module.exports = router;
