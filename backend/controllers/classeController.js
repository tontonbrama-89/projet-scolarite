const classeModel = require('../models/classeModel');

// Récupérer toutes les classes
const getAllClasses = async (req, res) => {
  try {
    const classes = await classeModel.getAllClasses();
    res.status(200).json(classes);
  } catch (error) {
    console.error('Erreur getAllClasses :', error.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Ajouter une classe
const addClasse = async (req, res) => {
  const { nom } = req.body;
  try {
    const nouvelleClasse = await classeModel.addClasse(nom);
    res.status(201).json(nouvelleClasse);
  } catch (error) {
    console.error('Erreur addClasse :', error.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  getAllClasses,
  addClasse,
};
