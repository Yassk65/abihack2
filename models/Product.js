const pool = require('../config/database');

class Product {
    static async create(merchantId, name, description, price, characteristics) {
        const result = await pool.query(
            'INSERT INTO products (merchant_id, name, description, price, characteristics) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [merchantId, name, description, price, characteristics]
        );
        return result.rows[0];
    }

    static async findByMerchant(merchantId) {
        const result = await pool.query(
            'SELECT * FROM products WHERE merchant_id = $1 ORDER BY created_at DESC',
            [merchantId]
        );
        return result.rows;
    }

    static async findById(id) {
        const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async update(id, name, description, price, characteristics) {
        const result = await pool.query(
            'UPDATE products SET name = $1, description = $2, price = $3, characteristics = $4 WHERE id = $5 RETURNING *',
            [name, description, price, characteristics, id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        await pool.query('DELETE FROM products WHERE id = $1', [id]);
    }
}

module.exports = Product;