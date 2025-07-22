const pool = require('../config/db');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { sendRecuPaiement } = require('../services/emailService');

// 📁 Assurer l'existence du dossier receipts
const dossierReceipts = path.join(__dirname, '../receipts');
if (!fs.existsSync(dossierReceipts)) {
    fs.mkdirSync(dossierReceipts);
    console.log('📁 Dossier receipts créé automatiquement');
} else {
    console.log('📂 Dossier receipts déjà présent');
}

// Liste de tous les paiements
const getAllPaiements = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.*, e.nom AS eleve_nom, e.prenom AS eleve_prenom
            FROM paiements p
            JOIN eleves e ON p.eleve_id = e.id
            ORDER BY p.date_paiement DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Erreur récupération paiements:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Détails d'un paiement
const getPaiementById = async (req, res) => {
    const paiementId = parseInt(req.params.id);
    if (isNaN(paiementId)) {
        return res.status(400).json({ error: 'ID invalide' });
    }
    try {
        const result = await pool.query('SELECT * FROM paiements WHERE id = $1', [paiementId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Paiement non trouvé' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erreur récupération paiement:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Ajouter un paiement
const addPaiement = async (req, res) => {
    const { eleve_id, montant, mode_paiement, reference } = req.body;
    if (!eleve_id || isNaN(parseInt(eleve_id)) || !montant || isNaN(parseFloat(montant))) {
        return res.status(400).json({ error: 'eleve_id et montant valides obligatoires' });
    }
    try {
        const eleveCheck = await pool.query('SELECT * FROM eleves WHERE id = $1', [eleve_id]);
        if (eleveCheck.rows.length === 0) {
            return res.status(404).json({ error: "Élève introuvable" });
        }
        const result = await pool.query(`
            INSERT INTO paiements (eleve_id, montant, mode_paiement, reference)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `, [eleve_id, montant, mode_paiement || 'Espèces', reference || null]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erreur ajout paiement:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Modification
const updatePaiement = async (req, res) => {
    const paiementId = parseInt(req.params.id);
    const { montant, mode_paiement, reference } = req.body;
    try {
        const result = await pool.query(`
            UPDATE paiements
            SET montant = $1,
                mode_paiement = $2,
                reference = $3
            WHERE id = $4
            RETURNING *
        `, [montant, mode_paiement, reference, paiementId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Paiement non trouvé' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erreur mise à jour paiement:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Suppression
const deletePaiement = async (req, res) => {
    const paiementId = parseInt(req.params.id);
    try {
        const result = await pool.query('DELETE FROM paiements WHERE id = $1 RETURNING *', [paiementId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Paiement non trouvé' });
        }
        res.json({ message: 'Paiement supprimé' });
    } catch (error) {
        console.error('Erreur suppression paiement:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Génération du reçu PDF + envoi email
const generateRecu = async (req, res) => {
    const paiementId = parseInt(req.params.id);
    if (isNaN(paiementId)) {
        return res.status(400).json({ error: 'ID invalide' });
    }
    try {
        const paiementQuery = await pool.query('SELECT * FROM paiements WHERE id = $1', [paiementId]);
        if (paiementQuery.rows.length === 0) {
            return res.status(404).json({ error: 'Paiement non trouvé' });
        }
        const paiement = paiementQuery.rows[0];
        const eleveQuery = await pool.query('SELECT * FROM eleves WHERE id = $1', [paiement.eleve_id]);
        const eleve = eleveQuery.rows[0];
        const pdfFilePath = await generateRecuPaiementPDF(paiement, eleve);
        const destinataire = eleve.email || process.env.EMAIL_USER;
        await sendRecuPaiement(destinataire, pdfFilePath);
        res.download(pdfFilePath);
    } catch (error) {
        console.error('Erreur génération reçu:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

const generateRecuPaiementPDF = (paiement, eleve) => {
    return new Promise((resolve) => {
        const doc = new PDFDocument({ margin: 50 });
        const dateLocale = new Date(paiement.date_paiement).toLocaleDateString('fr-FR');
        const pdfFileName = `recu_paiement_${paiement.id}.pdf`;
        const pdfFilePath = path.join(dossierReceipts, pdfFileName);
        const fileStream = fs.createWriteStream(pdfFilePath);
        doc.pipe(fileStream);
        doc.fontSize(16).font('Times-Bold').text('REÇU DE PAIEMENT', { align: 'center' }).moveDown();
        doc.fontSize(12).font('Times-Roman')
            .text(`Nom : ${eleve.nom}`)
            .text(`Prénom : ${eleve.prenom}`)
            .text(`Classe : ${eleve.classe}`)
            .text(`Montant payé : ${Number(paiement.montant).toFixed(2)} FCFA`)
            .text(`Mode de paiement : ${paiement.mode_paiement || 'Espèces'}`)
            .text(`Référence : ${paiement.reference || '-'}`)
            .text(`Date : ${dateLocale}`)
            .moveDown(2);
        doc.font('Times-Italic').fontSize(10).text("Merci pour votre paiement.", { align: 'center' });
        doc.moveDown(2).fontSize(10).font('Times-Roman')
            .text("Visa de la Direction")
            .moveDown(1)
            .text("___________________________", { align: 'left' });
        doc.end();
        fileStream.on('finish', () => {
            console.log(`📄 Reçu enregistré : ${pdfFilePath}`);
            resolve(pdfFilePath);
        });
    });
};

// Historique et total payé
const getPaiementsByEleveId = async (req, res) => {
    const eleveId = parseInt(req.params.eleve_id);
    if (isNaN(eleveId)) {
        return res.status(400).json({ error: 'ID élève invalide' });
    }
    try {
        const paiementsResult = await pool.query(`
            SELECT id, montant, mode_paiement, reference, date_paiement
            FROM paiements
            WHERE eleve_id = $1
            ORDER BY date_paiement DESC
        `, [eleveId]);
        const totalResult = await pool.query(`
            SELECT COALESCE(SUM(montant), 0) AS total_paye
            FROM paiements
            WHERE eleve_id = $1
        `, [eleveId]);
        res.json({
            paiements: paiementsResult.rows,
            total_paye: parseFloat(totalResult.rows[0].total_paye)
        });
    } catch (error) {
        console.error('Erreur récupération paiements élève:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

module.exports = {
    getAllPaiements,
    getPaiementById,
    addPaiement,
    updatePaiement,
    deletePaiement,
    generateRecu,
    getPaiementsByEleveId
};
