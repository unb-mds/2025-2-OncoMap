const express = require('express');
const router = express.Router();
const statsController = require('../api/controllers/statsController');

router.get('/general', statsController.getGeneralStats); 

router.get('/state/:uf', statsController.getStateSpecificStats);

router.get('/municipality/:ibge', statsController.getMunicipalitySpecificStats);

module.exports = router;