const express = require('express');
const router = express.Router();
const reportController = require('../api/controllers/reportController');

router.get('/region/:regionName/pdf', reportController.generateRegionReport);

router.get('/state/:uf/pdf', reportController.generateStateReport);

router.get('/municipality/:ibge/pdf', reportController.generateMunicipalityReport);

module.exports = router;