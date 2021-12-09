const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const { inUse ,urlsForUser } = require('./helpers')
// const methodOverride = require('method-override')


// Middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['9c10ea429bfd', '5588-4f8a']
}));

// app.use(methodOverride('X-HTTP-Method-Override')) 

//set engine to ejs
app.set("view engine", "ejs");

const generateRandomString = () => {
  let options = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let length = 6;
  let short = '';
  for (let i = 0; i <= length; i++) {
    short += options.charAt(Math.floor(Math.random() * options.length));
  }
  return short;
}

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
// Helper Functions //
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


app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// used for testing only
// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

////////////////////////////////
// Homepage that does nothing //
////////////////////////////////
app.get("/hello", (req, res) => {
  const templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

///////////////////////////////
// Creation of New shortURLS //
///////////////////////////////

// Directs to creation page only if user is logged in
app.get("/urls/new", (req, res) => {
  const id = req.session.user_id;
  let email;
  if (id && users[id]) {
    email = users[id].email;
  }
  const templateVars = { user_id: id, email: email };
  res.render("urls_new", templateVars);
});

// Create new shortURL/tinyURL
app.post("/urls", (req, res) => {
  const id = req.session.user_id;
  if (id) {
    let longerURL = req.body.longURL;
    let newGenerate = generateRandomString();
    urlDatabase[newGenerate] = { longURL: longerURL, userID: id };
    res.redirect(`/urls/${newGenerate}`);
  } else {
    res.send('403 login!');
  }
});

// Shows the user the index of their own URLs
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
    res.send('401 you do not have access to this page')
  }

});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const dataKeys = Object.keys(urlDatabase);
  if (dataKeys.includes(shortURL)) {
    res.redirect(urlDatabase[shortURL].longURL);
  } else {
    res.send('404 page not found');
  }
});

app.post("/urls/:shortURL", (req, res) => {
  const user = req.session.user_id;
  const id = req.params.shortURL;
  if (urlDatabase[id].userID == user) {
    let longerURL = req.body.longURL;
    urlDatabase[req.params.shortURL].longURL = longerURL;
    res.redirect('/urls');
  } else {
    res.send('401 you can\'t access this!');
  }
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const user = req.session.user_id;
  const id = req.params.shortURL;
  if (urlDatabase[id].userID == user) {
    delete urlDatabase[id];
    res.redirect('/urls');
  } else {
    res.send('401 you can\'t delete this');
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
    res.send('400 email already in use');
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
    res.send('403 user not found');
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
