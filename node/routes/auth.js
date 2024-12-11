// routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware for error handling
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Create new user
router.post('/createUser', asyncHandler(async (req, res) => {
    const { username, email, password, loc, picUrl } = req.body;



    // Check if user or email already exists
    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (existingUser) {
        return res.status(400).json({
            error: existingUser.email === email ?
                'Email already registered' :
                'Username already taken'
        });
    }

    // Create new user
    const user = new User({
        username,
        email,
        password,
        picUrl,
        pinnedSpecies: [],
        loc,
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully' });
}));

// Login user
router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
        {
            userId: user._id,
            email: user.email,
            username: user.username
        },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.json({
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            picUrl: user.picUrl,
            pinnedSpecies: user.pinnedSpecies,
            loc: user.loc
        }
    });
}));

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid token' });
    }
};

module.exports = { router, authenticateToken };