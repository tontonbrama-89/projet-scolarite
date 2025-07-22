const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

// Liste de toutes les notes
router.get('/', noteController.getAllNotes);

// Ajout d'une note
router.post('/', noteController.addNote);

module.exports = router;
