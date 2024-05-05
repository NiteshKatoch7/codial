const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');

const User = require('../models/user');


// Telling passport to use a new strategy for a google login
passport.use(new googleStrategy({
        clientID: "963044942365-uagolr72l1edfbl733e1c0hhr99bodr1.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:8000/users/auth/google/callback"
    },

    function(accessToken, refreshToken, profile, done){
        // Find a user
        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if(err){
                console.log(err);
                return;
            }

            console.log(profile);

            if(user){
                // If found set the user as req.user
                return done(null, user);
            }else{
                // If not found, create the user and set it as req.user
                User.create({
                    name: profile.name,
                    email: profile.emails[0].value,
                    passport: crypto.randomBytes(20).toString('hex'),
                }, function(err, user){
                    if(err){
                        console.log("Error in creating user", err);
                        return;
                    }

                    return done(null, user);
                })
            }

        })
    }

));

module.exports = passport;