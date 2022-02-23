const express = require('express');
const router = express.Router();

const {
    getAllProducts,
    newProduct,
    getSingleProduct,
    updateSingleProduct,
    deleteSingleProduct,
    createProductReview,
} = require('../controllers/productController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/allproducts').get(getAllProducts);
router.route('/product/:id').get(getSingleProduct);

router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRoles('admin'), newProduct);
router.route('/admin/product/:id')
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateSingleProduct)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteSingleProduct);

router
    .route('/product/review')
    .put(isAuthenticatedUser, createProductReview);

module.exports = router;