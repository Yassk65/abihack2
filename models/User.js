const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    static async create(email, password, role) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
            [email, hashedPassword, role]
        );
        const [rows] = await pool.query('SELECT id, email, role FROM users WHERE id = ?', [result.insertId]);
        return rows[0];
    }

    static async findByEmail(email) {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    static async validatePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }

    static async findById(id) {
        const [rows] = await pool.query('SELECT id, email, role FROM users WHERE id = ?', [id]);
        return rows[0];
    }
}

module.exports = User;