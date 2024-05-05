const nodemailer = require('../config/nodemailer');


module.exports.resetPasswordEmail = (user, auth_token) => {
    let htmlString = nodemailer.renderTemplate({user, auth_token}, '/user/reset-password.ejs');
    //console.log('Inside the mailer',user);
    nodemailer.transporter.sendMail({
        from: 'niteshkatoch7@gmail.com',
        to: user.email,
        subject: 'Reset Your Password!',
        html: htmlString,
    }, (err, info) => {
        if(err){
            console.log("Error in sending the reset password mail: ", err);
            return;
        }
        return;
    });

}