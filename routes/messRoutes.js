// routes/messRoutes.js
const express = require('express');
const router = express.Router();
const messController = require('../controllers/MessController');

// Create a mess
router.post('/create', messController.createMess);

router.get('/:id', messController.getMessById);

router.post('/addMemberToMess',messController.addMemberToMess);

router.get('/getUnapprovedMembers/:messId',messController.getUnapprovedMembers);
router.get('/getApprovedMembers/:messId',messController.getApprovedMembers);

router.post('/setSeatRent', messController.setSeatRentForMember);
router.get('/getSeatRentForUser', messController.getSeatRentForMember);
router.get('/getApprovedMembersSeatRents/:messId', messController.getApprovedMembersSeatRents);
router.put('/updateSeatRentForUser', messController.updateSeatRentForMember);

module.exports = router;
