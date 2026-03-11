const mongoose = require('mongoose');

console.log("Starting MongoDB connection test...");

mongoose.connect("mongodb://127.0.0.1:27017/carrygo", {
    serverSelectionTimeoutMS: 5000 // timeout after 5s
})
    .then(() => {
        console.log("Successfully connected to MongoDB");
        process.exit(0);
    })
    .catch(err => {
        console.error("Failed to connect to MongoDB:", err.message);
        process.exit(1);
    });
