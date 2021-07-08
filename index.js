const express = require('express');
const app = express();
const mongoose = require('mongoose');
const layouts = require('express-ejs-layouts');
const methodOverride = require("method-override");

const cookieParser = require("cookie-parser");
const session = require('express-session')
const MongoDBSession = require('connect-mongodb-session')(session)


const MongoURI = "mongodb://localhost:27017/aaa"
mongoose
    .connect(MongoURI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then((res) => {
        console.log(`MongoDB Connected`);
    })

const session_time = 1000 * 60
const store = new MongoDBSession({
    uri: MongoURI,
    collection: "MYSession"
})
app.use(session({
    secret: "session_key_secret",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {

        httpOnly: true,
        maxAge: session_time
        // secure: true
    }
}))
app.use(cookieParser());












app.locals.moment = require('moment')
app.use(methodOverride("_method", {
    methods: ["POST", "GET"]
}));
app.use(layouts)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS Views 
app.use(express.static('public'));


app.set('views', './views')
app.set('view engine', 'ejs')

app.use('/api', require('./router'))




    app.get('/register', (req, res) => {
        res.render('./register/register', {
            title: 'Karvon', layout: './layout',
        })
    })
app.get('/edit', (req, res) => {
    res.render('./edit', {
        title: 'Admin', layout: './layout',
    })
})
app.get('/', (req, res) => {
    res.render('./login/login', {
        title: 'Admin', layout: './layout',
    })
})




const PORT = 8080
app.listen(PORT, () => {
    console.log(`Server is running ${PORT}`)
})


