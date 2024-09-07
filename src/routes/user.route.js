var express = require('express')
var router = express.Router()
var UserController = require('../controllers/user.controller');

// Authorize each API with middleware and map to the Controller Functions
/* GET users listing. */
router.get('/test', function(req, res) {
    res.send('Llegaste a la ruta de users');
  });

router.get('/userById', UserController.getUserById)
router.get('/login', UserController.login)

// Export the Router
module.exports = router;

