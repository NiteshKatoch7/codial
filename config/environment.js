const dotenv = require('dotenv').config();
const fs = require('fs');
const rfs = require('rotating-file-stream'); 
const path = require('path');

const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
});


const development = {
    name: 'development',
    asset_path: '/assets',
    session_cookie_key: 'blahblah',
    db: 'codeial_development',
    smtp: {
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
    
        auth: {
            user: "niteshkatoch7@gmail.com",
            pass: "cheo ygph cwnm kluo",
        },
    },
    google_client_id: "963044942365-uagolr72l1edfbl733e1c0hhr99bodr1.apps.googleusercontent.com",
    google_client_secret: "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",
    google_callback_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret_key: 'codeial',
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }
}

const production = {
    name: 'production',
    asset_path: process.env.CODIEAL_ASSET_PATH,
    session_cookie_key: process.env.CODIEAL_SESSION_COOKIE,
    db: process.env.CODIEAL_DB_NAME,
    smtp: {
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
    
        auth: {
            user: process.env.CODIEAL_SMTP_USER,
            pass: process.env.CODIEAL_SMTP_PASSWORD,
        },
    },
    google_client_id: process.env.GOOGLE_CLIENT_ID,
    google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
    google_callback_url: process.env.GOOGLE_CALLBACK_URL,
    jwt_secret_key: process.env.CODIEAL_JWT_KEY, 
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
}

// console.log('env', eval(process.env.CODIEAL_ENVIRONMENT === undefined ? development: production));
module.exports = eval(process.env.CODIEAL_ENVIRONMENT) === undefined ? development : eval(process.env.CODIEAL_ENVIRONMENT);