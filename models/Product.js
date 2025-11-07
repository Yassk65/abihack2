const pool = require('../config/database');

class Product {
    static async create(merchantId, name, description, price, characteristics) {
        const [result] = await pool.query(
            'INSERT INTO products (merchant_id, name, description, price, characteristics) VALUES (?, ?, ?, ?, ?)',
            [merchantId, name, description, price, JSON.stringify(characteristics)]
        );
        const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [result.insertId]);
        return rows[0];
    }

    static async findByMerchant(merchantId) {
        const [rows] = await pool.query(
            'SELECT * FROM products WHERE merchant_id = ? ORDER BY created_at DESC',
            [merchantId]
        );
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
        return rows[0];
    }

    static async update(id, name, description, price, characteristics) {
        await pool.query(
            'UPDATE products SET name = ?, description = ?, price = ?, characteristics = ? WHERE id = ?',
            [name, description, price, JSON.stringify(characteristics), id]
        );
        const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
        return rows[0];
    }

    static async delete(id) {
        await pool.query('DELETE FROM products WHERE id = ?', [id]);
    }
}

module.exports = Product;