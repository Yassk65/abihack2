const pool = require('./config/database');
const Product = require('./models/Product');
const Bot = require('./models/Bot');

async function testBotIsolation() {
    console.log('🔍 Test d\'isolation du problème de création de bot...');
    
    let userId;
    
    try {
        // Étape 1: Créer un utilisateur marchand
        console.log('\n📋 ÉTAPE 1: Création utilisateur marchand');
        const userResult = await pool.query(`
            INSERT INTO users (email, password_hash, role, created_at) 
            VALUES ($1, $2, $3, NOW()) 
            RETURNING id
        `, ['isolation-test@example.com', '$2b$10$test.hash', 'marchand']);
        
        userId = userResult.rows[0].id;
        console.log('✅ Utilisateur créé avec ID:', userId);
        
        // Étape 2: Créer un profil marchand
        console.log('\n📋 ÉTAPE 2: Création profil marchand');
        await pool.query(`
            INSERT INTO merchants (user_id, shop_name, shop_description) 
            VALUES ($1, $2, $3)
        `, [userId, 'Isolation Test Shop', 'Boutique pour test d\'isolation']);
        console.log('✅ Profil marchand créé');
        
        // Étape 3: Vérifier que le marchand existe
        console.log('\n📋 ÉTAPE 3: Vérification marchand');
        const merchantCheck = await pool.query('SELECT * FROM merchants WHERE user_id = $1', [userId]);
        console.log('✅ Marchand trouvé:', merchantCheck.rows[0]);
        
        // Étape 4: Créer des produits
        console.log('\n📋 ÉTAPE 4: Création produits');
        const product1 = await Product.create(userId, 'iPhone Test', 'Smartphone de test', 800000, {});
        const product2 = await Product.create(userId, 'MacBook Test', 'Ordinateur de test', 1200000, {});
        console.log('✅ Produits créés:', product1.id, product2.id);
        
        // Étape 5: Vérifier les produits du marchand
        console.log('\n📋 ÉTAPE 5: Vérification produits');
        const products = await Product.findByMerchant(userId);
        console.log('✅ Produits trouvés pour le marchand:', products.length);
        products.forEach(p => console.log(`  - ${p.name}: ${p.price} CFA`));
        
        // Étape 6: Vérifier qu'aucun bot n'existe
        console.log('\n📋 ÉTAPE 6: Vérification absence de bot');
        const existingBot = await Bot.findByMerchant(userId);
        console.log('✅ Bot existant:', existingBot ? 'OUI' : 'NON');
        
        if (existingBot) {
            console.log('⚠️ Un bot existe déjà, suppression...');
            await pool.query('DELETE FROM bots WHERE merchant_id = $1', [userId]);
            console.log('✅ Bot supprimé');
        }
        
        // Étape 7: Créer un bot (simulation de la route)
        console.log('\n📋 ÉTAPE 7: Création bot (simulation route)');
        
        const botData = {
            name: 'Assistant Tech Isolation',
            personalityPrompt: 'Je suis un assistant spécialisé en produits technologiques. Je connais parfaitement les produits de cette boutique et je peux vous conseiller selon vos besoins et votre budget en CFA.',
            publishImmediately: true
        };
        
        console.log('📝 Données du bot:', botData);
        
        // Vérifier les conditions comme dans la route
        if (!botData.name || !botData.personalityPrompt) {
            throw new Error('Nom et personnalité requis');
        }
        
        if (products.length === 0) {
            throw new Error('Aucun produit trouvé');
        }
        
        // Créer le bot
        console.log('🤖 Création du bot...');
        const bot = await Bot.create(userId, botData.name, botData.personalityPrompt);
        console.log('✅ Bot créé:', bot);
        
        // Publier si demandé
        if (botData.publishImmediately) {
            console.log('📢 Publication du bot...');
            const updatedBot = await Bot.update(bot.id, bot.name, bot.personality_prompt, true);
            console.log('✅ Bot publié:', updatedBot);
        }
        
        // Étape 8: Vérification finale
        console.log('\n📋 ÉTAPE 8: Vérification finale');
        const finalBot = await Bot.findByMerchant(userId);
        console.log('✅ Bot final:', finalBot);
        
        console.log('\n🎉 TEST D\'ISOLATION RÉUSSI !');
        console.log('✅ Toutes les étapes ont fonctionné correctement');
        console.log('✅ Le problème n\'est PAS dans la logique de base');
        console.log('🔍 Le problème est probablement dans l\'interface web ou les sessions');
        
    } catch (error) {
        console.error('\n❌ ERREUR DANS LE TEST D\'ISOLATION:', error);
        console.error('📍 Cette erreur indique où se situe le problème');
        throw error;
    } finally {
        // Nettoyer les données de test
        if (userId) {
            console.log('\n🧹 Nettoyage des données de test...');
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
    testBotIsolation().catch(error => {
        console.error('❌ Test d\'isolation échoué:', error);
        process.exit(1);
    });
}

module.exports = { testBotIsolation };