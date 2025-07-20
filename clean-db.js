const pool = require('./config/database');

async function cleanDatabase() {
    try {
        console.log('🧹 Nettoyage de la base de données...');
        
        // Supprimer toutes les tables dans l'ordre (à cause des contraintes de clés étrangères)
        const dropQueries = [
            'DROP TABLE IF EXISTS conversations CASCADE;',
            'DROP TABLE IF EXISTS bots CASCADE;',
            'DROP TABLE IF EXISTS products CASCADE;',
            'DROP TABLE IF EXISTS merchants CASCADE;',
            'DROP TABLE IF EXISTS users CASCADE;'
        ];
        
        for (const query of dropQueries) {
            await pool.query(query);
            console.log(`✅ ${query}`);
        }
        
        console.log('🎉 Base de données nettoyée avec succès !');
        console.log('Vous pouvez maintenant exécuter: npm run init-db');
        
    } catch (error) {
        console.error('❌ Erreur lors du nettoyage:', error.message);
    } finally {
        await pool.end();
    }
}

cleanDatabase();