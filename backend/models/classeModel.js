const pool = require('../config/db');

// Récupérer toutes les classes
const getAllClasses = async () => {
  const result = await pool.query('SELECT * FROM classes ORDER BY id ASC');
  return result.rows;
};

// Ajouter une nouvelle classe
const addClasse = async (nom) => {
  const result = await pool.query(
    'INSERT INTO classes (nom) VALUES ($1) RETURNING *',
    [nom]
  );
  return result.rows[0];
};

module.exports = {
  getAllClasses,
  addClasse,
};
