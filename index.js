const express = require('express');
const app = express();
const port = 8000;

require('./config/view-helpers')(app);

const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const customMiddleware = require('./config/middleware');
const dotenv = require('dotenv').config();
const path = require('path');
const logger = require('morgan');

// Importing the env file
const env = require('./config/environment');

//Enable cors on my server
const cors = require('cors');
app.use(cors());

// Setup the chat server to be used with socket.io
const chatserver = require('http').Server(app);
const chatSocket = require('./config/chat_sockets').chatSockets(chatserver);
chatserver.listen(5000);
console.log('chat server is listening on port 5000');

app.use(express.static(path.join(__dirname, env.asset_path)));

// Make the uploads path available to browser
app.use('/uploads', express.static(__dirname + '/uploads')); 

// Logging
app.use(logger(env.morgan.mode, env.morgan.options))

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(express.urlencoded({ extended: true, useNewUrlParser: true }));
app.use(cookieParser());

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Mongo store is used to store the cookie on our mongodb db
app.use(session({
    name: 'codeial',
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie:{
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create(
        {
            mongoUrl: 'mongodb://localhost/codeial_development',
            autoRemove: 'disabled'
        }, 
        function(err){
            console.log(err || "connect to mongodb")
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser); 

//Read more about session and cookie parser

app.use(flash());
app.use(customMiddleware.setFlash);

// use express router
app.use('/', require('./routes'));


app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});
