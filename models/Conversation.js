const pool = require('../config/database');

class Conversation {
    static async findOrCreate(clientId, botId) {
        // Try to find existing conversation
        let result = await pool.query(
            'SELECT * FROM conversations WHERE client_id = $1 AND bot_id = $2',
            [clientId, botId]
        );
        
        if (result.rows.length > 0) {
            return result.rows[0];
        }
        
        // Create new conversation if none exists
        result = await pool.query(
            'INSERT INTO conversations (client_id, bot_id, history) VALUES ($1, $2, $3) RETURNING *',
            [clientId, botId, JSON.stringify([])]
        );
        
        return result.rows[0];
    }
    
    static async addMessage(clientId, botId, role, content) {
        const conversation = await this.findOrCreate(clientId, botId);
        const history = conversation.history || [];
        
        history.push({ role, content, timestamp: new Date().toISOString() });
        
        await pool.query(
            'UPDATE conversations SET history = $1 WHERE client_id = $2 AND bot_id = $3',
            [JSON.stringify(history), clientId, botId]
        );
        
        return history;
    }
    
    static async getHistory(clientId, botId) {
        const conversation = await this.findOrCreate(clientId, botId);
        return conversation.history || [];
    }
}

module.exports = Conversation;