const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/parcelController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-parcel', protect, createParcel);
router.post('/update-payment', protect, updatePayment);
router.post('/receive-confirm', protect, receiveConfirm);
router.post('/request-parcel', protect, requestParcel);
router.post('/accept-request', protect, acceptRequest);
router.post('/update-status', protect, updateParcelStatus);
router.get('/my-parcels', protect, getMyParcels);
router.get('/my-deliveries', protect, getMyDeliveries);
router.get('/search', searchParcels);
router.get('/by-phone/:phone', getParcelsByReceiverPhone);
router.delete('/:id', protect, deleteParcel);

module.exports = router;
