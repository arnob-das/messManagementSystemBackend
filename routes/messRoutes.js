// routes/messRoutes.js
const express = require('express');
const router = express.Router();
const messController = require('../controllers/MessController');

// Create a mess
router.post('/create', messController.createMess);

router.get('/:id', messController.getMessById);

router.post('/addMemberToMess',messController.addMemberToMess);

// get upapproved users of a mess after joining a mess
router.get('/getUnapprovedMembers/:messId',messController.getUnapprovedMembers);

module.exports = router;
