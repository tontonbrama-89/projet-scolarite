const pool = require('../config/db');

// Obtenir toutes les notes (avec jointure vers matieres)
const getAllNotes = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                notes.id, 
                notes.eleve_id, 
                notes.note, 
                notes.date_evaluation, 
                notes.matiere_id, 
                matieres.nom AS matiere
            FROM notes
            LEFT JOIN matieres ON notes.matiere_id = matieres.id
            ORDER BY notes.id DESC
        `);

        res.json(result.rows);

    } catch (error) {
        console.error('Erreur récupération des notes :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Ajouter une nouvelle note
const addNote = async (req, res) => {
    const { eleve_id, matiere_id, note } = req.body;

    if (!eleve_id || !matiere_id || note === undefined) {
        return res.status(400).json({ error: 'Champs requis manquants' });
    }

    try {
        const result = await pool.query(`
            INSERT INTO notes (eleve_id, matiere_id, note)
            VALUES ($1, $2, $3)
            RETURNING *
        `, [eleve_id, matiere_id, note]);

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error('Erreur ajout de note :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

module.exports = {
    getAllNotes,
    addNote
};
