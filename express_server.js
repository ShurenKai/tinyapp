const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const { inUse ,urlsForUser, generateRandomString } = require('./helpers');
const methodOverride = require('method-override');


// Middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['9c10ea429bfd', '5588-4f8a']
}));

app.use(methodOverride('_method'));

//set engine to ejs
app.set("view engine", "ejs");

//////////
// Data //
//////////
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("123123", salt)
  },
  "aJ48lW": {
    id: "aJ48lW",
    email: "user2@example.com",
    password: bcrypt.hashSync("asdasd", salt)
  }
};

//////////////////////
// Helper Function //
//////////////////////
const checkUser = (email, password) => {
  for (let user in users) {
    if (email === users[user].email) {
      if (bcrypt.compareSync(password, users[user].password)) {
        return user;
      }
    }
  }
  return null;
};

///////////////////
// Port Listener //
///////////////////
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//////////////
// Homepage //
//////////////

app.get("/", (req, res) => {
  const id = req.session.user_id;
  let email;
  if (id && users[id]) {
    email = users[id].email;
  }
  const templateVars = { user_id: id, email: email };
  res.render("homepage", templateVars)
});

///////////////////////////////
// Creation of New shortURLS //
///////////////////////////////

app.get("/urls/new", (req, res) => {
  const id = req.session.user_id;
  let email;
  if (id && users[id]) {
    email = users[id].email;
  }
  const templateVars = { user_id: id, email: email };
  res.render("urls_new", templateVars);
});

app.post("/urls", (req, res) => {
  const id = req.session.user_id;
  if (id) {
    let longerURL = req.body.longURL;
    let newGenerate = generateRandomString();
    urlDatabase[newGenerate] = { longURL: longerURL, userID: id };
    res.redirect(`/urls/${newGenerate}`);
  } else {
    res.sendStatus(403);
  }
});

app.get("/urls", (req, res) => {
  const id = req.session.user_id;
  const urlsList = urlsForUser(id, urlDatabase);
  let email;
  if (id && users[id]) {
    email = users[id].email;
  }
  const templateVars = { urls: urlDatabase, user_id: id, email: email, shown_urls: urlsList };
  res.render("urls_index", templateVars);
});

////////////////////////
// ShortURL processes //
////////////////////////

app.get("/urls/:shortURL", (req, res) => {
  const id = req.session.user_id;
  let email;
  if (id === urlDatabase[req.params.shortURL].userID) {
    email = users[id].email;
    const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user_id: id, email: email };
    res.render("urls_show", templateVars);
  } else {
    res.sendStatus(401)
  }
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const dataKeys = Object.keys(urlDatabase);
  if (dataKeys.includes(shortURL)) {
    res.redirect(urlDatabase[shortURL].longURL);
  } else {
    res.sendStatus(404);
  }
});

app.put("/urls/:shortURL", (req, res) => {
  const user = req.session.user_id;
  const id = req.params.shortURL;
  if (urlDatabase[id].userID === user) {
    let longerURL = req.body.longURL;
    urlDatabase[req.params.shortURL].longURL = longerURL;
    res.redirect('/urls');
  } else {
    res.sendStatus(404);
  }
});

app.delete("/urls/:shortURL", (req, res) => {
  const user = req.session.user_id;
  const id = req.params.shortURL;
  if (urlDatabase[id].userID === user) {
    delete urlDatabase[id];
    res.redirect('/urls');
  } else {
    res.sendStatus(401);
  }
});

//////////////////
// Registration //
//////////////////
app.get("/register", (req, res) => {
  const id = req.session.user_id;
  let email;
  if (id && users[id]) {
    email = users[id].email;
  }
  const templateVars = {user_id: id, email: email };
  res.render('user_registration', templateVars);
});

app.post('/register', (req, res) =>{
  const newEmail = req.body.email;
  const newPassword = req.body.password;
  if (inUse(newEmail, users)) {
    res.sendStatus(400);
    res.end;
  }
  const id = generateRandomString();

  users[id] = {id: id, email: newEmail, password: bcrypt.hashSync(newPassword, salt)};
  req.session['user_id'] = id;
  res.redirect('/urls');
});

/////////////////////////
// Login & out process //
/////////////////////////
app.get("/login", (req, res) => {
  const id = req.session.user_id;
  let email;
  if (id && users[id]) {
    email = users[id].email;
  }
  const templateVars = {user_id: id, email: email };
  res.render('login', templateVars);
});

app.post("/login", (req, res) =>{
  const inputEmail = req.body.email;
  const inputPassword = req.body.password;
  const user = checkUser(inputEmail, inputPassword);
  if (!user) {
    res.sendStatus(403);
  }
  req.session['user_id'] = user;
  res.redirect('/urls');
});

app.post("/logout", (req, res) =>{
  req.session = null;
  res.redirect('/urls');
});


/////////////////////
// Unrelated notes //
/////////////////////

// using <%= %> will tell EJS that we want the result of the code to show up on the page. Without display desired? remove the =
// redirects need to know exactly where to go, so no :shortURL for instance, use `` instead
// /route can become /route/:id etc etc
