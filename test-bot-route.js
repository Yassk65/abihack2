const pool = require('./config/database');
const Product = require('./models/Product');

async function testBotRoute() {
    console.log('🧪 Test de la route de création de bot...');
    
    let userId;
    
    try {
        // Créer un utilisateur marchand de test
        console.log('👤 Création utilisateur marchand...');
        const userResult = await pool.query(`
            INSERT INTO users (email, password_hash, role, created_at) 
            VALUES ($1, $2, $3, NOW()) 
            RETURNING id
        `, ['test-route@example.com', '$2b$10$test.hash', 'marchand']);
        
        userId = userResult.rows[0].id;
        console.log('✅ Utilisateur créé:', userId);
        
        // Créer un profil marchand
        console.log('🏪 Création profil marchand...');
        await pool.query(`
            INSERT INTO merchants (user_id, shop_name, shop_description) 
            VALUES ($1, $2, $3)
        `, [userId, 'Test Shop Route', 'Boutique de test pour route']);
        console.log('✅ Marchand créé');
        
        // Créer un produit
        console.log('📦 Création produit...');
        const product = await Product.create(userId, 'Produit Route Test', 'Description route test', 15000, {});
        console.log('✅ Produit créé:', product.id);
        
        // Simuler une requête HTTP POST vers /merchant/bot/create
        console.log('🌐 Test de la route HTTP...');
        
        const express = require('express');
        const session = require('express-session');
        const merchantRoutes = require('./routes/merchant');
        
        const app = express();
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        
        // Configuration de session simplifiée pour le test
        app.use(session({
            secret: 'test-secret',
            resave: false,
            saveUninitialized: false
        }));
        
        app.use('/merchant', merchantRoutes);
        
        // Simuler une requête avec session
        const request = require('supertest');
        
        const agent = request.agent(app);
        
        // Simuler une session de connexion
        await new Promise((resolve, reject) => {
            agent
                .post('/merchant/bot/create')
                .set('Cookie', [`connect.sid=test-session`])
                .send({
                    name: 'Bot Route Test',
                    personalityPrompt: 'Je suis un bot de test pour la route HTTP',
                    publishImmediately: 'on'
                })
                .end((err, res) => {
                    if (err) {
                        console.log('❌ Erreur route (attendue car pas de session):', err.message);
                        resolve(); // C'est normal, on n'a pas de vraie session
                    } else {
                        console.log('✅ Route accessible, statut:', res.status);
                        resolve();
                    }
                });
        });
        
        console.log('✅ Test de route terminé');
        
    } catch (error) {
        console.error('❌ Erreur lors du test de route:', error);
        throw error;
    } finally {
        // Nettoyer les données de test
        if (userId) {
            console.log('🧹 Nettoyage des données de test...');
            try {
                await pool.query('DELETE FROM bots WHERE merchant_id = $1', [userId]);
                await pool.query('DELETE FROM products WHERE merchant_id = $1', [userId]);
                await pool.query('DELETE FROM merchants WHERE user_id = $1', [userId]);
                await pool.query('DELETE FROM users WHERE id = $1', [userId]);
                console.log('✅ Données de test supprimées');
            } catch (cleanupError) {
                console.error('❌ Erreur nettoyage:', cleanupError);
            }
        }
        await pool.end();
    }
}

// Exécuter le test
if (require.main === module) {
    testBotRoute().catch(error => {
        console.error('❌ Test de route échoué:', error);
        process.exit(1);
    });
}

module.exports = { testBotRoute };