const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    static async create(email, password, role) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role',
            [email, hashedPassword, role]
        );
        return result.rows[0];
    }

    static async findByEmail(email) {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    }

    static async validatePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }

    static async findById(id) {
        const result = await pool.query('SELECT id, email, role FROM users WHERE id = $1', [id]);
        return result.rows[0];
    }
}

module.exports = User;