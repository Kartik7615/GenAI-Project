const userModel = require('../models/user.model');

/** 
 * @name registerUserController
 * @description Register a new user, expecting username, email, and password in the request body. It will create a new user in the database and return a success message.
 * @access Public
 */

async function registerUserController(req, res) {

    const { username, email, password } = req.body

    if(!username || !email || !password){
        return res.status(400).json({ 
            message: 'Username, email, and password are required' 
        });
    }

    const isUserAlreadyExists = await userModel.findOne({ 
        $or: [
            { username }, 
            { email }
        ] 
    });
    
    if(isUserAlreadyExists){
        return res.status(400).json({ 
            message: 'User already exists' 
        });
    }
}

module.exports = {
    registerUserController
}