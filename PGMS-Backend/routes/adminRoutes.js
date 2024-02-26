const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', adminController.registerAdmin);
router.post('/login', adminController.loginAdmin);
router.post('/pg/setup', authMiddleware, adminController.setupPG);

module.exports = router;
