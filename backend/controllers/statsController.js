const pool = require('../config/db');

// Nombre total d'élèves
const getTotalEleves = async (req, res) => {
    try {
        const result = await pool.query('SELECT COUNT(*) AS total_eleves FROM eleves');
        res.json({ total_eleves: parseInt(result.rows[0].total_eleves) });
    } catch (error) {
        console.error('Erreur total élèves :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Total paiements et montant encaissé
const getStatsPaiements = async (req, res) => {
    try {
        const totalPaiementsQuery = await pool.query('SELECT COUNT(*) AS total_paiements FROM paiements');
        const totalMontantQuery = await pool.query('SELECT COALESCE(SUM(montant), 0) AS total_montant FROM paiements');

        res.json({
            total_paiements: parseInt(totalPaiementsQuery.rows[0].total_paiements),
            total_montant: parseFloat(totalMontantQuery.rows[0].total_montant)
        });
    } catch (error) {
        console.error('Erreur stats paiements :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

module.exports = { getTotalEleves, getStatsPaiements };
