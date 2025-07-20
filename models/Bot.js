const pool = require('../config/database');

class Bot {
    static async create(merchantId, name, personalityPrompt) {
        const result = await pool.query(
            'INSERT INTO bots (merchant_id, name, personality_prompt) VALUES ($1, $2, $3) RETURNING *',
            [merchantId, name, personalityPrompt]
        );
        return result.rows[0];
    }

    static async findByMerchant(merchantId) {
        const result = await pool.query(
            'SELECT * FROM bots WHERE merchant_id = $1',
            [merchantId]
        );
        return result.rows[0];
    }

    static async findById(id) {
        const result = await pool.query('SELECT * FROM bots WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async update(id, name, personalityPrompt, isPublished) {
        const result = await pool.query(
            'UPDATE bots SET name = $1, personality_prompt = $2, is_published = $3 WHERE id = $4 RETURNING *',
            [name, personalityPrompt, isPublished, id]
        );
        return result.rows[0];
    }

    static async findPublished() {
        const result = await pool.query(`
            SELECT b.*, m.shop_name 
            FROM bots b 
            JOIN merchants m ON b.merchant_id = m.user_id 
            WHERE b.is_published = true
        `);
        return result.rows;
    }
}

module.exports = Bot;