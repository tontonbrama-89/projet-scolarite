const pool = require('../config/db');

// Suivi de scolarité par élève
const getScolariteByEleve = async (req, res) => {
    const eleveId = parseInt(req.params.id);

    if (isNaN(eleveId)) {
        return res.status(400).json({ error: 'ID invalide' });
    }

    try {
        // Récupérer montant total prévu
        const scolariteQuery = await pool.query(
            'SELECT montant_total FROM scolarites WHERE eleve_id = $1',
            [eleveId]
        );

        if (scolariteQuery.rows.length === 0) {
            return res.status(404).json({ error: 'Scolarité non définie pour cet élève' });
        }

        const montantTotal = parseFloat(scolariteQuery.rows[0].montant_total);

        // Total déjà payé
        const paiementQuery = await pool.query(
            'SELECT COALESCE(SUM(montant), 0) AS total_paye FROM paiements WHERE eleve_id = $1',
            [eleveId]
        );

        const totalPaye = parseFloat(paiementQuery.rows[0].total_paye);

        const resteAPayer = montantTotal - totalPaye;

        res.json({
            eleve_id: eleveId,
            montant_total: montantTotal,
            total_paye: totalPaye,
            reste_a_payer: resteAPayer < 0 ? 0 : resteAPayer
        });

    } catch (error) {
        console.error('Erreur suivi scolarité:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

module.exports = { getScolariteByEleve };
