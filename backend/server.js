const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const pool = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// 📂 Servir le frontend (tableau de bord)
app.use(express.static(path.join(__dirname, '../frontend')));

// 🔐 Middleware : Protection API
const apiKeyMiddleware = require('./middlewares/apiKeyMiddleware');
app.use('/api', apiKeyMiddleware);

// 🔌 Connexion DB
pool.query('SELECT NOW()')
  .then(result => {
    console.log('🟢 Connexion DB établie au démarrage — Heure serveur :', result.rows[0].now);
  })
  .catch(error => {
    console.error('❌ Connexion DB échouée au démarrage :', error);
  });

// 📚 Routes API
const eleveRoutes = require('./routes/eleveRoutes');
const classeRoutes = require('./routes/classeRoutes');
const enseignantRoutes = require('./routes/enseignantRoutes');
const noteRoutes = require('./routes/noteRoutes');
const bulletinRoutes = require('./routes/bulletinRoutes');
const matiereRoutes = require('./routes/matiereRoutes');
const paiementRoutes = require('./routes/paiementRoutes');
const statsRoutes = require('./routes/statsRoutes');
const recuRoutes = require('./routes/recuRoutes');  // 🔒 Route dédiée reçus

app.use('/api/eleves', eleveRoutes);
app.use('/api/classes', classeRoutes);
app.use('/api/enseignants', enseignantRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/bulletins', bulletinRoutes);
app.use('/api/matieres', matiereRoutes);
app.use('/api/paiements', paiementRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/recus', recuRoutes);   // 📥 Endpoint sécurisé pour reçus PDF

console.log('📢 Routes API activées (élèves, classes, enseignants, notes, bulletins, matières, paiements, stats, recus)');

// 🚪 Route par défaut
app.get('/api', (req, res) => {
  res.send('✅ Backend scolarité opérationnel');
});

// 🚀 Démarrage serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur le port ${PORT}`);
});
