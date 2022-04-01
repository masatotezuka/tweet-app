const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const csrf = require("csurf");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sequelize = require("./models");
const ejsLint = require("ejs-lint");
require("dotenv").config();

const routes = require("./routes/index");
const signup = require("./routes/signup");
const login = require("./routes/login");
const logout = require("./routes/logout");
const users = require("./routes/users");
const auth = require("./routes/auth");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
// ejsLint("login.ejs");
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
    userId: session.userId,
  };
}
app.use(
  session({
    secret: "keyboard cat",
    store: memoryStore,
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: true },
  })
);

const csrfProtection = csrf({ cookie: false });
app.use(csrfProtection);
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
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

app.use("/", routes);
app.use("/signup", signup);
app.use("/login", login);
app.use("/logout", logout);
app.use("/users", users);
app.use("/auth", auth);
app.use((req, res) => {
  res.render("error/error404");
});

app.use((err, req, res, next) => {
  res.send(err);
});

app.listen(8000);
