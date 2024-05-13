const nodemailer = require('../config/nodemailer');
const env = require('../config/environment');
const envURL = env.codieal_env_url;


module.exports.resetPasswordEmail = (user, auth_token) => {
    let htmlString = nodemailer.renderTemplate({user, auth_token, envURL}, '/user/reset-password.ejs');
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