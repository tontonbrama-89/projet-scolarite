const express = require('express');
const router = express.Router();
const enseignantController = require('../controllers/enseignantController');

router.get('/', enseignantController.getAllEnseignants);
router.get('/:id', enseignantController.getEnseignantById);
router.post('/', enseignantController.addEnseignant);
router.put('/:id', enseignantController.updateEnseignant);
router.delete('/:id', enseignantController.deleteEnseignant);

module.exports = router;
