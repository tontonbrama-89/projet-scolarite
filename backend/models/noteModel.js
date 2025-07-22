const pool = require('../config/db');

// ➕ Ajouter une note
const addNote = async (eleve_id, matiere_id, note) => {
    const result = await pool.query(
        'INSERT INTO notes (eleve_id, matiere_id, note) VALUES ($1, $2, $3) RETURNING *',
        [eleve_id, matiere_id, note]
    );
    return result.rows[0];
};

// 📋 Récupérer les notes d'un élève avec les matières officielles
const getNotesByEleve = async (eleve_id) => {
    const result = await pool.query(`
        SELECT n.id, m.nom AS matiere, n.note, n.date_evaluation
        FROM notes n
        JOIN matieres m ON n.matiere_id = m.id
        WHERE n.eleve_id = $1
        ORDER BY m.nom ASC
    `, [eleve_id]);
    return result.rows;
};

module.exports = {
    addNote,
    getNotesByEleve
};
