const express = require('express');
const router = express.Router();

const { 
    getAllProducts, 
    newProduct, 
    getSingleProduct, 
    updateSingleProduct, 
    deleteSingleProduct 
} = require('../controllers/productController');

const { isAuthenticatedUser } = require('../middlewares/auth');

router.route('/allproducts').get(getAllProducts);
router.route('/product/:id').get(getSingleProduct);

router.route('/admin/product/new').post(isAuthenticatedUser, newProduct);
router.route('/admin/product/:id')
    .put(isAuthenticatedUser, updateSingleProduct)
    .delete(isAuthenticatedUser, deleteSingleProduct);

module.exports = router;