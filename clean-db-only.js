const pool = require('./config/database');

async function cleanDatabaseOnly() {
    console.log('🧹 Nettoyage complet de la base de données...');
    
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
        console.log('\n🎉 Base de données complètement nettoyée !');
        console.log('💡 Vous pouvez maintenant créer de nouvelles données de test.');
        
    } catch (error) {
        console.error('❌ Erreur lors du nettoyage:', error);
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
        
        rl.question('⚠️  ATTENTION : Cette action va supprimer TOUTES les données. Continuer ? (oui/non): ', (answer) => {
            rl.close();
            resolve(answer.toLowerCase() === 'oui' || answer.toLowerCase() === 'o' || answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
        });
    });
}

// Exécuter le script
async function main() {
    console.log('🗄️  Script de nettoyage de la base de données');
    console.log('==========================================');
    
    const confirmed = await confirmAction();
    
    if (confirmed) {
        await cleanDatabaseOnly();
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

module.exports = { cleanDatabaseOnly };