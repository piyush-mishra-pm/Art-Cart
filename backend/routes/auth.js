const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

const authMiddleware = require('../middlewares/auth')

router.route('/register').post(authController.registerUser);
router.route('/login').post(authController.loginUser);
router.route('/logout').get(authController.logout);

router.route('/password/forgot').post(authController.forgotPassword);
router.route('/password/reset/:token').put(authController.resetPassword);

router.route('/me').get(authMiddleware.isAuthenticatedUser, authController.getUserProfile);
router.route('/password/update').put(authMiddleware.isAuthenticatedUser, authController.updatePassword);
router.route('/me/update').put(authMiddleware.isAuthenticatedUser, authController.updateProfile);

// ADMIN-Routes:
router.route('/admin/users').get(authMiddleware.isAuthenticatedUser, authMiddleware.authorizeRoles('admin'), authController.allUsers);

router.route('/admin/user/:id')
    .get(authMiddleware.isAuthenticatedUser, authMiddleware.authorizeRoles('admin'), authController.getUserDetails)
    .put(authMiddleware.isAuthenticatedUser, authMiddleware.authorizeRoles('admin'), authController.updateUser)
    .delete(authMiddleware.isAuthenticatedUser, authMiddleware.authorizeRoles('admin'), authController.deleteUser);


module.exports = router;