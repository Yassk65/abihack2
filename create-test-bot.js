const pool = require('./config/database');

async function createTestBot() {
    try {
        console.log('🤖 Création d\'un bot de test...');

        // Récupérer l'ID du marchand
        const merchantResult = await pool.query('SELECT user_id FROM merchants LIMIT 1');

        if (merchantResult.rows.length === 0) {
            console.log('❌ Aucun marchand trouvé');
            return;
        }

        const merchantId = merchantResult.rows[0].user_id;
        console.log('🏪 Marchand ID:', merchantId);

        // Vérifier si un bot existe déjà
        const existingBot = await pool.query('SELECT * FROM bots WHERE merchant_id = $1', [merchantId]);

        if (existingBot.rows.length > 0) {
            console.log('✅ Un bot existe déjà:', existingBot.rows[0].name);

            // Mettre à jour pour le publier
            await pool.query('UPDATE bots SET is_published = true WHERE merchant_id = $1', [merchantId]);
            console.log('📢 Bot publié !');
        } else {
            // Créer un nouveau bot
            const botResult = await pool.query(`
                INSERT INTO bots (merchant_id, name, personality_prompt, is_published) 
                VALUES ($1, $2, $3, $4) 
                RETURNING *
            `, [
                merchantId,
                'Assistant Boutique',
                'Tu es un assistant commercial sympathique et professionnel pour notre boutique. Tu aides les clients à découvrir nos produits, notamment nos délicieuses bananes ! Tu es enthousiaste et tu poses des questions pour mieux comprendre les besoins des clients. Reste toujours poli et serviable !',
                true
            ]);

            console.log('✅ Bot créé:', botResult.rows[0].name);
            console.log('📢 Bot publié !');
        }

        // Vérifier le résultat
        const finalCheck = await pool.query('SELECT * FROM bots WHERE merchant_id = $1', [merchantId]);
        console.log('\n🎉 Bot final:');
        console.log('  - Nom:', finalCheck.rows[0].name);
        console.log('  - Publié:', finalCheck.rows[0].is_published ? 'Oui' : 'Non');
        console.log('  - ID:', finalCheck.rows[0].id);

        console.log('\n✅ Vous pouvez maintenant tester le chat !');
        console.log('👉 Connectez-vous en tant que client et allez sur /marketplace');

    } catch (error) {
        console.error('❌ Erreur:', error.message);
    } finally {
        await pool.end();
    }
}

createTestBot();