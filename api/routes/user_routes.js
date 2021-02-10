
const express = require('express')
const router = express.Router();
const routeController = require('../controllers/user_controller');
const checkAuth = require('../middleware/check-auth')

router.post('/adminsignup', routeController.ADMIN_SIGNUP)
router.post('/adminlogin', routeController.ADMIN_LOGIN)
router.post('/cookielogin', routeController.JWT_COOKIE_LOGIN)
router.post('/token', routeController.REFRESH_TOKEN)
router.post('/logout', routeController.LOGOUT)

router.post('/signup', routeController.ADMIN_SIGNUP)
router.post('/login', routeController.ADMIN_LOGIN)
// router.get('/dash', routeController.DASH_BOARD)
router.post('/reftoken', routeController.REFRESH_TOKEN_COOKIE)
module.exports = {router};
