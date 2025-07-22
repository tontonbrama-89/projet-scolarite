const express = require('express');
const router = express.Router();
const scolariteController = require('../controllers/scolariteController');

router.get('/:id', scolariteController.getScolariteByEleve);

module.exports = router;
