/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     tags:
 *       - Users
 *     description: Get all users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Return all users
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 *       500:
 *         description: Error
 */

const express = require('express');
const router = express.Router();
const UsersController = require('../../controllers/users.controller');
const verifyToken = require('../../middleware/auth.middleware');

router.get('/', verifyToken,UsersController.all)
router.get('/:id', UsersController.userById)

module.exports = router;