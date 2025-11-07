const fs = require('fs');
const pool = require('./config/database');

async function initDatabase() {
    let connection;
    try {
        console.log('Initialisation de la base de données MySQL...');
        
        connection = await pool.getConnection();
        const schema = fs.readFileSync('./database/schema.sql', 'utf8');
        
        // Séparer et exécuter chaque instruction SQL
        const statements = schema
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);
        
        for (const statement of statements) {
            await connection.query(statement);
        }
        
        console.log('✅ Base de données MySQL initialisée avec succès !');
        console.log('Vous pouvez maintenant démarrer le serveur avec: npm start');
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error.message);
        console.log('\nAssurez-vous que:');
        console.log('1. MySQL/phpMyAdmin est installé et démarré');
        console.log('2. La base de données "robi_marketplace" existe');
        console.log('3. Les paramètres de connexion dans .env sont corrects');
        console.log('4. L\'utilisateur MySQL a les permissions nécessaires');
    } finally {
        if (connection) connection.release();
        await pool.end();
    }
}

initDatabase();