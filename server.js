const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const merchantRoutes = require('./routes/merchant');
const marketplaceRoutes = require('./routes/marketplace');
const chatRoutes = require('./routes/chat');
const clientRoutes = require('./routes/client');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Routes
app.use('/auth', authRoutes);
app.use('/merchant', merchantRoutes);
app.use('/marketplace', marketplaceRoutes);
app.use('/chat', chatRoutes);
app.use('/client', clientRoutes);

// Home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Routes de fallback pour les pages non implémentées
const notImplementedPages = ['/demo', '/api', '/docs', '/blog', '/help', '/status', 
                             '/about', '/careers', '/press', '/investors', '/contact',
                             '/privacy', '/terms', '/cookies', '/security', '/support'];

notImplementedPages.forEach(route => {
    app.get(route, (req, res) => {
        res.send(`
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Page en construction - Robi Marketplace</title>
                <link rel="stylesheet" href="/style.css">
            </head>
            <body>
                <div class="container">
                    <header>
                        <div class="header-content">
                            <h1><a href="/">🤖 Robi Marketplace</a></h1>
                            <div class="nav-actions">
                                <a href="/" class="btn btn-secondary btn-small">← Retour à l'accueil</a>
                            </div>
                        </div>
                    </header>
                    <main>
                        <div class="hero">
                            <h2>🚧 Page en construction</h2>
                            <p>Cette page sera bientôt disponible. En attendant, explorez les fonctionnalités principales !</p>
                            <div class="cta-buttons">
                                <a href="/" class="btn btn-primary">Retour à l'accueil</a>
                                <a href="/auth/register" class="btn btn-secondary">S'inscrire</a>
                            </div>
                        </div>
                    </main>
                </div>
            </body>
            </html>
        `);
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Database: MySQL`);
    console.log(`🎨 Frontend: HTMX + CSS`);
});