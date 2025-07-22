// backend/middlewares/apiKeyMiddleware.js

module.exports = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.API_KEY) {
        return res.status(403).json({ error: 'Accès refusé : clé API invalide.' });
    }
    next();
};
