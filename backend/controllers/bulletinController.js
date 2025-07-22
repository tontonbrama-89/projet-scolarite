const pool = require('../config/db');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Générer le bulletin en PDF
const generateBulletinPDF = (res, eleve, notes, moyenne) => {
    const doc = new PDFDocument({ margin: 50 });

    const logoEcole = path.join(__dirname, '../../assets/logo.jpg');
    const logoNational = path.join(__dirname, '../../assets/logo national.png');
    const dateLocale = new Date().toLocaleDateString('fr-FR');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=bulletin.pdf');

    doc.rect(40, 40, doc.page.width - 80, doc.page.height - 80).stroke();

    // Logos
    if (fs.existsSync(logoEcole)) {
        doc.image(logoEcole, 55, 50, { width: 60 });
    }
    if (fs.existsSync(logoNational)) {
        doc.image(logoNational, doc.page.width - 120, 50, { width: 60 });
    }

    // En-tête officiel
    doc.fontSize(10).font('Times-Bold')
        .text('République Gabonaise', { align: 'center' })
        .text("Ministère de l'Éducation Nationale", { align: 'center' })
        .text('Circonscription de la Commune de Libreville Nord', { align: 'center' })
        .moveDown(0.2)
        .text('Année Scolaire : 2025 - 2026', { align: 'center' });

    doc.moveDown(0.5);

    // Informations établissement
    doc.fontSize(10).font('Times-Roman')
        .text("Ecole Privée Laïque La Résurrection", { align: 'center' })
        .text("Sablière 2 AKANDA", { align: 'center' })
        .text("Tél : +241060131120", { align: 'center' })
        .text("Email : Csplaresurrection@gmail.com", { align: 'center' })
        .text("Méthode – Rigueur – Compétence", { align: 'center' });

    doc.moveDown(1);

    // Titre du bulletin
    doc.font('Times-Bold').fontSize(14)
        .text("BULLETIN D'ÉVALUATION", { align: 'center' })
        .moveDown(0.2)
        .text(`NIVEAU : ${eleve.classe}`, { align: 'center' });

    doc.moveDown(1);

    // Bloc Élève
    doc.font('Times-Roman').fontSize(12)
        .text(`Nom : ${eleve.nom}`)
        .text(`Prénom : ${eleve.prenom}`)
        .text(`Classe : ${eleve.classe}`)
        .moveDown(0.5);

    // Notes
    doc.font('Times-Bold').text("Notes :").moveDown(0.3);
    doc.font('Times-Roman');
    notes.forEach(note => {
        doc.text(`${note.matiere || 'Matière inconnue'} : ${parseFloat(note.note).toFixed(2)}/10`);
    });

    // Moyenne générale
    doc.moveDown()
        .font('Times-Bold').fontSize(12)
        .text(`Moyenne Générale : ${moyenne.toFixed(2)}/10`, { underline: true, align: 'center' });

    // Remarque finale
    doc.moveDown(1)
        .font('Times-Italic').fontSize(11)
        .text("Félicitations pour le travail fourni.", { align: 'center' });

    doc.moveDown(1);

    // Visa Direction
    doc.fontSize(10).font('Times-Roman')
        .text("Visa de la Direction :")
        .text("Directrice : NGUEMA MEYO Amelia")
        .text("Responsable : NGUEMA MEYO Junior Larry")
        .text("_______________________________")
        .moveDown(1);

    // Date et lieu
    doc.text(`Fait à Akanda, le ${dateLocale}`, { align: 'right' });

    // Pied de page
    doc.moveDown(1);
    doc.fontSize(8).fillColor('gray')
        .text('Document généré automatiquement par le système de gestion de scolarité.', {
            align: 'center'
        });

    doc.end();
    doc.pipe(res);
};

// Contrôleur pour générer bulletin par ID élève
const getBulletinByEleveId = async (req, res) => {
    const eleveId = parseInt(req.params.id);

    if (isNaN(eleveId)) {
        return res.status(400).json({ error: 'ID invalide' });
    }

    try {
        const eleveQuery = await pool.query('SELECT * FROM eleves WHERE id = $1', [eleveId]);
        if (eleveQuery.rows.length === 0) {
            return res.status(404).json({ error: 'Élève introuvable' });
        }
        const eleve = eleveQuery.rows[0];

        // Correction ici : jointure avec la table matières
        const notesQuery = await pool.query(`
            SELECT m.nom AS matiere, n.note
            FROM notes n
            LEFT JOIN matieres m ON n.matiere_id = m.id
            WHERE n.eleve_id = $1
        `, [eleveId]);

        const notes = notesQuery.rows;

        if (notes.length === 0) {
            return res.status(404).json({ error: 'Aucune note disponible pour cet élève' });
        }

        const total = notes.reduce((acc, curr) => acc + parseFloat(curr.note), 0);
        const moyenne = total / notes.length;

        generateBulletinPDF(res, eleve, notes, moyenne);

    } catch (error) {
        console.error('Erreur génération bulletin:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

module.exports = {
    getBulletinByEleveId
};
