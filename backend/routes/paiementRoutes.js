const express = require('express');
const router = express.Router();
const paiementController = require('../controllers/paiementController');

// 📋 Liste de tous les paiements (tous élèves confondus)
router.get('/', paiementController.getAllPaiements);

// 📊 Historique des paiements + total payé pour un élève donné
router.get('/eleve/:eleve_id', paiementController.getPaiementsByEleveId);

// 🧾 Génération du reçu PDF (enregistrement + téléchargement)
// ⚠️ Cette route doit être définie avant '/:id' pour éviter les conflits
router.get('/:id/recu', paiementController.generateRecu);

// 🔍 Détail d'un paiement unique (par ID de paiement)
router.get('/:id', paiementController.getPaiementById);

// ➕ Création d'un nouveau paiement
router.post('/', paiementController.addPaiement);

// ✏️ Modification d'un paiement existant
router.put('/:id', paiementController.updatePaiement);

// ❌ Suppression d'un paiement
router.delete('/:id', paiementController.deletePaiement);

module.exports = router;
