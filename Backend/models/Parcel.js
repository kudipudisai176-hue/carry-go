const mongoose = require('mongoose');

const parcelSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        senderName: {
            type: String,
            required: true,
        },
        receiverName: {
            type: String,
            required: true,
        },
        receiverPhone: {
            type: String,
            required: true,
        },
        fromLocation: {
            type: String,
            required: true,
        },
        toLocation: {
            type: String,
            required: true,
        },
        weight: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            default: 'pending',
            enum: ['pending', 'requested', 'accepted', 'in-transit', 'delivered']
        },
        travellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        travellerName: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
);

const Parcel = mongoose.model('Parcel', parcelSchema);

module.exports = Parcel;
