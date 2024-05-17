const User = require('../models/user');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const resetPasswordMailer = require('../mailers/reset_password_mailer');
const resetPassword = require('../models/reset_password');
const Friendship = require('../models/friendship');

module.exports.profile = async function(req, res){
    // if(req.cookies.user_id){
    //     User.findById(req.cookies.user_id).then((user)=>{
    //         if(user){
    //             return res.render('user_profile', {
    //                 title: 'User Profile',
    //                 user:user
    //             })
    //         }else{
    //             res.redirect('/users/signin');
    //         }
    //     })
    // }else{
    //     res.redirect('/users/signin');
    // }
    try{
        let profileUser =  await User.findById(req.params.id);
        let adminUser = await User.findById(req.user._id);
        
        existingFriendship1 = Friendship.find({
            to_user: profileUser,
            from_user:  adminUser
        })
        
        existingFriendship2 = Friendship.find({
            to_user: adminUser,
            from_user: profileUser
        })

        // console.log(existingFriendship1, existingFriendship2, existingFriendship1 || existingFriendship2);

        if(profileUser){
            console.log(profileUser)
            return res.render('user_profile', {
                title: 'User Profile',
                profile_user: profileUser,
                friends: existingFriendship1 || existingFriendship2,
            })
        }


    }catch(error){
        console.log('Error while getting users on profile page: ', err)
        return res.redirect('back');
    }
}

module.exports.update = async function(req, res){

    if(req.user.id == req.params.id){

        try{

            let user = await User.findById(req.params.id);

            if(user){
                User.uploadedAvatar(req, res, function(err){
                    if(err){
                        console.log('multer is throwing an Error: ', err)
                    }
                    
                    user.name = req.body.name;
                    user.email = req.body.email;

                    if(req.file){
                        if(user.avatar){
                            fs.unlinkSync(path.join(__dirname + '..' + user.avatar))
                        }

                        user.avatar = User.avatarPath + '/' + req.file.filename;
                    }
                    user.save();
                    req.flash('success', 'User Profile is Updated!')
                    return res.redirect('back');
                })
            }

        }catch(error){
            req.flash('error', err);
            return res.redirect('back');
        }

    }else{
        req.flash('error', 'Unauthorized')
        return res.status(401).send('Unauthorized');
    }
    
    //if(req.user.id == req.params.id){
    //    User.findByIdAndUpdate(req.params.id, req.body).then((user)=>{
    //        res.redirect('back');
    //    }).catch((error)=>{
    //        console.log("Error while updating the user profile information: ", error);
    //        return res.redirect('back');
    //    })
    //}else{
    //    return res.status(401).send('Unauthorized');
    //}
}

module.exports.deleteProfileImage = async(req, res) => {

    try{
        let user = await User.findById(req.user.id);
        if(user && user.avatar){
            let filePath = path.join(__dirname , '..' , user.avatar);
            fs.unlinkSync(filePath);
            user.avatar = null
            await user.save();
            req.flash('success', 'Successfully Deleted Profile Picture');
            return res.status(200).redirect('back');
        }else{
            req.flash('error', 'No Profile Picture to Delete');
            console.log('Error while deleting the pic');
            return;
        }
    }catch(error){
        req.flash('error', error);
        console.log(error);
        return res.redirect('back');
    }
}

module.exports.signin = function(req,res,app){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile')
    }
    res.locals.currentRoute = req.path;
    return res.render('signin', {
        currentRoute: req.path,
        title: 'Signin'
    })
}

module.exports.signup = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile')
    }
    return res.render('signup', {
        currentRoute: req.path,
        title: 'Signup'
    })
}

module.exports.createUser = function(req,res){
    User.create(req.body).then(()=>{
        return res.redirect('signin');
    }).catch((error)=>{
        console.log('Error while creating user', error);
        return;
    })
}

module.exports.siginingIn = (req,res)=>{
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
//     User.find({email: req.body.email}).then((user)=>{
//         if(user){
//             if(user[0].password !== req.body.password){
//                 return res.redirect('back');
//             }
//             res.cookie('user_id', user[0]._id);
//             return res.redirect('/users/profile');

//         }else{
//             return res.redirect('back');
//         }
//     }).catch((error)=>{
//         console.log('Error while signing in:', error);
//         return res.redirect('/users/signup');
//     })
}

module.exports.logout = (req, res)=>{
    req.flash('success', 'You have logged out!');
    req.logout((err)=>{
        if(err){
            console.log('Error while Logging out');
            return;
        }
    });
    //res.clearCookie('user_id');
    return res.redirect('/users/signin');
}

module.exports.forgotPassword = async(req, res) => {
    return res.render('forgot_password', {
        title: 'Forgot Password',
    });
}

module.exports.resetPasswordConfirmEmail = async(req, res) => {
    try{
        let user = await User.findOne({email: req.body.email});
        if(user){
            // console.log(user);
            let auth_token = crypto.randomBytes(20).toString('hex');
            //Set reset Authorisation
            let auth = await resetPassword.create({
                auth: auth_token,
                active: true,
                user: user._id,
            });
            resetPasswordMailer.resetPasswordEmail(user, auth_token);
            req.flash('success', 'Email has been sent to your Email Id');
            return res.status(200).redirect('/users/signin');
        }else{
            req.flash('error', 'Email does not exist!');
            return res.redirect('back');
        }
    }catch(error){
        console.log("Error while reseting the user password")
    }
}

module.exports.resetPassword = async(req, res) => {
    try{
        //console.log(req.params.auth);
        let auth = await resetPassword.findOne({auth: req.params.auth}).populate('user');
        if(auth.active){
            return res.render('reset_password', {
                title: 'Reset Password',
                auth: auth,
            })
        }else{
            return res.status(401).send('Unauthorised');
        }
    }catch(error){
        console.log("Error while reseting the password", error)
        return;
    }
}

module.exports.changePassword = async(req,res) => {
    try{
        
        let auth = await resetPassword.findById(req.params.auth);

        if(req.body.changepassword === req.body.confirmpassword){

            if(req.body.changepassword === ''){
                req.flash('error', 'Passwords field cannot be empty');
                return res.redirect('back');
            }

            let user = await User.findById(auth.user);
            if(user){
                user.password = req.body.confirmpassword;
                user.save();
                return res.status(200).redirect('/users/signin');
            }

        }else{
            req.flash('error', 'Passwords does not match!');
            return res.redirect('back');
        }
    }catch(error){
        console.log("Error while changing the password", error);
    }
}