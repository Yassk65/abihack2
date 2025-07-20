const pool = require('./config/database');
const Bot = require('./models/Bot');
const Product = require('./models/Product');

async function testBotCreation() {
    console.log('🧪 Test de création de bot...');
    
    try {
        // Créer un utilisateur marchand de test
        console.log('👤 Création utilisateur marchand...');
        const userResult = await pool.query(`
            INSERT INTO users (email, password_hash, role, created_at) 
            VALUES ($1, $2, $3, NOW()) 
            RETURNING id
        `, ['test-bot@example.com', '$2b$10$test.hash', 'marchand']);
        
        const userId = userResult.rows[0].id;
        console.log('✅ Utilisateur créé:', userId);
        
        // Créer un profil marchand
        console.log('🏪 Création profil marchand...');
        await pool.query(`
            INSERT INTO merchants (user_id, shop_name, shop_description) 
            VALUES ($1, $2, $3)
        `, [userId, 'Test Shop', 'Boutique de test']);
        console.log('✅ Marchand créé');
        
        // Créer un produit
        console.log('📦 Création produit...');
        const product = await Product.create(userId, 'Produit Test', 'Description test', 10000, {});
        console.log('✅ Produit créé:', product.id);
        
        // Vérifier que le marchand a des produits
        console.log('🔍 Vérification produits...');
        const products = await Product.findByMerchant(userId);
        console.log('📦 Produits trouvés:', products.length);
        
        if (products.length === 0) {
            throw new Error('Aucun produit trouvé pour le marchand');
        }
        
        // Créer un bot
        console.log('🤖 Création bot...');
        const bot = await Bot.create(userId, 'Bot Test', 'Je suis un bot de test');
        console.log('✅ Bot créé:', bot);
        
        // Vérifier que le bot existe
        console.log('🔍 Vérification bot...');
        const foundBot = await Bot.findByMerchant(userId);
        console.log('🤖 Bot trouvé:', foundBot);
        
        if (!foundBot) {
            throw new Error('Bot non trouvé après création');
        }
        
        console.log('\n🎉 Test de création de bot réussi !');
        console.log('✅ Utilisateur, marchand, produit et bot créés avec succès');
        
        // Nettoyer les données de test
        console.log('\n🧹 Nettoyage des données de test...');
        await pool.query('DELETE FROM bots WHERE merchant_id = $1', [userId]);
        await pool.query('DELETE FROM products WHERE merchant_id = $1', [userId]);
        await pool.query('DELETE FROM merchants WHERE user_id = $1', [userId]);
        await pool.query('DELETE FROM users WHERE id = $1', [userId]);
        console.log('✅ Données de test supprimées');
        
    } catch (error) {
        console.error('❌ Erreur lors du test:', error);
        
        // Essayer de nettoyer en cas d'erreur
        try {
            await pool.query('DELETE FROM users WHERE email = $1', ['test-bot@example.com']);
        } catch (cleanupError) {
            console.error('❌ Erreur nettoyage:', cleanupError);
        }
        
        throw error;
    } finally {
        await pool.end();
    }
}

// Exécuter le test
if (require.main === module) {
    testBotCreation().catch(error => {
        console.error('❌ Test échoué:', error);
        process.exit(1);
    });
}

module.exports = { testBotCreation };