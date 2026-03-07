const userModel = require('../models/user.model');
const blacklistTokenModel = require('../models/blacklist.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * @name registerUserController
 * @description Register a new user, expecting username, email, and password in the request body.
 * @access Public
 */
async function registerUserController(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: 'Username, email, and password are required'
        });
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{ username }, { email }]
    });

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: 'User already exists'
        });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hash
    });

    const token = jwt.sign(
        {
            id: user._id,
            username: user.username
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax'
    });

    return res.status(201).json({
        message: 'User registered successfully',
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}

/**
 * @name loginUserController
 * @description Login a user, expecting email and password in the request body.
 * @access Public
 */
async function loginUserController(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: 'Email and password are required'
        });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({
            message: 'Invalid email or password'
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({
            message: 'Invalid email or password'
        });
    }

    const token = jwt.sign(
        {
            id: user._id,
            username: user.username
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax'
    });

    return res.status(200).json({
        message: 'Login successful',
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}

/**
 * @name logoutUserController
 * @description Logout user by blacklisting current token and clearing cookie.
 * @access Public
 */
async function logoutUserController(req, res) {
    const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(400).json({
            message: 'No token provided'
        });
    }

    await blacklistTokenModel.create({ token });

    res.clearCookie('token');

    return res.status(200).json({
        message: 'Logout successful'
    });
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController
};

