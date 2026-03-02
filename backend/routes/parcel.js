const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Parcel = require('../models/Parcel');
const auth = require('../middleware/authMiddleware');

// Multer Setup for Photo Uploads
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// POST /api/parcel/create-parcel
router.post('/create-parcel', auth, async (req, res) => {
    try {
        const { title, description, weight, pickupLocation, deliveryLocation, price } = req.body;
        const parcel = new Parcel({
            senderId: req.user.id,
            title,
            description,
            weight,
            pickupLocation,
            deliveryLocation,
            price,
            pickupOTP: Math.floor(1000 + Math.random() * 9000).toString(),
            deliveryOTP: Math.floor(1000 + Math.random() * 9000).toString()
        });
        await parcel.save();
        res.status(201).json(parcel);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/parcel/accept-parcel
router.post('/accept-parcel', auth, async (req, res) => {
    try {
        const { parcelId } = req.body;
        const parcel = await Parcel.findById(parcelId);
        if (!parcel) return res.status(404).json({ message: 'Parcel not found' });
        if (parcel.status !== 'pending') return res.status(400).json({ message: 'Parcel already accepted or in progress' });

        parcel.travellerId = req.user.id;
        parcel.status = 'accepted';
        await parcel.save();
        res.json(parcel);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/parcel/pickup-confirm
router.post('/pickup-confirm', auth, upload.single('photo'), async (req, res) => {
    try {
        const { parcelId, otp } = req.body;
        const parcel = await Parcel.findById(parcelId);
        if (!parcel) return res.status(404).json({ message: 'Parcel not found' });
        if (parcel.pickupOTP !== otp) return res.status(400).json({ message: 'Invalid OTP' });

        parcel.status = 'picked-up';
        parcel.pickupPhoto = req.file ? req.file.path : null;
        await parcel.save();
        res.json(parcel);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/parcel/delivery-confirm
router.post('/delivery-confirm', auth, upload.single('photo'), async (req, res) => {
    try {
        const { parcelId, otp } = req.body;
        const parcel = await Parcel.findById(parcelId);
        if (!parcel) return res.status(404).json({ message: 'Parcel not found' });
        if (parcel.deliveryOTP !== otp) return res.status(400).json({ message: 'Invalid OTP' });

        parcel.status = 'delivered';
        parcel.deliveryPhoto = req.file ? req.file.path : null;
        await parcel.save();
        res.json(parcel);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/parcel/release-payment
router.post('/release-payment', auth, async (req, res) => {
    try {
        const { parcelId } = req.body;
        const parcel = await Parcel.findById(parcelId);
        if (!parcel) return res.status(404).json({ message: 'Parcel not found' });
        if (parcel.status !== 'delivered') return res.status(400).json({ message: 'Parcel not yet delivered' });

        parcel.paymentReleased = true;
        parcel.status = 'completed';
        await parcel.save();
        res.json(parcel);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/parcel/track-location/:id
router.get('/track-location/:id', async (req, res) => {
    try {
        const parcel = await Parcel.findById(req.params.id);
        if (!parcel) return res.status(404).json({ message: 'Parcel not found' });
        res.json({ currentLocation: parcel.currentLocation, status: parcel.status });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
