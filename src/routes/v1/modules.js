/**
 * @swagger
 * /api/v1/modules:
 *   get:
 *     tags:
 *       - Modules
 *     description: Get all modules
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Return all modules
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
const ModuleController = require("../../controllers/modules.controller");
const checkFields = require("../../middlewares/field-validation.middleware");
const router = Router();
const validateJwtMdw = require('../../middlewares/auth.middleware');

router.get("/",validateJwtMdw,  ModuleController.getModules);

module.exports = router;
