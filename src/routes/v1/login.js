/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     tags:
 *       - Login
 *     description: Login a user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: User's email
 *         in: formData
 *         required: true
 *         type: string
 *         format: email
 *       - name: password
 *         description: User's password
 *         in: formData
 *         required: true
 *         type: string
 *         format: password
 *     responses:
 *        201:
 *           description: Created
 *        500:
 *           description: Error
 *        401:
 *           description: Unauthorized
 *        404:
 *           description: Not Found
 */

const express = require("express");
const router = express.Router();
const LoginController = require("../../controllers/login.controller");
const { check } = require("express-validator");
const checkFields = require("../../middlewares/field-validation.middleware");

//Loguea un usuario
router.post(
  "/",
  [
    check("email").not().isEmpty(),
    check("password").not().isEmpty(),
    checkFields,
  ],
  LoginController.login,
);

module.exports = router;
