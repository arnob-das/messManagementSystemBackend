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

router.get('/getSeatRentForSingleMember/:messId/:userId', messController.getSeatRentForSingleMember);

router.get('/getApprovedMembersSeatRents/:messId', messController.getApprovedMembersSeatRents);
router.put('/updateSeatRentForUser', messController.updateSeatRentForMember);

router.get('/getTotalSeatRentForApprovedUsers/:messId', messController.getTotalSeatRentForApprovedUsers);

router.put('/updateUserRole',messController.updateUserRole)
router.put('/leave',messController.leaveMess)

module.exports = router;
