// routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { User } = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET;

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = 'public/images';
        // Create directory if it doesn't exist
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        // Create unique filename using username (if available) and timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'pfp-' + uniqueSuffix + path.extname(file.originalname));
    }
});

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

const upload = multer({ storage: storage });

// Middleware for error handling
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Update existing user
router.put('/updateUser', authenticateToken, asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const { username, email, password, loc, profilePicture } = req.body;

    try {
        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update the user's information
        user.username = username || user.username;
        user.email = email || user.email;
        if (password) {
            user.password = password;
        }
        user.loc = loc ? JSON.parse(loc) : user.loc;
        if (profilePicture) {
            user.picUrl = `/images/${profilePicture.filename}`;
        }

        await user.save();

        res.json({
            message: 'User updated successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                picUrl: user.picUrl,
                pinnedSpecies: user.pinnedSpecies,
                loc: user.loc
            }
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ error: 'Error updating user' });
    }
}));

// Create new user
router.post('/createUser', upload.single('profilePicture'), asyncHandler(async (req, res) => {
    const { username, email, password, loc } = req.body;

    // Check if user or email already exists
    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (existingUser) {
        // Remove uploaded file if user creation fails
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
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
        picUrl: req.file ? `/images/${req.file.filename}` : null,
        pinnedSpecies: [],
        loc: JSON.parse(loc),
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





module.exports = { router, authenticateToken };