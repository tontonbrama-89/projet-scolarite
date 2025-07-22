const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// 📊 Route : /api/stats
router.get('/', async (req, res) => {
    try {
        const totalPaiements = await pool.query('SELECT COALESCE(SUM(montant), 0) AS total FROM paiements');
        const totalEleves = await pool.query('SELECT COUNT(*) FROM eleves');
        const totalEnseignants = await pool.query('SELECT COUNT(*) FROM enseignants');

        res.json({
            total_encaissé: parseFloat(totalPaiements.rows[0].total),
            total_eleves: parseInt(totalEleves.rows[0].count),
            total_enseignants: parseInt(totalEnseignants.rows[0].count)
        });

    } catch (error) {
        console.error('Erreur API /stats :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;
