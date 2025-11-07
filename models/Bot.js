const pool = require('../config/database');

class Bot {
    static async create(merchantId, name, personalityPrompt) {
        const [result] = await pool.query(
            'INSERT INTO bots (merchant_id, name, personality_prompt) VALUES (?, ?, ?)',
            [merchantId, name, personalityPrompt]
        );
        const [rows] = await pool.query('SELECT * FROM bots WHERE id = ?', [result.insertId]);
        return rows[0];
    }

    static async findByMerchant(merchantId) {
        const [rows] = await pool.query(
            'SELECT * FROM bots WHERE merchant_id = ?',
            [merchantId]
        );
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await pool.query('SELECT * FROM bots WHERE id = ?', [id]);
        return rows[0];
    }

    static async update(id, name, personalityPrompt, isPublished) {
        await pool.query(
            'UPDATE bots SET name = ?, personality_prompt = ?, is_published = ? WHERE id = ?',
            [name, personalityPrompt, isPublished, id]
        );
        const [rows] = await pool.query('SELECT * FROM bots WHERE id = ?', [id]);
        return rows[0];
    }

    static async findPublished() {
        const [rows] = await pool.query(`
            SELECT b.*, m.shop_name 
            FROM bots b 
            JOIN merchants m ON b.merchant_id = m.user_id 
            WHERE b.is_published = true
        `);
        return rows;
    }
}

module.exports = Bot;