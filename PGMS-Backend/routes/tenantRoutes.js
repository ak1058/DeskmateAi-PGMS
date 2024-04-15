const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenantController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', tenantController.registerTenant);
router.put('/registerForPg/:tenantId', tenantController.registerTenantForPG);
router.post('/login', tenantController.loginTenant);

router.post('/setToPaymentRecords', authMiddleware, tenantController.setToPaymentRecords);
router.get('/getPaymentsOfTenant', authMiddleware, tenantController.getPaymentRecordsByTenantId);

router.get('/payment', tenantController.handlePayment);
router.get('/redirect-url/:merchantTransactionId', tenantController.getResponse)

module.exports = router;
