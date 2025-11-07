const express = require('express');
const User = require('../models/User');
const pool = require('../config/database');
const path = require('path');

const router = express.Router();

// Login page
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'login.html'));
});

// Register page
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'register.html'));
});

// Login POST
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByEmail(email);
        
        if (!user || !await User.validatePassword(password, user.password_hash)) {
            return res.redirect('/auth/login?error=invalid');
        }
        
        req.session.userId = user.id;
        req.session.userRole = user.role;
        
        if (user.role === 'marchand') {
            res.redirect('/merchant/dashboard');
        } else {
            res.redirect('/client/dashboard');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('<div class="error">Erreur serveur</div>');
    }
});

// Register POST
router.post('/register', async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).send('<div class="error">Cet email est déjà utilisé</div>');
        }
        
        const user = await User.create(email, password, role);
        
        // Create merchant profile if role is marchand
        if (role === 'marchand') {
            await pool.query(
                'INSERT INTO merchants (user_id, shop_name, shop_description) VALUES (?, ?, ?)',
                [user.id, 'Ma Boutique', 'Description de ma boutique']
            );
        }
        
        req.session.userId = user.id;
        req.session.userRole = user.role;
        
        if (role === 'marchand') {
            res.redirect('/merchant/dashboard');
        } else {
            res.redirect('/client/dashboard');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('<div class="error">Erreur serveur</div>');
    }
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erreur lors de la déconnexion:', err);
            return res.status(500).send('<div class="error">Erreur lors de la déconnexion</div>');
        }
        res.redirect('/');
    });
});

module.exports = router;