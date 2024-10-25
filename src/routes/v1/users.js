/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     tags:
 *       - Users
 *     description: Get all users
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: "page"
 *         in: "query"
 *     responses:
 *       200:
 *         description: Return all users
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 *       500:
 *         description: Error
 *   post:
 *      tags:
 *        - Users
 *      description: Create a new user
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: name
 *          description: User's name
 *          in: formData
 *          required: true
 *          type: string
 *        - name: email
 *          description: User's email
 *          in: formData
 *          required: true
 *          type: string
 *          format: email
 *        - name: password
 *          description: User's password
 *          in: formData
 *          required: true
 *          type: string
 *          format: password
 *      responses:
 *        201:
 *           description: Created
 *        500:
 *           description: Error
 *        401:
 *           description: Unauthorized
 *        404:
 *           description: Not Found
 *
 */

/**
 * @swagger
 * /api/v1/users/{mail}:
 *   get:
 *     tags:
 *       - Users
 *     description: Get user info by mail
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: "mail"
 *         in: "path"
 *     responses:
 *       200:
 *         description: Return all users
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 *       500:
 *         description: Error
 *
 */

/**
 * @swagger
 * /api/v1/users/modules/{module}:
 *   get:
 *     tags:
 *       - Users/Modules
 *     description: Get users related in a module.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: "module"
 *         in: "path"
 *       - name: "role"
 *         in: "query"
 *     responses:
 *       200:
 *         description: Return all users
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 *       500:
 *         description: Error
 *
 */

const { Router } = require("express");
const { check } = require("express-validator");
const UserController = require("../../controllers/users.controller");
const checkFields = require("../../middlewares/field-validation.middleware");
const router = Router();
const validateJwt = require('../../middlewares/auth.middleware');

//Crea un usuario
router.post(
  "/",
  [
    check("name").not().isEmpty(),
    check("email").not().isEmpty(),
    check("password").not().isEmpty(),
    checkFields,
  ],
  UserController.createUser,
); //POST USUARIOS

//Devuelve todos los usuarios
router.get("/", UserController.getUsers); //GET USUARIOS

//Devuelve un usuario por mail
router.get("/:mail", UserController.getUserByMail); //GET USUARIO BY MAIL

//Devuelve un usuario por mail
router.get("/modules/:module", UserController.getUsersByModule); //GET USUARIO BY MAIL

module.exports = router;
