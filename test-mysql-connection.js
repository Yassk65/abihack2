const pool = require('./config/database');

async function testConnection() {
    console.log('🔍 Test de connexion MySQL...\n');
    
    try {
        // Test 1: Connexion basique
        console.log('1️⃣ Test de connexion...');
        const [rows] = await pool.query('SELECT 1 + 1 AS result');
        console.log('✅ Connexion réussie! Résultat:', rows[0].result);
        
        // Test 2: Vérifier la base de données
        console.log('\n2️⃣ Vérification de la base de données...');
        const [dbInfo] = await pool.query('SELECT DATABASE() as db_name');
        console.log('✅ Base de données active:', dbInfo[0].db_name);
        
        // Test 3: Lister les tables
        console.log('\n3️⃣ Liste des tables...');
        const [tables] = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = DATABASE()
            ORDER BY table_name
        `);
        
        if (tables.length === 0) {
            console.log('⚠️  Aucune table trouvée. Exécutez: npm run init-db');
        } else {
            console.log('✅ Tables trouvées:');
            tables.forEach((table, index) => {
                console.log(`   ${index + 1}. ${table.TABLE_NAME || table.table_name}`);
            });
        }
        
        // Test 4: Version MySQL
        console.log('\n4️⃣ Version MySQL...');
        const [version] = await pool.query('SELECT VERSION() as version');
        console.log('✅ Version:', version[0].version);
        
        console.log('\n🎉 Tous les tests sont passés avec succès!');
        console.log('💡 Vous pouvez maintenant démarrer le serveur avec: npm start');
        
    } catch (error) {
        console.error('\n❌ Erreur de connexion:', error.message);
        console.log('\n🔧 Vérifications à faire:');
        console.log('1. MySQL est-il démarré?');
        console.log('2. Les paramètres dans .env sont-ils corrects?');
        console.log('3. La base de données existe-t-elle?');
        console.log('\n📝 Configuration actuelle (.env):');
        console.log('   DB_HOST:', process.env.DB_HOST || 'localhost');
        console.log('   DB_USER:', process.env.DB_USER || 'root');
        console.log('   DB_NAME:', process.env.DB_NAME || 'robi_marketplace');
        console.log('   DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : '(vide)');
    } finally {
        await pool.end();
    }
}

testConnection();
