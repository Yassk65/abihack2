const pool = require('./config/database');

async function checkData() {
    try {
        console.log('🔍 Vérification des données MySQL...\n');
        
        // Vérifier les utilisateurs
        const [users] = await pool.query('SELECT id, email, role FROM users LIMIT 5');
        console.log('👥 Utilisateurs:', users.length);
        users.forEach(user => {
            console.log(`  - ${user.email} (${user.role})`);
        });
        
        // Vérifier les marchands
        const [merchants] = await pool.query('SELECT * FROM merchants LIMIT 5');
        console.log('\n🏪 Marchands:', merchants.length);
        merchants.forEach(merchant => {
            console.log(`  - ${merchant.shop_name}`);
        });
        
        // Vérifier les produits
        const [products] = await pool.query('SELECT name, price FROM products LIMIT 5');
        console.log('\n📦 Produits:', products.length);
        products.forEach(product => {
            console.log(`  - ${product.name}: ${product.price}€`);
        });
        
        // Vérifier les bots
        const [bots] = await pool.query('SELECT name, is_published FROM bots LIMIT 5');
        console.log('\n🤖 Bots:', bots.length);
        bots.forEach(bot => {
            console.log(`  - ${bot.name} (${bot.is_published ? 'Publié' : 'Brouillon'})`);
        });
        
        // Vérifier les conversations
        const [conversations] = await pool.query('SELECT id, history FROM conversations LIMIT 3');
        console.log('\n💬 Conversations:', conversations.length);
        conversations.forEach(conv => {
            let history = conv.history;
            if (typeof history === 'string') {
                history = JSON.parse(history);
            }
            const historyLength = Array.isArray(history) ? history.length : 0;
            console.log(`  - Conversation ${conv.id}: ${historyLength} messages`);
        });
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    } finally {
        await pool.end();
    }
}

checkData();