const express=require('express');
const router = express.Router();
const {getMessage} = require('../controllers/chatcontroller')
const authenticate = require('../middleware/authMiddleware')

router.get('/messages',authenticate,getMessage);

module.exports=router;