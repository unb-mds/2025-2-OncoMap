// backend/src/routes/mapRoutes.js
const express = require('express');
const router = express.Router();
// Importamos o NOVO controller
const mockController = require('../controllers/mockController');

// A URL é a mesma, mas a lógica por trás é diferente
router.get('/summary/region/:regionName', mockController.getRegionSummary);
router.get('/details/municipality/:ibgeCode', mockController.getMunicipalityDetails);

module.exports = router;