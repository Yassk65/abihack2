const express = require('express');
const Bot = require('../models/Bot');
const Conversation = require('../models/Conversation');
const openRouterService = require('../services/openrouter');
const path = require('path');

const router = express.Router();

// Middleware to check if user is client
const requireClient = (req, res, next) => {
    if (!req.session.userId || req.session.userRole !== 'client') {
        return res.redirect('/auth/login');
    }
    next();
};

// Chat page
router.get('/:botId', requireClient, async (req, res) => {
    try {
        const bot = await Bot.findById(req.params.botId);
        if (!bot || !bot.is_published) {
            return res.status(404).send('Bot non trouvé');
        }
        
        res.sendFile(path.join(__dirname, '../views', 'chat.html'));
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
});

// Get bot info for chat page
router.get('/:botId/info', requireClient, async (req, res) => {
    try {
        const bot = await Bot.findById(req.params.botId);
        if (!bot || !bot.is_published) {
            return res.status(404).json({ error: 'Bot non trouvé' });
        }
        
        res.json({ name: bot.name, id: bot.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Get conversation history
router.get('/:botId/history', requireClient, async (req, res) => {
    try {
        const conversation = await Conversation.findOrCreate(req.session.userId, req.params.botId);
        
        const messagesHtml = conversation.history.map(msg => `
            <div class="message ${msg.role}">
                <div class="message-content">${msg.content}</div>
            </div>
        `).join('');
        
        res.send(messagesHtml);
    } catch (error) {
        console.error(error);
        res.status(500).send('<div class="error">Erreur lors du chargement de l\'historique</div>');
    }
});

// Send message
router.post('/send', requireClient, async (req, res) => {
    try {
        console.log('📨 Nouveau message reçu');
        console.log('👤 User ID:', req.session.userId);
        console.log('📝 Body:', req.body);
        
        const { message, botId } = req.body;
        
        if (!message || !botId) {
            console.log('❌ Message ou botId manquant');
            return res.status(400).send('<div class="error">Message ou bot manquant</div>');
        }
        
        console.log('🔍 Recherche du bot:', botId);
        const bot = await Bot.findById(botId);
        console.log('🤖 Bot trouvé:', bot ? bot.name : 'Non trouvé');
        
        if (!bot || !bot.is_published) {
            console.log('❌ Bot non trouvé ou non publié');
            return res.status(404).send('<div class="error">Bot non trouvé</div>');
        }
        
        console.log('💬 Récupération de la conversation...');
        // Get or create conversation
        const conversation = await Conversation.findOrCreate(req.session.userId, botId);
        console.log('📚 Historique conversation:', conversation.history.length, 'messages');
        
        console.log('🚀 Génération de la réponse...');
        // Generate bot response
        const botResponse = await openRouterService.generateResponse(bot, conversation.history, message);
        console.log('✅ Réponse générée');
        
        console.log('💾 Sauvegarde des messages...');
        // Save both messages
        await Conversation.addMessage(req.session.userId, botId, 'user', message);
        await Conversation.addMessage(req.session.userId, botId, 'assistant', botResponse);
        console.log('✅ Messages sauvegardés');
        
        // Return both messages as HTML
        res.send(`
            <div class="message user">
                <div class="message-content">${message}</div>
            </div>
            <div class="message assistant">
                <div class="message-content">${botResponse}</div>
            </div>
        `);
        
    } catch (error) {
        console.error('❌ Erreur dans /chat/send:', error);
        res.status(500).send('<div class="error">Erreur lors de l\'envoi du message: ' + error.message + '</div>');
    }
});

module.exports = router;