const eleveModel = require('../models/eleveModel');

// Récupérer tous les élèves
const getAllEleves = async (req, res) => {
  try {
    const eleves = await eleveModel.getAllEleves();
    res.status(200).json(eleves);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer un élève par ID
const getEleveById = async (req, res) => {
  const { id } = req.params;
  try {
    const eleve = await eleveModel.getEleveById(id);
    if (eleve) {
      res.status(200).json(eleve);
    } else {
      res.status(404).json({ message: "Élève non trouvé" });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Ajouter un élève
const addEleve = async (req, res) => {
  const { nom, prenom, classe } = req.body;
  try {
    const nouvelEleve = await eleveModel.addEleve(nom, prenom, classe);
    res.status(201).json(nouvelEleve);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Modifier un élève
const updateEleve = async (req, res) => {
  const { id } = req.params;
  const { nom, prenom, classe } = req.body;
  try {
    const eleve = await eleveModel.updateEleve(id, nom, prenom, classe);
    if (eleve) {
      res.status(200).json(eleve);
    } else {
      res.status(404).json({ message: "Élève non trouvé" });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer un élève
const deleteEleve = async (req, res) => {
  const { id } = req.params;
  try {
    const success = await eleveModel.deleteEleve(id);
    if (success) {
      res.status(200).json({ message: "Élève supprimé avec succès" });
    } else {
      res.status(404).json({ message: "Élève non trouvé" });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  getAllEleves,
  getEleveById,
  addEleve,
  updateEleve,
  deleteEleve
};
