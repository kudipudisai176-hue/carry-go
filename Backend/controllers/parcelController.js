const Parcel = require('../models/Parcel');

// POST /api/parcel/create-parcel
const createParcel = async (req, res) => {
    try {
        const { title, description, weight, size, itemCount, vehicleType, pickupLocation, deliveryLocation, price, paymentMethod, paymentStatus, receiverName, receiverPhone, senderName, senderPhone } = req.body;

        const parcel = new Parcel({
            senderId: req.user.id,
            senderName: senderName || req.user.name,
            senderPhone: senderPhone || req.user.phone,
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
            price,
            paymentMethod,
            paymentStatus: paymentStatus || 'unpaid'
        });
        await parcel.save();
        res.status(201).json(parcel);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/parcel/update-payment
const updatePayment = async (req, res) => {
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
};

// POST /api/parcel/receive-confirm
const receiveConfirm = async (req, res) => {
    try {
        const { parcelId } = req.body;
        const parcel = await Parcel.findById(parcelId);
        if (!parcel) return res.status(404).json({ message: 'Parcel not found' });

        parcel.status = 'received';
        parcel.receiverConfirm = true;
        await parcel.save();
        res.json(parcel);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/parcel/request-parcel
const requestParcel = async (req, res) => {
    try {
        const { parcelId, travellerName } = req.body;
        const parcel = await Parcel.findById(parcelId);
        if (!parcel) return res.status(404).json({ message: 'Parcel not found' });
        if (parcel.status !== 'pending') return res.status(400).json({ message: 'Parcel already in progress' });

        const User = require('../models/User');
        const traveller = await User.findById(req.user.id);

        parcel.travellerId = req.user.id;
        parcel.travellerName = travellerName || traveller.name;
        parcel.travellerPhone = traveller.phone;
        parcel.status = 'requested';
        await parcel.save();
        res.json(parcel);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/parcel/accept-request
const acceptRequest = async (req, res) => {
    try {
        const { parcelId } = req.body;
        const parcel = await Parcel.findById(parcelId);
        if (!parcel) return res.status(404).json({ message: 'Parcel not found' });
        if (parcel.status !== 'requested') return res.status(400).json({ message: 'No request found' });
        if (parcel.senderId.toString() !== req.user.id) return res.status(401).json({ message: 'Unauthorized' });

        parcel.status = 'accepted';
        parcel.pickupOtp = Math.floor(1000 + Math.random() * 9000).toString();
        await parcel.save();
        res.json(parcel);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/parcel/update-status
const updateParcelStatus = async (req, res) => {
    try {
        const { parcelId, status, otp } = req.body;
        const parcel = await Parcel.findById(parcelId);
        if (!parcel) return res.status(404).json({ message: 'Parcel not found' });

        if ((status === 'picked-up' || status === 'in-transit') && parcel.status === 'accepted') {
            if (parcel.pickupOtp && parcel.pickupOtp !== otp) {
                return res.status(400).json({ message: 'Invalid OTP' });
            }
        }

        parcel.status = status;
        await parcel.save();
        res.json(parcel);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/parcel/my-parcels
const getMyParcels = async (req, res) => {
    try {
        const parcels = await Parcel.find({ senderId: req.user.id }).sort({ createdAt: -1 });
        res.json(parcels);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/parcel/my-deliveries
const getMyDeliveries = async (req, res) => {
    try {
        const parcels = await Parcel.find({ travellerId: req.user.id }).sort({ createdAt: -1 });
        res.json(parcels);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/parcel/search
const searchParcels = async (req, res) => {
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
};

// GET /api/parcel/by-phone/:phone
const getParcelsByReceiverPhone = async (req, res) => {
    try {
        const parcels = await Parcel.find({ receiverPhone: req.params.phone }).sort({ createdAt: -1 });
        res.json(parcels);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE /api/parcel/:id
const deleteParcel = async (req, res) => {
    try {
        const parcel = await Parcel.findById(req.params.id);
        if (!parcel) return res.status(404).json({ message: 'Parcel not found' });
        if (parcel.senderId.toString() !== req.user.id) return res.status(401).json({ message: 'Unauthorized' });

        await Parcel.findByIdAndDelete(req.params.id);
        res.json({ message: 'Parcel deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createParcel,
    updatePayment,
    receiveConfirm,
    requestParcel,
    acceptRequest,
    updateParcelStatus,
    getMyParcels,
    getMyDeliveries,
    searchParcels,
    getParcelsByReceiverPhone,
    deleteParcel
};
