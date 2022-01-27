const express = require('express');
const router = express.Router();

const { 
    getAllProducts, 
    newProduct, 
    getSingleProduct, 
    updateSingleProduct, 
    deleteSingleProduct 
} = require('../controllers/productController');

router.route('/allproducts').get(getAllProducts);
router.route('/product/:id').get(getSingleProduct);

router.route('/admin/product/new').post(newProduct);
router.route('/admin/product/:id')
    .put(updateSingleProduct)
    .delete(deleteSingleProduct);

module.exports = router;