const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

const saveBase64Image = (base64String, prefix) => {
    if (!base64String || !base64String.startsWith('data:image')) return null;
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');
    const folder = 'uploads/';
    if (!fs.existsSync(folder)) fs.mkdirSync(folder);
    const fileName = `${prefix}-${Date.now()}.jpg`;
    const filePath = path.join(folder, fileName);
    fs.writeFileSync(filePath, buffer);
    return filePath.replace(/\\/g, '/'); 
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, phone, vehicleType, adharNumber, adharPhoto, livePhoto } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const adharFilePath = saveBase64Image(adharPhoto, 'adhar');
        const profileFilePath = saveBase64Image(livePhoto, 'profile');

        user = new User({ 
            name, 
            email, 
            password, 
            role, 
            phone, 
            vehicleType, 
            adharNumber, 
            adharPhoto: adharFilePath, 
            livePhoto: profileFilePath,
            profilePhoto: profileFilePath 
        });
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({
            token,
            user: {
                id: user._id,
                name,
                email,
                role,
                phone,
                vehicleType: user.vehicleType || undefined,
                adharNumber: user.adharNumber || undefined,
                adharPhoto: user.adharPhoto || undefined,
                profilePhoto: user.profilePhoto || undefined,
                walletBalance: 0
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email,
                role: user.role,
                phone: user.phone,
                vehicleType: user.vehicleType || undefined,
                adharNumber: user.adharNumber || undefined,
                adharPhoto: user.adharPhoto || undefined,
                profilePhoto: user.profilePhoto || undefined,
                walletBalance: user.walletBalance || 0
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const authMiddleware = require('../middleware/authMiddleware');

// PUT /api/auth/profile/update
router.put('/profile/update', authMiddleware, async (req, res) => {
    try {
        const { name, profilePhoto } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (name) user.name = name;
        if (profilePhoto) {
            const photoPath = saveBase64Image(profilePhoto, 'profile');
            if (photoPath) user.profilePhoto = photoPath;
        }
        await user.save();

        res.json({
            message: 'Profile updated',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                vehicleType: user.vehicleType || undefined,
                adharNumber: user.adharNumber || undefined,
                adharPhoto: user.adharPhoto || undefined,
                profilePhoto: user.profilePhoto || undefined,
                walletBalance: user.walletBalance || 0
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
