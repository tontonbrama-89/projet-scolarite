const express = require('express');
const router = express.Router();
const bulletinController = require('../controllers/bulletinController');

// Route : Générer le bulletin PDF par ID élève
router.get('/:id', bulletinController.getBulletinByEleveId);

module.exports = router;
