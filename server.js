const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const merchantRoutes = require('./routes/merchant');
const marketplaceRoutes = require('./routes/marketplace');
const chatRoutes = require('./routes/chat');
const clientRoutes = require('./routes/client');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Routes
app.use('/auth', authRoutes);
app.use('/merchant', merchantRoutes);
app.use('/marketplace', marketplaceRoutes);
app.use('/chat', chatRoutes);
app.use('/client', clientRoutes);

// Home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});