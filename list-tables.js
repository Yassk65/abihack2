const pool = require('./config/database');

async function listTables() {
    try {
        console.log('📋 Tables existantes dans la base de données MySQL:');
        
        const [rows] = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = DATABASE()
            ORDER BY table_name;
        `);
        
        if (rows.length === 0) {
            console.log('✅ Aucune table trouvée - base de données vide');
        } else {
            rows.forEach((row, index) => {
                console.log(`${index + 1}. ${row.TABLE_NAME || row.table_name}`);
            });
        }
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    } finally {
        await pool.end();
    }
}

listTables();