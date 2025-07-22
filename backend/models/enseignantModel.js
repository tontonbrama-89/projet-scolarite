const pool = require('../config/db');

const Enseignant = {
  getAll: async () => {
    const result = await pool.query('SELECT * FROM enseignants');
    return result.rows;
  },

  getById: async (id) => {
    const result = await pool.query('SELECT * FROM enseignants WHERE id = $1', [id]);
    return result.rows[0];
  },

  create: async ({ nom, prenom, email, classe_id }) => {
    const result = await pool.query(
      'INSERT INTO enseignants (nom, prenom, email, classe_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [nom, prenom, email, classe_id]
    );
    return result.rows[0];
  },

  update: async (id, { nom, prenom, email, classe_id }) => {
    const result = await pool.query(
      'UPDATE enseignants SET nom = $1, prenom = $2, email = $3, classe_id = $4 WHERE id = $5 RETURNING *',
      [nom, prenom, email, classe_id, id]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    const result = await pool.query('DELETE FROM enseignants WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};

module.exports = Enseignant;
