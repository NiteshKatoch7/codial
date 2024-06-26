const User = require('../../../models/user');
const jwt = require('jsonwebtoken');
const env = require('../../../config/environment');

module.exports.siginingIn = async(req,res)=>{
    try{
        let user = await User.findOne({email: req.body.email});

        if(!user || user.password != req.body.password){
            return res.status(422).json({
                message: 'Invalid Username or Password!'
            })
        }

        return res.status(200).json({
            message: "Sign In Successfull",
            data: {
                token: jwt.sign(user.toJSON(), env.jwt_secret_key, {expiresIn: '100000'}),
            }
        })

    }catch(error){
        // console.log('Error', err);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
}
