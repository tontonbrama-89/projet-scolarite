const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const apiKeyMiddleware = require('../middlewares/apiKeyMiddleware');

// ✅ Middleware : clé API obligatoire
router.use(apiKeyMiddleware);

// 📥 Téléchargement sécurisé du reçu PDF
router.get('/:id', (req, res) => {
    const id = req.params.id;
    const filePath = path.join(__dirname, '..', 'receipts', `recu_paiement_${id}.pdf`);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Reçu introuvable pour cet ID' });
    }

    res.download(filePath, `recu_paiement_${id}.pdf`, (err) => {
        if (err) {
            console.error("❌ Erreur envoi fichier :", err);
            return res.status(500).json({ error: 'Erreur lors du téléchargement du fichier' });
        }
    });
});

module.exports = router;
