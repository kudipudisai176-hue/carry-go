const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Parcel = require('../models/Parcel');
const User = require('../models/User');
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
router.post('/create-parcel', auth, upload.single('photo'), async (req, res) => {
    try {
        let { title, description, weight, size, itemCount, vehicleType, pickupLocation, deliveryLocation, price, paymentMethod, paymentStatus, receiverName, receiverPhone, senderName } = req.body;

        // Parse locations if they come as strings (common with FormData)
        if (typeof pickupLocation === 'string') {
            try { pickupLocation = JSON.parse(pickupLocation); } catch (e) { }
        }
        if (typeof deliveryLocation === 'string') {
            try { deliveryLocation = JSON.parse(deliveryLocation); } catch (e) { }
        }

        const parcel = new Parcel({
            senderId: req.user.id,
            senderName,
            receiverName,
            receiverPhone,
            title,
            description,
            weight,
            size,
            itemCount,
            vehicleType,
            pickupLocation,
            deliveryLocation,
            price: price || (weight * 50 + 20), // default price calculation if not provided
            paymentMethod,
            parcelPhoto: req.file ? req.file.path : null,
            paymentStatus: paymentStatus || 'unpaid',
            pickupOTP: Math.floor(1000 + Math.random() * 9000).toString(),
            deliveryOTP: Math.floor(1000 + Math.random() * 9000).toString()
        });
        await parcel.save();
        res.status(201).json(parcel);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// POST /api/parcel/update-payment
router.post('/update-payment', auth, async (req, res) => {
    try {
        const { parcelId, paymentStatus } = req.body;
        const parcel = await Parcel.findById(parcelId);
        if (!parcel) return res.status(404).json({ message: 'Parcel not found' });

        parcel.paymentStatus = paymentStatus;
        await parcel.save();
        res.json(parcel);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/parcel/receive-confirm
router.post('/receive-confirm', auth, async (req, res) => {
    try {
        const { parcelId } = req.body;
        const parcel = await Parcel.findById(parcelId);
        if (!parcel) return res.status(404).json({ message: 'Parcel not found' });

        parcel.status = 'received';
        parcel.receiverConfirm = true;
        await parcel.save();

        // Notify Traveller
        if (parcel.travellerId) {
            req.io.to(parcel.travellerId.toString()).emit('parcel-status-update', {
                parcel,
                status: 'received'
            });
        }

        res.json(parcel);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/parcel/request-parcel
router.post('/request-parcel', auth, async (req, res) => {
    try {
        const { parcelId, travellerName } = req.body;
        const parcel = await Parcel.findById(parcelId);
        if (!parcel) return res.status(404).json({ message: 'Parcel not found' });
        if (parcel.status !== 'pending') return res.status(400).json({ message: 'Parcel already in progress' });

        const traveller = await User.findById(req.user.id);
        if (traveller) {
            parcel.travellerPhone = traveller.phone;
            parcel.travellerAdharNumber = traveller.adharNumber;
            parcel.travellerAdharPhoto = traveller.adharPhoto;
            parcel.travellerPhoto = traveller.profilePhoto;
        }

        parcel.travellerId = req.user.id;
        parcel.travellerName = travellerName;
        parcel.status = 'requested';
        await parcel.save();

        // Notify Sender
        req.io.to(parcel.senderId.toString()).emit('parcel-requested', {
            parcel,
            travellerName
        });

        // Notify Receiver
        req.io.to(parcel.receiverPhone).emit('parcel-status-update', {
            parcel,
            status: 'requested'
        });

        res.json(parcel);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/parcel/accept-request
router.post('/accept-request', auth, async (req, res) => {
    try {
        const { parcelId } = req.body;
        const parcel = await Parcel.findById(parcelId);
        if (!parcel) return res.status(404).json({ message: 'Parcel not found' });
        if (parcel.status !== 'requested') return res.status(400).json({ message: 'No request found' });
        if (parcel.senderId.toString() !== req.user.id) return res.status(401).json({ message: 'Unauthorized' });

        parcel.status = 'accepted';
        await parcel.save();

        // Notify Traveller
        if (parcel.travellerId) {
            req.io.to(parcel.travellerId.toString()).emit('parcel-accepted', {
                parcel,
                otp: parcel.pickupOTP
            });
        }

        // Notify Receiver
        req.io.to(parcel.receiverPhone).emit('parcel-status-update', {
            parcel,
            status: 'accepted'
        });

        res.json(parcel);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/parcel/update-status
router.post('/update-status', auth, async (req, res) => {
    try {
        const { parcelId, status } = req.body;
        const parcel = await Parcel.findById(parcelId);
        if (!parcel) return res.status(404).json({ message: 'Parcel not found' });

        // Simple validation for state machine
        parcel.status = status;
        await parcel.save();

        // Notify all parties
        const notifyRooms = [
            parcel.senderId.toString(),
            parcel.travellerId?.toString(),
            parcel.receiverPhone
        ].filter(Boolean);

        notifyRooms.forEach(room => {
            req.io.to(room).emit('parcel-status-update', { parcel, status });
        });

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
        if (parcel.pickupOTP && parcel.pickupOTP !== otp) return res.status(400).json({ message: 'Invalid OTP' });

        parcel.status = 'picked-up';
        parcel.pickupPhoto = req.file ? req.file.path : null;
        await parcel.save();

        // Notify Sender
        req.io.to(parcel.senderId.toString()).emit('parcel-status-update', {
            parcel,
            status: 'picked-up'
        });

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
        if (parcel.deliveryOTP && parcel.deliveryOTP !== otp) return res.status(400).json({ message: 'Invalid OTP' });

        parcel.status = 'delivered';
        parcel.deliveryPhoto = req.file ? req.file.path : null;
        await parcel.save();

        // Notify Sender
        req.io.to(parcel.senderId.toString()).emit('parcel-status-update', {
            parcel,
            status: 'delivered'
        });

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
        if (parcel.status !== 'received' && parcel.status !== 'delivered') return res.status(400).json({ message: 'Parcel not yet received' });
        if (parcel.paymentReleased) return res.status(400).json({ message: 'Payment already released' });

        // Actually add money to Traveller's wallet
        if (parcel.travellerId) {
            const User = require('../models/User'); // Import if not at top
            const traveller = await User.findById(parcel.travellerId);
            if (traveller) {
                traveller.walletBalance = (traveller.walletBalance || 0) + (parcel.price || 0);
                await traveller.save();
            }
        }

        parcel.paymentReleased = true;
        parcel.status = 'completed';
        await parcel.save();
        res.json(parcel);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/parcel/my-parcels
router.get('/my-parcels', auth, async (req, res) => {
    try {
        const parcels = await Parcel.find({ senderId: req.user.id }).sort({ createdAt: -1 });
        res.json(parcels);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/parcel/search
router.get('/search', async (req, res) => {
    try {
        const { from, to } = req.query;
        let query = { status: { $in: ['pending', 'requested'] } };
        if (from) query['pickupLocation.address'] = { $regex: from, $options: 'i' };
        if (to) query['deliveryLocation.address'] = { $regex: to, $options: 'i' };

        const parcels = await Parcel.find(query).sort({ createdAt: -1 });
        res.json(parcels);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/parcel/by-phone/:phone
router.get('/by-phone/:phone', async (req, res) => {
    try {
        const parcels = await Parcel.find({ receiverPhone: req.params.phone }).sort({ createdAt: -1 });
        res.json(parcels);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/parcel/:id
router.delete('/:id', auth, async (req, res) => {
    try {
        const parcel = await Parcel.findById(req.params.id);
        if (!parcel) return res.status(404).json({ message: 'Parcel not found' });
        if (parcel.senderId.toString() !== req.user.id) return res.status(401).json({ message: 'Unauthorized' });

        await Parcel.findByIdAndDelete(req.params.id);
        res.json({ message: 'Parcel deleted' });
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
