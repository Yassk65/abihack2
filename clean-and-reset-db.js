const pool = require('./config/database');

async function cleanAndResetDatabase() {
    console.log('🧹 Début du nettoyage de la base de données...');
    
    try {
        // Désactiver les contraintes de clés étrangères temporairement
        await pool.query('SET session_replication_role = replica;');
        
        console.log('📋 Suppression de toutes les données...');
        
        // Supprimer toutes les données dans l'ordre inverse des dépendances
        await pool.query('DELETE FROM conversations');
        console.log('✅ Conversations supprimées');
        
        await pool.query('DELETE FROM bots');
        console.log('✅ Bots supprimés');
        
        await pool.query('DELETE FROM products');
        console.log('✅ Produits supprimés');
        
        await pool.query('DELETE FROM merchants');
        console.log('✅ Marchands supprimés');
        
        await pool.query('DELETE FROM users');
        console.log('✅ Utilisateurs supprimés');
        
        // Réactiver les contraintes de clés étrangères
        await pool.query('SET session_replication_role = DEFAULT;');
        
        // Note: Pas besoin de réinitialiser les séquences car on utilise des UUID
        console.log('✅ Tables vidées (UUID utilisés, pas de séquences à réinitialiser)');
        
        // Créer des données de test
        console.log('🌱 Création de données de test...');
        
        // Créer un utilisateur marchand de test
        const merchantUser = await pool.query(`
            INSERT INTO users (email, password_hash, role, created_at) 
            VALUES ($1, $2, $3, NOW()) 
            RETURNING id
        `, ['marchand@test.com', '$2b$10$example.hash.for.password123', 'marchand']);
        
        const merchantUserId = merchantUser.rows[0].id;
        
        // Créer un profil marchand
        const merchant = await pool.query(`
            INSERT INTO merchants (user_id, shop_name, shop_description) 
            VALUES ($1, $2, $3) 
            RETURNING user_id as id
        `, [merchantUserId, 'Boutique Tech Abidjan', 'Spécialiste en électronique et gadgets high-tech à Abidjan']);
        
        const merchantId = merchant.rows[0].id;
        
        // Créer des produits de test avec prix en CFA
        const products = [
            ['iPhone 15 Pro', 'Smartphone Apple dernière génération avec puce A17 Pro', 850000],
            ['Samsung Galaxy S24', 'Smartphone Samsung avec IA intégrée et appareil photo 200MP', 720000],
            ['MacBook Air M3', 'Ordinateur portable Apple avec puce M3, 13 pouces', 1200000],
            ['AirPods Pro 2', 'Écouteurs sans fil Apple avec réduction de bruit active', 180000],
            ['iPad Air', 'Tablette Apple 10.9 pouces avec puce M1', 450000],
            ['Apple Watch Series 9', 'Montre connectée Apple avec GPS et cellular', 320000],
            ['Sony WH-1000XM5', 'Casque audio sans fil avec réduction de bruit', 250000],
            ['Nintendo Switch OLED', 'Console de jeu portable avec écran OLED', 280000]
        ];
        
        for (const [name, description, price] of products) {
            await pool.query(`
                INSERT INTO products (merchant_id, name, description, price, created_at) 
                VALUES ($1, $2, $3, $4, NOW())
            `, [merchantId, name, description, price]);
        }
        
        console.log('✅ Produits de test créés');
        
        // Créer un bot de test
        await pool.query(`
            INSERT INTO bots (merchant_id, name, personality_prompt, is_published) 
            VALUES ($1, $2, $3, $4)
        `, [
            merchantId, 
            'TechBot Abidjan', 
            'Je suis un expert en technologie basé à Abidjan. Je connais parfaitement tous nos produits Apple, Samsung et autres marques. Je peux vous conseiller selon vos besoins et votre budget en CFA.',
            true
        ]);
        
        console.log('✅ Bot de test créé');
        
        // Créer un utilisateur client de test
        await pool.query(`
            INSERT INTO users (email, password_hash, role, created_at) 
            VALUES ($1, $2, $3, NOW())
        `, ['client@test.com', '$2b$10$example.hash.for.password123', 'client']);
        
        console.log('✅ Client de test créé');
        
        console.log('\n🎉 Base de données nettoyée et réinitialisée avec succès !');
        console.log('\n📋 Données de test créées :');
        console.log('👤 Marchand : marchand@test.com (mot de passe : password123)');
        console.log('👤 Client : client@test.com (mot de passe : password123)');
        console.log('🏪 Boutique : Boutique Tech Abidjan');
        console.log('📦 8 produits avec prix en CFA');
        console.log('🤖 1 bot publié : TechBot Abidjan');
        console.log('\n💡 Vous pouvez maintenant tester votre application !');
        
    } catch (error) {
        console.error('❌ Erreur lors du nettoyage de la base de données:', error);
        throw error;
    } finally {
        await pool.end();
    }
}

// Fonction pour confirmer l'action
function confirmAction() {
    return new Promise((resolve) => {
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        rl.question('⚠️  ATTENTION : Cette action va supprimer TOUTES les données de la base. Continuer ? (oui/non): ', (answer) => {
            rl.close();
            resolve(answer.toLowerCase() === 'oui' || answer.toLowerCase() === 'o' || answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
        });
    });
}

// Exécuter le script
async function main() {
    console.log('🗄️  Script de nettoyage et réinitialisation de la base de données');
    console.log('================================================');
    
    const confirmed = await confirmAction();
    
    if (confirmed) {
        await cleanAndResetDatabase();
    } else {
        console.log('❌ Opération annulée par l\'utilisateur');
        process.exit(0);
    }
}

// Exécuter seulement si le script est appelé directement
if (require.main === module) {
    main().catch(error => {
        console.error('❌ Erreur fatale:', error);
        process.exit(1);
    });
}

module.exports = { cleanAndResetDatabase };