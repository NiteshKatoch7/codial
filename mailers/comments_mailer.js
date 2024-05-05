const nodemailer = require('../config/nodemailer');

exports.newComment = (comment) => {
    let htmlString = nodemailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');

    nodemailer.transporter.sendMail({
        from: 'niteshkatoch7@gmail.com',
        to: comment.user.email,
        subject: "New Comment on your Post!",
        html: htmlString,
    }, (err, info) => {
        if(err){
            console.log('Error while sending the mail', err);
            return;
        }

        //console.log('Message sent', info);
        return;
    })
}