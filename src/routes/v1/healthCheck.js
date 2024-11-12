/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     tags:
 *       - Health
 *     description: Health check of the service
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Service is up and running
 */

const express = require("express");
const router = express.Router();


router.get("/",(req, res) => {

  

  res.status(200).json({ message: "Service is up and running" });
});

module.exports = router;
