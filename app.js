const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const csrf = require("csurf");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sequelize = require("./models");
require("dotenv").config();

const noAuth = require("./routes/noAuth");
const auth = require("./routes/auth");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

//セッション
const memoryStore = new SequelizeStore({
  db: sequelize,
  table: "Session",
  extendDefaultFields: extendDefaultFields,
  checkExpirationInterval: 10 * 60 * 1000,
  expiration: 24 * 60 * 60 * 1000,
});

function extendDefaultFields(defaults, session) {
  return {
    data: defaults.data,
    expires: defaults.expires,
    UserId: session.userId,
  };
}
app.use(
  session({
    secret: "keyboard cat",
    store: memoryStore,
    resave: false,
    saveUninitialized: false,
  })
);

//csrf
const csrfProtection = csrf({ cookie: false });
app.use(csrfProtection);
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  console.log("csrf");
  next();
});

app.use((req, res, next) => {
  if (req.session.userId) {
    res.locals.userName = req.session.userName;
    res.locals.isLogin = true;
  } else {
    res.locals.isLogin = false;
  }
  next();
});

app.use("/auth", auth);
app.use((req, res, next) => {
  if (req.session.userId) {
    res.redirect("/auth/home");
    return;
  }
  next();
});
app.use("/", noAuth);

app.use((req, res) => {
  res.render("error/error404");
});

app.use((err, req, res, next) => {
  res.send(err);
});

app.listen(8000);
