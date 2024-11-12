/**
 * @swagger
 * /api/v1/logs:
 *   get:
 *     tags:
 *       - Logs
 *     description: Get all logs
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Return all logs
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
 * /api/v1/logs/{mail}:
 *   get:
 *     tags:
 *       - Logs
 *     description: Get all logs by mail
 *     parameters:
 *       - name: "mail"
 *         in: "path"
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Return all logs of a user
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
const LogsController = require("../../controllers/logs.controller");
const checkFields = require("../../middlewares/field-validation.middleware");
const router = Router();
const validateJwtMdw = require('../../middlewares/auth.middleware');

//Devuelve todos los logs
router.get("/", validateJwtMdw, LogsController.getLogs); //GET LOGS

router.get("/:mail", validateJwtMdw, LogsController.getLogsByMail); //GET LOGS BY MAIL

module.exports = router;
