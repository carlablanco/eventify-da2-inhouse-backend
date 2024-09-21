const express = require('express');
const router = express.Router();
const UsersController = require('../../controllers/users.controller');
// const verifyToken = require('../../middleware/authMiddleware');

router.get('/', UsersController.all)
router.get('/:id', UsersController.userById)

module.exports = router;