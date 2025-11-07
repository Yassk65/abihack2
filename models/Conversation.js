const pool = require('../config/database');

class Conversation {
    static async findOrCreate(clientId, botId) {
        // Try to find existing conversation
        const [rows] = await pool.query(
            'SELECT * FROM conversations WHERE client_id = ? AND bot_id = ?',
            [clientId, botId]
        );
        
        if (rows.length > 0) {
            // Parse JSON history if it's a string
            const conversation = rows[0];
            if (typeof conversation.history === 'string') {
                conversation.history = JSON.parse(conversation.history);
            }
            return conversation;
        }
        
        // Create new conversation if none exists
        const [result] = await pool.query(
            'INSERT INTO conversations (client_id, bot_id, history) VALUES (?, ?, ?)',
            [clientId, botId, JSON.stringify([])]
        );
        
        const [newRows] = await pool.query('SELECT * FROM conversations WHERE id = ?', [result.insertId]);
        const conversation = newRows[0];
        if (typeof conversation.history === 'string') {
            conversation.history = JSON.parse(conversation.history);
        }
        return conversation;
    }
    
    static async addMessage(clientId, botId, role, content) {
        const conversation = await this.findOrCreate(clientId, botId);
        const history = Array.isArray(conversation.history) ? conversation.history : [];
        
        history.push({ role, content, timestamp: new Date().toISOString() });
        
        await pool.query(
            'UPDATE conversations SET history = ? WHERE client_id = ? AND bot_id = ?',
            [JSON.stringify(history), clientId, botId]
        );
        
        return history;
    }
    
    static async getHistory(clientId, botId) {
        const conversation = await this.findOrCreate(clientId, botId);
        return Array.isArray(conversation.history) ? conversation.history : [];
    }
}

module.exports = Conversation;