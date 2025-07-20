const express = require('express');
const path = require('path');

const router = express.Router();

// Middleware to check if user is client
const requireClient = (req, res, next) => {
    if (!req.session.userId || req.session.userRole !== 'client') {
        return res.redirect('/auth/login');
    }
    next();
};

// Client Dashboard
router.get('/dashboard', requireClient, (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'dashboard-client.html'));
});

// Client Favorites (placeholder)
router.get('/favorites', requireClient, (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Mes Favoris - Robi Marketplace</title>
                <link rel="stylesheet" href="/style.css">
            </head>
            <body>
                <div class="container">
                    <header>
                        <div class="header-content">
                            <h1><a href="/">🤖 Robi Marketplace</a></h1>
                            <div class="nav-actions">
                                <a href="/client/dashboard" class="btn btn-secondary btn-small">← Dashboard</a>
                            </div>
                        </div>
                    </header>
                    <main>
                        <div class="dashboard-section">
                            <h2>⭐ Mes Favoris</h2>
                            <div class="empty-state">
                                <div class="empty-icon">⭐</div>
                                <h3>Aucun favori</h3>
                                <p>Marquez vos bots préférés pour les retrouver ici</p>
                                <a href="/marketplace" class="btn btn-primary">Explorer le Marketplace</a>
                            </div>
                        </div>
                    </main>
                </div>
            </body>
        </html>
    `);
});

// Client History (placeholder)
router.get('/history', requireClient, (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Mon Historique - Robi Marketplace</title>
                <link rel="stylesheet" href="/style.css">
            </head>
            <body>
                <div class="container">
                    <header>
                        <div class="header-content">
                            <h1><a href="/">🤖 Robi Marketplace</a></h1>
                            <div class="nav-actions">
                                <a href="/client/dashboard" class="btn btn-secondary btn-small">← Dashboard</a>
                            </div>
                        </div>
                    </header>
                    <main>
                        <div class="dashboard-section">
                            <h2>📚 Mon Historique</h2>
                            <div class="empty-state">
                                <div class="empty-icon">📚</div>
                                <h3>Aucune conversation</h3>
                                <p>Vos conversations avec les bots apparaîtront ici</p>
                                <a href="/marketplace" class="btn btn-primary">Commencer à chatter</a>
                            </div>
                        </div>
                    </main>
                </div>
            </body>
        </html>
    `);
});

module.exports = router;