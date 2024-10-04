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
 * /api/v1/login/token:
 *  post:
 *     tags:
 *       - Login
 *     description: Validate JWT
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: jwt
 *          description: JWT token
 *          in: formData
 *          required: true
 *          type: string
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

const express = require("express");
const router = express.Router();
const LoginController = require("../../controllers/login.controller");
const { check } = require("express-validator");
const checkJwt = require("../../middlewares/auth.middleware");
const checkFields = require("../../middlewares/field-validation.middleware");

//Valida JWT del sessionStorage
router.post("/token", checkJwt);

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
