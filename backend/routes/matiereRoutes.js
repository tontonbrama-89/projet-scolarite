const express = require('express');
const router = express.Router();
const matiereController = require('../controllers/matiereController');

router.get('/', matiereController.getMatieres);
router.post('/', matiereController.addMatiere);
router.delete('/:id', matiereController.deleteMatiere);

module.exports = router;
