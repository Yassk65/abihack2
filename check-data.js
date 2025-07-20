const pool = require('./config/database');

async function checkData() {
    try {
        console.log('🔍 Vérification des données...\n');
        
        // Vérifier les utilisateurs
        const users = await pool.query('SELECT id, email, role FROM users LIMIT 5');
        console.log('👥 Utilisateurs:', users.rows.length);
        users.rows.forEach(user => {
            console.log(`  - ${user.email} (${user.role})`);
        });
        
        // Vérifier les marchands
        const merchants = await pool.query('SELECT * FROM merchants LIMIT 5');
        console.log('\n🏪 Marchands:', merchants.rows.length);
        merchants.rows.forEach(merchant => {
            console.log(`  - ${merchant.shop_name}`);
        });
        
        // Vérifier les produits
        const products = await pool.query('SELECT name, price FROM products LIMIT 5');
        console.log('\n📦 Produits:', products.rows.length);
        products.rows.forEach(product => {
            console.log(`  - ${product.name}: ${product.price}€`);
        });
        
        // Vérifier les bots
        const bots = await pool.query('SELECT name, is_published FROM bots LIMIT 5');
        console.log('\n🤖 Bots:', bots.rows.length);
        bots.rows.forEach(bot => {
            console.log(`  - ${bot.name} (${bot.is_published ? 'Publié' : 'Brouillon'})`);
        });
        
        // Vérifier les conversations
        const conversations = await pool.query('SELECT id, history FROM conversations LIMIT 3');
        console.log('\n💬 Conversations:', conversations.rows.length);
        conversations.rows.forEach(conv => {
            const historyLength = Array.isArray(conv.history) ? conv.history.length : 0;
            console.log(`  - Conversation ${conv.id}: ${historyLength} messages`);
        });
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    } finally {
        await pool.end();
    }
}

checkData();