const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

//set engine to ejs
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// app.render('views/urls_index', {
//   entry1: entry,
//   entry2: whatever
// })

// app.render('views/urls_show', {
//   hey1: hey
// })

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  const templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// Empty template, "/urls" is the router
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: req.params.longURL};
  res.render("urls_show", templateVars);
});

// using <%= %> will tell EJS that we want the result of the code to show up on the page. Without display desired? remove the =