const matiereModel = require('../models/matiereModel');

// GET /api/matieres
const getMatieres = async (req, res) => {
    try {
        const matieres = await matiereModel.getAllMatieres();
        res.json(matieres);
    } catch (error) {
        console.error('Erreur getMatieres:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// POST /api/matieres
const addMatiere = async (req, res) => {
    const { nom } = req.body;
    if (!nom) {
        return res.status(400).json({ error: 'Le nom est requis' });
    }
    try {
        const matiere = await matiereModel.addMatiere(nom);
        res.status(201).json(matiere);
    } catch (error) {
        console.error('Erreur addMatiere:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// DELETE /api/matieres/:id
const deleteMatiere = async (req, res) => {
    const { id } = req.params;
    try {
        await matiereModel.deleteMatiere(id);
        res.json({ message: 'Matière supprimée' });
    } catch (error) {
        console.error('Erreur deleteMatiere:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

module.exports = {
    getMatieres,
    addMatiere,
    deleteMatiere
};
