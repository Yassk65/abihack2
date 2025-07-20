const pool = require('./config/database');

async function listTables() {
    try {
        console.log('📋 Tables existantes dans la base de données:');
        
        const result = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        `);
        
        if (result.rows.length === 0) {
            console.log('✅ Aucune table trouvée - base de données vide');
        } else {
            result.rows.forEach((row, index) => {
                console.log(`${index + 1}. ${row.table_name}`);
            });
        }
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    } finally {
        await pool.end();
    }
}

listTables();