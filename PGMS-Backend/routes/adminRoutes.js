const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const paymentController = require('../controllers/paymentController')

const configureRoutes = (io) => {
router.post('/register', adminController.registerAdmin);
router.post('/login', adminController.loginAdmin);
router.post('/pg/setup', authMiddleware, adminController.setupPG);
// adminRoutes.js
router.post('/approveCashPayment', paymentController.approveCashPayment(io));
router.get('/pendingCashPayments', paymentController.getPendingCashPayments);

//totalexpectedrent
router.get('/totalRent/:pgId', paymentController.getTotalExpectedRent)
//totalpaidrentbymonth
router.get('/paidRentInfo/:pgId', paymentController.getPaidRentInfo);

return router;
};

module.exports = configureRoutes;
