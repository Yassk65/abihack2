const pool = require('./config/database');
const bcrypt = require('bcryptjs');

async function createTestMerchant() {
    try {
        console.log('🏪 Création d\'un marchand de test...\n');
        
        const email = 'test-merchant@demo.com';
        const password = 'test123';
        const shopName = 'Boutique Test';
        
        // 1. Créer l'utilisateur marchand
        console.log('👤 Création de l\'utilisateur...');
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Supprimer s'il existe déjà
        await pool.query('DELETE FROM users WHERE email = $1', [email]);
        
        const userResult = await pool.query(
            'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id',
            [email, hashedPassword, 'marchand']
        );
        const userId = userResult.rows[0].id;
        console.log('✅ Utilisateur créé:', email);
        
        // 2. Créer le profil marchand
        console.log('🏪 Création du profil marchand...');
        await pool.query(
            'INSERT INTO merchants (user_id, shop_name, shop_description) VALUES ($1, $2, $3)',
            [userId, shopName, 'Boutique de test pour les démonstrations']
        );
        console.log('✅ Profil marchand créé:', shopName);
        
        // 3. Ajouter quelques produits de test
        console.log('📦 Ajout de produits de test...');
        const products = [
            {
                name: 'Produit Test 1',
                description: 'Premier produit de démonstration',
                price: 19.99,
                characteristics: { couleur: 'rouge', taille: 'M' }
            },
            {
                name: 'Produit Test 2', 
                description: 'Deuxième produit de démonstration',
                price: 29.99,
                characteristics: { couleur: 'bleu', matière: 'coton' }
            }
        ];
        
        for (const product of products) {
            await pool.query(
                'INSERT INTO products (merchant_id, name, description, price, characteristics) VALUES ($1, $2, $3, $4, $5)',
                [userId, product.name, product.description, product.price, JSON.stringify(product.characteristics)]
            );
            console.log(`  ✅ ${product.name} ajouté`);
        }
        
        console.log('\n🎉 Marchand de test créé avec succès !');
        console.log('\n📋 Informations de connexion:');
        console.log(`  Email: ${email}`);
        console.log(`  Mot de passe: ${password}`);
        console.log(`  Boutique: ${shopName}`);
        console.log(`  Produits: ${products.length}`);
        
        console.log('\n🚀 Instructions de test:');
        console.log('1. Allez sur http://localhost:3000/auth/login');
        console.log('2. Connectez-vous avec les identifiants ci-dessus');
        console.log('3. Vous devriez voir le dashboard avec les produits');
        console.log('4. Créez votre bot dans la section "Mon Assistant IA"');
        console.log('5. Testez ensuite en tant que client sur le marketplace');
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        if (error.code === '23505') {
            console.log('ℹ️  L\'utilisateur existe peut-être déjà.');
        }
    } finally {
        await pool.end();
    }
}

createTestMerchant();