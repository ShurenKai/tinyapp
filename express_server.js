const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');


// Middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


//set engine to ejs
app.set("view engine", "ejs");

function generateRandomString() {
  let options = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let length = 6;
  let short = '';
  for (let i = 0; i <= length; i++) {
    short += options.charAt(Math.floor(Math.random() * options.length));
  }
  return short;
}

let newGenerate = generateRandomString();
//////////
// Data //
//////////
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "123123"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "asdasd"
  }
};

const checkUser = (email, password) => {
  console.log(email)
  console.log(password)
  for( let user in users){
    if(email === users[user].email){
      if(password === users[user].password){
        return user
      }
    }
  }
  return null
}

const inUse = (email) => {
  for(let user in users){
    if(email === users[user].email){
      return true
    }
  }
  return false
}

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  const templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// "/urls" is the router
app.get("/urls/new", (req, res) => {
  const id = req.cookies.user_id
  let email;
  if(id && users[id]){
    email = users[id].email
  }
  const templateVars = { user_id: id, email: email  };
  res.render("urls_new", templateVars);
});

app.get("/urls", (req, res) => {
  const id = req.cookies.user_id
  let email;
  if(id && users[id]){
    email = users[id].email
  }
  const templateVars = { urls: urlDatabase, user_id: id, email: email };
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const id = req.cookies.user_id
  let email;
  if(id && users[id]){
    email = users[id].email
  }
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user_id: id, email: email };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  console.log('this is my ', longURL);
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  const id = req.cookies.user_id
  let email;
  if(id && users[id]){
    email = users[id].email
  }
  const templateVars = {user_id: id, email: email };
  res.render('user_registration', templateVars);
});

app.get("/login", (req, res) => {
  const id = req.cookies.user_id
  let email;
  if(id && users[id]){
    email = users[id].email
  }
  const templateVars = {user_id: id, email: email };
  res.render('login', templateVars);
});

app.post("/urls", (req, res) => {
  let longerURL = req.body.longURL;
  let newGenerate = generateRandomString();
  urlDatabase[newGenerate] = longerURL;
  res.redirect(`/urls/${newGenerate}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const id = req.params.shortURL;
  delete urlDatabase[id];
  res.redirect('/urls');
});

app.post("/urls/:shortURL", (req, res) => {
  let longerURL = req.body.longURL;
  urlDatabase[req.params.shortURL] = longerURL;
  res.redirect('/urls');
});

app.post("/login", (req, res) =>{
  const inputEmail = req.body.email
  const inputPassword = req.body.password
  const user = checkUser(inputEmail, inputPassword)
  if(!user){
    res.send('403 user not found')
  }
  res.cookie('user_id', user)
  res.redirect('/urls');
});

app.post("/logout", (req, res) =>{
  res.clearCookie('user_id');
  res.redirect('/urls');
});

app.post('/register', (req, res) =>{
  const newEmail = req.body.email;
  const newPassword = req.body.password;
  if(inUse(newEmail)){
    res.send('400 email already in use')
    res.end
  } 
  const id = generateRandomString();

  users[id] = {id: id, email: newEmail, password: newPassword};
  res.cookie('user_id', id)
  console.log("welcome ", users); // check your functionality
  res.redirect('/urls');
});

// app.post("/urls", (req, res) => {
// console.log(req.body);  // Log the POST request body to the console
// res.send("Ok");         // Respond with 'Ok' (we will replace this)
// });

// using <%= %> will tell EJS that we want the result of the code to show up on the page. Without display desired? remove the =
// reditrects need to know exactly where to go, so no :shortURL for instance, use `` instead
