const express = require('express');
const router = express.Router();
const LoginController = require('../../controllers/login.controller');
// const verifyToken = require('../../middleware/authMiddleware');

router.post('/', LoginController.login)

module.exports = router;