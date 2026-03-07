const { Router } = require('express');
const authController = require('../controllers/auth.controller');

const authRouter = Router();

/** 
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post('/register', authController.registerUserController);

/**
 * @route POST /api/auth/login
 * @description Login a user
 * @access Public
 */
authRouter.post('/login', authController.loginUserController);


/** * @route GET /api/auth/logout
 * @description clear token from user cookie and add the token to the blacklist
 * @access Public
 */
authRouter.get('/logout', authController.logoutUserController);
module.exports = authRouter;