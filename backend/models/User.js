const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['sender', 'traveller', 'receiver'], required: true },
    phone: { type: String, required: true },
    vehicleType: { type: String }, // For travellers
    identificationType: { type: String, enum: ['aadhar', 'pan'] }, // For traveller verification
    adharNumber: { type: String }, // For traveller verification
    adharPhoto: { type: String }, // Base64 or file path
    livePhoto: { type: String },  // Base64 or file path
    profilePhoto: { type: String },
    bio: { type: String, default: "" },
    totalTrips: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        return false;
    }
};

module.exports = mongoose.model('User', userSchema);
