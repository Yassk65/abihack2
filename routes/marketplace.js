const express = require('express');
const Bot = require('../models/Bot');
const path = require('path');

const router = express.Router();

// Middleware to check if user is client
const requireClient = (req, res, next) => {
    if (!req.session.userId || req.session.userRole !== 'client') {
        return res.redirect('/auth/login');
    }
    next();
};

// Dashboard client
router.get('/dashboard', requireClient, (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'client-dashboard.html'));
});

// Marketplace page
router.get('/', requireClient, (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'marketplace.html'));
});

// Get published bots with their products
router.get('/bots', requireClient, async (req, res) => {
    try {
        const bots = await Bot.findPublished();
        const Product = require('../models/Product');

        const botsWithProducts = await Promise.all(
            bots.map(async (bot) => {
                const products = await Product.findByMerchant(bot.merchant_id);
                return { ...bot, products };
            })
        );

        const botsHtml = botsWithProducts.map(bot => `
            <div class="bot-card">
                <div class="bot-main-content">
                    <div class="bot-header">
                        <div class="bot-title-section">
                            <h3>🤖 ${bot.name}</h3>
                            <span class="shop-badge">🏪 ${bot.shop_name}</span>
                        </div>
                        <div class="bot-stats-mini">
                            <span class="products-count">${bot.products.length} produits</span>
                        </div>
                    </div>
                    
                    <div class="bot-description">
                        <p>${bot.personality_prompt.substring(0, 150)}...</p>
                    </div>
                    
                    <div class="bot-products">
                        
                    </div>
                </div>
                
                <div class="bot-actions">
                    <a href="/chat/${bot.id}" class="chat-btn">💬 Discuter avec ${bot.name}</a>
                    <div class="bot-note">🔒 Assistant spécialisé pour ${bot.shop_name}</div>
                </div>
            </div>
        `).join('');

        res.send(botsHtml);
    } catch (error) {
        console.error(error);
        res.status(500).send('<div class="error">Erreur lors du chargement des bots</div>');
    }
});

module.exports = router;