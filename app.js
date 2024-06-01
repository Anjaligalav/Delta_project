if(process.env.NODE_ENV != 'production'){
    require('dotenv').config();
}

// console.log(process.env.SECRET) // remove this after 


const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js")
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js')
const listingRouter = require('./routes/listing.js')
const reviewRouter = require('./routes/review.js')
const userRouter = require('./routes/user.js')

const dbUrl = process.env.ATLASDB_URL;
// const mongoDb = 'mongodb://127.0.0.1:27017/wanderlust';

main()
.then(()=>{
    console.log("Connected to DB");
})
.catch((err)=>{
    console.log('you are encounting an error related to DB');
})

async function main(){
    mongoose.connect(dbUrl);
}

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'/public')));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate)


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600,
})
store.on('error',()=>{
    console.log('ERROR in MONGO SESSION STORE',err);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() +7 *24 *60 * 60* 1000,//its a expire after 7 days and this in form mili seconds
        maxAge: 7 *24 *60 * 60* 1000,
        httpOnly: true,
    }
}

// app.get("/",(req,res)=>{
//     res.send("all working well");
// })


app.use(session( sessionOptions ));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    // console.log(res.locals.success); its an array
    next();
})

// app.get('/demouser',async(req,res)=>{
//     let fakeUser = new User({
//         email:'student@gmail.com',
//         username:'delta-student',
//     })

//     const registerdUser = await User.register(fakeUser,'helloworld');//helloworld is password
//     //this function we can use becoz we have use passport-local-mongoose
//     //you can see the documentation of passport-local-mongoose Static method.
//     res.send(registerdUser);
// })

app.use('/listings',listingRouter)
app.use('/listings/:id/reviews',reviewRouter);
app.use('/',userRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found."))
})


app.use((err, req, res, next) => {
    let { status, message } = err;
    // res.status(status || 500).send(message || 'Something went wrong.');
    res.status(status || 500).render("listings/error.ejs",{message})
});


app.listen(5000,()=>{
    console.log("your server is running on port 5000")
})