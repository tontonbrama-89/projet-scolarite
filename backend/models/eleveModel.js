const pool = require('../config/db');

// Récupérer tous les élèves
const getAllEleves = async () => {
  const result = await pool.query('SELECT * FROM eleves ORDER BY id ASC');
  return result.rows;
};

// Récupérer un élève par ID
const getEleveById = async (id) => {
  const result = await pool.query('SELECT * FROM eleves WHERE id = $1', [id]);
  return result.rows[0];
};

// Ajouter un élève
const addEleve = async (nom, prenom, classe) => {
  const result = await pool.query(
    'INSERT INTO eleves (nom, prenom, classe) VALUES ($1, $2, $3) RETURNING *',
    [nom, prenom, classe]
  );
  return result.rows[0];
};

// Modifier un élève
const updateEleve = async (id, nom, prenom, classe) => {
  const result = await pool.query(
    'UPDATE eleves SET nom = $1, prenom = $2, classe = $3 WHERE id = $4 RETURNING *',
    [nom, prenom, classe, id]
  );
  return result.rows[0];
};

// Supprimer un élève
const deleteEleve = async (id) => {
  const result = await pool.query('DELETE FROM eleves WHERE id = $1', [id]);
  return result.rowCount > 0;
};

module.exports = {
  getAllEleves,
  getEleveById,
  addEleve,
  updateEleve,
  deleteEleve
};
