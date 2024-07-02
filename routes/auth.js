const express = require('express');
const authRouter = express.Router();
const bcryptjs = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

//sign up routes
authRouter.post("/api/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists, try to log in!" });
        }
        const hashedPassword = await bcryptjs.hash(password, 8);
        let user = new User({
            name,
            email,
            password: hashedPassword,  
        });
        user = await user.save();
        res.json({ user });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

//Log in routes
authRouter.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found, please sign up!" });
        }
        const passwordMatch = await bcryptjs.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: "Invalid credentials!" });
        }
        const token = jwt.sign({ id: user._id }, "passwordKey");
        res.json({ token, ...user._doc});
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = authRouter; 