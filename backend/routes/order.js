const express = require('express');
const router = express.Router();

const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/auth');

router.route('/order/new').post(authMiddleware.isAuthenticatedUser, orderController.newOrder);

router.route('/order/:id').get(authMiddleware.isAuthenticatedUser, orderController.getSingleOrder);
router.route('/orders/me').get(authMiddleware.isAuthenticatedUser, orderController.myOrders);

router.route('/admin/orders').get(authMiddleware.isAuthenticatedUser, authMiddleware.authorizeRoles('admin'), orderController.allOrders);

module.exports = router;