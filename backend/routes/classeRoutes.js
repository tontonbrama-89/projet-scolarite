const express = require('express');
const router = express.Router();
const classeController = require('../controllers/classeController');

// Routes classes
router.get('/', classeController.getAllClasses);
router.post('/', classeController.addClasse);

module.exports = router;
