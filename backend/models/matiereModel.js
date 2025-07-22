const pool = require('../config/db');

// Lister toutes les matières
const getAllMatieres = async () => {
    const result = await pool.query('SELECT * FROM matieres ORDER BY nom ASC');
    return result.rows;
};

// Ajouter une matière
const addMatiere = async (nom) => {
    const result = await pool.query(
        'INSERT INTO matieres (nom) VALUES ($1) RETURNING *',
        [nom]
    );
    return result.rows[0];
};

// Supprimer une matière
const deleteMatiere = async (id) => {
    await pool.query('DELETE FROM matieres WHERE id = $1', [id]);
};

module.exports = {
    getAllMatieres,
    addMatiere,
    deleteMatiere
};
