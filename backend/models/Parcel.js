const mongoose = require('mongoose');

const parcelSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    travellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    weight: { type: Number, required: true }, // in kg
    pickupLocation: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        address: { type: String, required: true }
    },
    deliveryLocation: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        address: { type: String, required: true }
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'picked-up', 'delivered', 'completed', 'cancelled'],
        default: 'pending'
    },
    pickupOTP: { type: String },
    deliveryOTP: { type: String },
    pickupPhoto: { type: String },
    deliveryPhoto: { type: String },
    price: { type: Number, required: true },
    paymentReleased: { type: Boolean, default: false },
    receiverConfirm: { type: Boolean, default: false },
    currentLocation: {
        lat: { type: Number },
        lng: { type: Number }
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Parcel', parcelSchema);
