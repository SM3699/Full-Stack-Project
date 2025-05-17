if(process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


const User = require("./models/user.js");
const passport = require("passport");
const LocalStratergy = require("passport-local");
//const { serialize } = require("v8");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended : true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


//const Mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

const dbUrl = process.env.ATLASDB_URL;


main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(dbUrl);
}


const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SECRETE,
    },
    touchAfter : 24 * 3600,
});

store.on("error", () => {
    console.log("Error in mongo session store", err);
});

const sessionOptions = {
    store : store,
    secret : process.env.SECRETE,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    },
};


// app.get("/", (req, res) => {
//     res.send("This is home page");
// });


app.use(session(sessionOptions));
app.use(flash());

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error  = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/", (req, res) => {
    res.render("/listings/home.ejs");
});

//All Listing Routes Middleware
console.log("Listing");
app.use("/listings", listingRouter);

//All Reviews  Routes Middleware_____:
console.log("Review");
app.use("/listings/:id/reviews", reviewRouter);

//All User Routes Middleware
console.log("user");
app.use("/", userRouter);

// console.log("all err");
// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page Not Found!"));
// });

// console.log("err");
// app.use((err, req, res, next) => {
//     let { statusCode = 500, message = "Something Went Wrong!" } = err;
//     res.status(statusCode).render("error.ejs", { message });
//     // res.status(statusCode).send(message);
// });




app.listen(8080, () => {
    console.log("Server Started..");
});