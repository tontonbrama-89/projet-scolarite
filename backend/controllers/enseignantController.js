const Enseignant = require('../models/enseignantModel');

exports.getAllEnseignants = async (req, res) => {
  const enseignants = await Enseignant.getAll();
  res.json(enseignants);
};

exports.getEnseignantById = async (req, res) => {
  const enseignant = await Enseignant.getById(req.params.id);
  if (enseignant) {
    res.json(enseignant);
  } else {
    res.status(404).json({ message: 'Enseignant non trouvé' });
  }
};

exports.addEnseignant = async (req, res) => {
  const { nom, prenom, email, classe_id } = req.body;
  const newEnseignant = await Enseignant.create({ nom, prenom, email, classe_id });
  res.status(201).json(newEnseignant);
};

exports.updateEnseignant = async (req, res) => {
  const { nom, prenom, email, classe_id } = req.body;
  const updated = await Enseignant.update(req.params.id, { nom, prenom, email, classe_id });
  if (updated) {
    res.json(updated);
  } else {
    res.status(404).json({ message: 'Enseignant non trouvé' });
  }
};

exports.deleteEnseignant = async (req, res) => {
  const deleted = await Enseignant.delete(req.params.id);
  if (deleted) {
    res.json({ message: 'Enseignant supprimé avec succès' });
  } else {
    res.status(404).json({ message: 'Enseignant non trouvé' });
  }
};
