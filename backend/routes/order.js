const express = require('express');
const router = express.Router();

const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/auth');

router.route('/order/new').post(authMiddleware.isAuthenticatedUser, orderController.newOrder);

module.exports = router;