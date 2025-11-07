const express = require('express');
const router = express.Router();
const { generateMap } = require('../controllers/mapController');


router.post('/generate-map', generateMap);

module.exports = router;