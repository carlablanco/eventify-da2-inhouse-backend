/**
 * @swagger
 * /api/v1/roles/{module}:
 *   get:
 *     tags:
 *       - Roles
 *     description: Get all roles of a module
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: "module"
 *         in: "path"
 *     responses:
 *       200:
 *         description: Return all roles of a module
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
const RoleController = require("../../controllers/roles.controller");
const checkFields = require("../../middlewares/field-validation.middleware");
const router = Router();
const validateJwt = require('../../middlewares/auth.middleware');

router.get("/:module", RoleController.getRolesByModule);

module.exports = router;
