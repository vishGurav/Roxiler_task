const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');



router.get('/initialize', productController.initializeDatabase);

router.get('/transactions', productController.getTransactions);

router.get('/statistics', productController.getStatistics);

router.get('/bar-chart', productController.getBarChartData);

router.get('/pie-chart', productController.getPieChartData);

router.get('/combined-data', productController.getCombinedData);

module.exports = router;
