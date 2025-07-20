const express = require('express');
const Product = require('../models/Product');
const Bot = require('../models/Bot');
const pool = require('../config/database');
const path = require('path');

const router = express.Router();

// Middleware to check if user is merchant
const requireMerchant = (req, res, next) => {
    if (!req.session.userId || req.session.userRole !== 'marchand') {
        return res.redirect('/auth/login');
    }
    next();
};

// Dashboard principal
router.get('/dashboard', requireMerchant, async (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'merchant-dashboard.html'));
});

// Dashboard produits
router.get('/products', requireMerchant, async (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'merchant-products.html'));
});

// Dashboard bot
router.get('/bot', requireMerchant, async (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'merchant-bot.html'));
});

// Analytics (placeholder)
router.get('/analytics', requireMerchant, (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Analytics - Robi Marketplace</title>
                <link rel="stylesheet" href="/style.css">
            </head>
            <body>
                <div class="container">
                    <header>
                        <div class="header-content">
                            <h1><a href="/">🤖 Robi Marketplace</a></h1>
                            <div class="nav-actions">
                                <a href="/merchant/dashboard" class="btn btn-secondary btn-small">← Dashboard</a>
                            </div>
                        </div>
                    </header>
                    <main>
                        <div class="dashboard-section">
                            <h2>📊 Analytics</h2>
                            <div class="empty-state">
                                <div class="empty-icon">📊</div>
                                <h3>Analytics à venir</h3>
                                <p>Bientôt disponible : statistiques détaillées de vos conversations et ventes</p>
                                <a href="/merchant/dashboard" class="btn btn-primary">Retour au Dashboard</a>
                            </div>
                        </div>
                    </main>
                </div>
            </body>
        </html>
    `);
});

// Bot Config (placeholder)
router.get('/bot-config', requireMerchant, (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Configuration Bot - Robi Marketplace</title>
                <link rel="stylesheet" href="/style.css">
            </head>
            <body>
                <div class="container">
                    <header>
                        <div class="header-content">
                            <h1><a href="/">🤖 Robi Marketplace</a></h1>
                            <div class="nav-actions">
                                <a href="/merchant/dashboard" class="btn btn-secondary btn-small">← Dashboard</a>
                            </div>
                        </div>
                    </header>
                    <main>
                        <div class="dashboard-section">
                            <h2>🤖 Configuration Bot Avancée</h2>
                            <div class="empty-state">
                                <div class="empty-icon">🤖</div>
                                <h3>Configuration avancée à venir</h3>
                                <p>Bientôt : configuration avancée de votre bot avec templates et paramètres personnalisés</p>
                                <a href="/merchant/dashboard" class="btn btn-primary">Retour au Dashboard</a>
                            </div>
                        </div>
                    </main>
                </div>
            </body>
        </html>
    `);
});

// Dashboard analytics
router.get('/analytics', requireMerchant, async (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'merchant-analytics.html'));
});

// Get merchant data for dashboard
router.get('/data', requireMerchant, async (req, res) => {
    try {
        console.log('📊 Récupération des données marchand pour:', req.session.userId);
        
        const products = await Product.findByMerchant(req.session.userId);
        console.log('📦 Produits trouvés:', products.length);
        
        const bot = await Bot.findByMerchant(req.session.userId);
        console.log('🤖 Bot trouvé:', bot ? bot.name : 'Aucun');
        
        const data = { products, bot };
        console.log('✅ Données à envoyer:', data);
        
        res.json(data);
    } catch (error) {
        console.error('❌ Erreur dans /merchant/data:', error);
        res.status(500).json({ error: 'Erreur serveur: ' + error.message });
    }
});

// Products routes
router.post('/products/add', requireMerchant, async (req, res) => {
    try {
        const { name, description, price, characteristics } = req.body;
        let parsedCharacteristics = {};
        
        if (characteristics) {
            try {
                parsedCharacteristics = JSON.parse(characteristics);
            } catch (e) {
                parsedCharacteristics = {};
            }
        }
        
        const product = await Product.create(
            req.session.userId,
            name,
            description,
            parseFloat(price),
            parsedCharacteristics
        );
        
        res.send(`
            <div class="product-item" id="product-${product.id}">
                <h4>${product.name}</h4>
                <p>${product.description}</p>
                <p><strong>${product.price} CFA</strong></p>
                <button hx-delete="/merchant/products/${product.id}" hx-target="#product-${product.id}" hx-swap="outerHTML">
                    Supprimer
                </button>
            </div>
        `);
    } catch (error) {
        console.error(error);
        res.status(500).send('<div class="error">Erreur lors de l\'ajout du produit</div>');
    }
});

router.delete('/products/:id', requireMerchant, async (req, res) => {
    try {
        await Product.delete(req.params.id);
        res.send('');
    } catch (error) {
        console.error(error);
        res.status(500).send('<div class="error">Erreur lors de la suppression</div>');
    }
});

// Bot routes
router.post('/bot/create', requireMerchant, async (req, res) => {
    try {
        console.log('🤖 Création de bot demandée');
        console.log('👤 User ID:', req.session.userId);
        console.log('📝 Body:', req.body);
        
        const { name, personalityPrompt, publishImmediately } = req.body;
        
        if (!name || !personalityPrompt) {
            console.log('❌ Données manquantes');
            return res.status(400).send('<div class="error">❌ Nom et personnalité requis</div>');
        }
        
        // Vérifier que le marchand a des produits
        console.log('📦 Vérification des produits...');
        const products = await Product.findByMerchant(req.session.userId);
        console.log('📦 Produits trouvés:', products.length);
        
        if (products.length === 0) {
            return res.status(400).send('<div class="error">❌ Vous devez ajouter au moins un produit avant de créer votre bot</div>');
        }
        
        // Vérifier qu'un bot n'existe pas déjà
        const existingBot = await Bot.findByMerchant(req.session.userId);
        if (existingBot) {
            console.log('⚠️ Bot existe déjà');
            return res.status(400).send('<div class="error">❌ Vous avez déjà un bot. Utilisez le formulaire de mise à jour ci-dessous.</div>');
        }
        
        const isPublished = publishImmediately === 'on';
        console.log('🚀 Création du bot...');
        const bot = await Bot.create(req.session.userId, name, personalityPrompt);
        console.log('✅ Bot créé:', bot.id);
        
        // Mettre à jour le statut de publication si nécessaire
        if (isPublished) {
            console.log('📢 Publication du bot...');
            await Bot.update(bot.id, name, personalityPrompt, true);
        }
        
        console.log('✅ Bot créé avec succès');
        
        res.send(`
            <div class="bot-config bot-created">
                <div class="success-message">
                    <h4>🎉 Assistant créé avec succès !</h4>
                    <p><strong>${bot.name}</strong> est maintenant ${isPublished ? 'publié sur le marketplace' : 'en brouillon'}</p>
                </div>
                
                <div class="bot-summary">
                    <h4>📋 Résumé de votre assistant</h4>
                    <p><strong>Nom:</strong> ${bot.name}</p>
                    <p><strong>Produits disponibles:</strong> ${products.length} produit(s)</p>
                    <p><strong>Statut:</strong> ${isPublished ? '✅ Publié' : '📝 Brouillon'}</p>
                </div>
                
                <form hx-post="/merchant/bot/update" hx-target="#bot-section" class="bot-update-form">
                    <input type="hidden" name="botId" value="${bot.id}">
                    <div class="form-group">
                        <label>Nom du bot:</label>
                        <input name="name" value="${bot.name}" required>
                    </div>
                    <div class="form-group">
                        <label>Instructions de personnalité:</label>
                        <textarea name="personalityPrompt" rows="5" required>${bot.personality_prompt}</textarea>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" name="isPublished" ${isPublished ? 'checked' : ''}>
                            Publier sur le marketplace
                        </label>
                    </div>
                    <button type="submit" class="btn btn-primary">Mettre à jour</button>
                </form>
            </div>
        `);
    } catch (error) {
        console.error('❌ Erreur création bot:', error);
        res.status(500).send('<div class="error">Erreur lors de la création du bot: ' + error.message + '</div>');
    }
});

router.post('/bot/update', requireMerchant, async (req, res) => {
    try {
        const { botId, name, personalityPrompt, isPublished } = req.body;
        const bot = await Bot.update(botId, name, personalityPrompt, !!isPublished);
        
        res.send(`
            <div class="bot-config">
                <h3>Bot: ${bot.name}</h3>
                <form hx-post="/merchant/bot/update" hx-target="#bot-section">
                    <input type="hidden" name="botId" value="${bot.id}">
                    <div>
                        <label>Nom du bot:</label>
                        <input name="name" value="${bot.name}" required>
                    </div>
                    <div>
                        <label>Instructions de personnalité:</label>
                        <textarea name="personalityPrompt" rows="5" required>${bot.personality_prompt}</textarea>
                    </div>
                    <div>
                        <label>
                            <input type="checkbox" name="isPublished" ${bot.is_published ? 'checked' : ''}>
                            Publier le bot
                        </label>
                    </div>
                    <button type="submit">Mettre à jour</button>
                </form>
                <p class="status ${bot.is_published ? 'published' : 'draft'}">
                    Statut: ${bot.is_published ? 'Publié' : 'Brouillon'}
                </p>
            </div>
        `);
    } catch (error) {
        console.error(error);
        res.status(500).send('<div class="error">Erreur lors de la mise à jour</div>');
    }
});

// Bot interface route
router.get('/bot-interface', requireMerchant, async (req, res) => {
    try {
        console.log('🤖 Chargement interface bot pour:', req.session.userId);
        
        const products = await Product.findByMerchant(req.session.userId);
        const bot = await Bot.findByMerchant(req.session.userId);
        
        console.log('📦 Produits:', products.length);
        console.log('🤖 Bot existant:', bot ? bot.name : 'Aucun');
        
        if (bot) {
            // Bot exists - show update form
            res.send(`
                <div class="bot-config">
                    <div class="bot-status">
                        <h4>🤖 ${bot.name}</h4>
                        <span class="status-badge ${bot.is_published ? 'published' : 'draft'}">
                            ${bot.is_published ? '✅ Publié' : '📝 Brouillon'}
                        </span>
                    </div>
                    <form hx-post="/merchant/bot/update" hx-target="#bot-section">
                        <input type="hidden" name="botId" value="${bot.id}">
                        <div class="form-group">
                            <label>Nom du bot:</label>
                            <input name="name" value="${bot.name}" required>
                        </div>
                        <div class="form-group">
                            <label>Instructions de personnalité:</label>
                            <textarea name="personalityPrompt" rows="5" required>${bot.personality_prompt}</textarea>
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" name="isPublished" ${bot.is_published ? 'checked' : ''}>
                                Publier sur le marketplace
                            </label>
                        </div>
                        <button type="submit" class="btn btn-primary">Mettre à jour</button>
                    </form>
                </div>
            `);
        } else {
            // No bot - show creation interface
            const hasProducts = products && products.length > 0;
            
            res.send(`
                <div class="bot-creation-guide">
                    <div class="guide-step ${hasProducts ? 'completed' : 'pending'}">
                        <h4>📋 Étape 1: Ajoutez vos produits</h4>
                        <p>Votre bot ne pourra parler que des produits que vous ajoutez.</p>
                        ${hasProducts ? 
                            `<p class="success">✅ Parfait ! Vous avez ${products.length} produit(s). Passez à l'étape 2.</p>` : 
                            `<p class="warning">⚠️ Ajoutez au moins un produit dans la section ci-dessus.</p>`
                        }
                    </div>
                    
                    <div class="guide-step ${hasProducts ? 'active' : 'disabled'}">
                        <h4>🤖 Étape 2: Créez votre assistant IA</h4>
                        ${hasProducts ? `
                            <form hx-post="/merchant/bot/create" hx-target="#bot-section" class="bot-creation-form">
                                <div class="form-group">
                                    <label>Nom de votre assistant:</label>
                                    <input name="name" placeholder="Ex: Assistant Fruits, Conseiller Mode..." required>
                                    <small>Ce nom sera visible par les clients sur le marketplace</small>
                                </div>
                                <div class="form-group">
                                    <label>Personnalité de votre assistant:</label>
                                    <textarea name="personalityPrompt" rows="6" placeholder="Décrivez comment votre bot doit se comporter. Exemple:&#10;'Tu es un expert en fruits frais, passionné par la qualité. Tu aides les clients à choisir les meilleurs produits selon leurs besoins. Tu es enthousiaste et donnes des conseils pratiques.'" required></textarea>
                                    <small>Votre bot ne parlera QUE de vos ${products.length} produit(s) listés ci-dessus</small>
                                </div>
                                <div class="form-group">
                                    <label>
                                        <input type="checkbox" name="publishImmediately" checked>
                                        Publier immédiatement sur le marketplace
                                    </label>
                                </div>
                                <button type="submit" class="btn btn-primary btn-large">🚀 Créer mon assistant IA</button>
                            </form>
                        ` : `
                            <p class="disabled-message">Ajoutez d'abord des produits pour débloquer cette étape.</p>
                        `}
                    </div>
                </div>
            `);
        }
        
    } catch (error) {
        console.error('❌ Erreur interface bot:', error);
        res.status(500).send(`<div class="error">Erreur: ${error.message}</div>`);
    }
});

module.exports = router;