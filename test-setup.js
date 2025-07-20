const pool = require('./config/database');
const openRouterService = require('./services/openrouter');

async function testSetup() {
    console.log('🔧 Test de la configuration...\n');
    
    // Test 1: Base de données
    console.log('1️⃣ Test de la base de données...');
    try {
        const result = await pool.query('SELECT NOW()');
        console.log('✅ Base de données connectée:', result.rows[0].now);
    } catch (error) {
        console.log('❌ Erreur base de données:', error.message);
        return;
    }
    
    // Test 2: Tables existantes
    console.log('\n2️⃣ Vérification des tables...');
    try {
        const tables = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        `);
        
        const expectedTables = ['users', 'merchants', 'products', 'bots', 'conversations'];
        const existingTables = tables.rows.map(row => row.table_name);
        
        expectedTables.forEach(table => {
            if (existingTables.includes(table)) {
                console.log(`✅ Table ${table} existe`);
            } else {
                console.log(`❌ Table ${table} manquante`);
            }
        });
        
    } catch (error) {
        console.log('❌ Erreur vérification tables:', error.message);
    }
    
    // Test 3: OpenRouter API
    console.log('\n3️⃣ Test de l\'API OpenRouter...');
    try {
        // Créer un bot de test
        const testBot = {
            name: 'Test Bot',
            personality_prompt: 'Tu es un assistant de test.',
            merchant_id: 'test-merchant'
        };
        
        const testProducts = [
            {
                name: 'Produit Test',
                description: 'Un produit de test',
                price: 10.99,
                characteristics: { couleur: 'rouge' }
            }
        ];
        
        console.log('🚀 Envoi d\'une requête test à OpenRouter...');
        const response = await openRouterService.generateResponse(testBot, [], 'Bonjour, pouvez-vous me présenter vos produits ?');
        
        if (response && response.length > 0) {
            console.log('✅ API OpenRouter fonctionne');
            console.log('📝 Réponse test:', response.substring(0, 100) + '...');
        } else {
            console.log('❌ Réponse vide de l\'API');
        }
        
    } catch (error) {
        console.log('❌ Erreur API OpenRouter:', error.message);
    }
    
    console.log('\n🏁 Test terminé');
    await pool.end();
}

// Simuler les produits pour le test
const Product = {
    findByMerchant: async () => [
        {
            name: 'Produit Test',
            description: 'Un produit de test',
            price: 10.99,
            characteristics: { couleur: 'rouge' }
        }
    ]
};

// Remplacer temporairement pour le test
const originalRequire = require;
require = function(id) {
    if (id === '../models/Product') {
        return Product;
    }
    return originalRequire(id);
};

testSetup();