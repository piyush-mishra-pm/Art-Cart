const express = require('express');
const router = express.Router();

const { getAllProducts, newProduct } = require('../controllers/productController');

router.route('/allproducts').get(getAllProducts);
router.route('/product/new').post(newProduct);

module.exports = router;