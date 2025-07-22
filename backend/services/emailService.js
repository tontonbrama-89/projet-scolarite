const nodemailer = require('nodemailer');
const path = require('path');

// Configuration SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Fonction d'envoi de mail avec reçu PDF en pièce jointe
const sendRecuPaiement = async (destinataire, pdfFilePath) => {
    const mailOptions = {
        from: `"Ecole Résurrection" <${process.env.EMAIL_USER}>`,
        to: destinataire,
        subject: "Votre reçu de paiement",
        text: "Bonjour,\n\nVeuillez trouver en pièce jointe votre reçu officiel.\n\nMerci.",
        attachments: [{
            filename: path.basename(pdfFilePath),
            path: pdfFilePath
        }]
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email envoyé à ${destinataire}`);
};

module.exports = { sendRecuPaiement };
