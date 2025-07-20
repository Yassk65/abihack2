const fs = require('fs');
const pool = require('./config/database');

async function initDatabase() {
    try {
        console.log('Initialisation de la base de données...');
        
        const schema = fs.readFileSync('./database/schema.sql', 'utf8');
        await pool.query(schema);
        
        console.log('✅ Base de données initialisée avec succès !');
        console.log('Vous pouvez maintenant démarrer le serveur avec: npm start');
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error.message);
        console.log('\nAssurez-vous que:');
        console.log('1. PostgreSQL est installé et démarré');
        console.log('2. La base de données "robi_marketplace" existe');
        console.log('3. Les paramètres de connexion dans .env sont corrects');
    } finally {
        await pool.end();
    }
}

initDatabase();