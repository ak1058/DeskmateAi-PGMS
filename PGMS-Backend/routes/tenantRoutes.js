const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenantController');

router.post('/register', tenantController.registerTenant);


router.post('/login', tenantController.loginTenant);

module.exports = router;
