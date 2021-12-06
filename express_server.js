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

res.render('views/urls_index', {
  entry1: entry,
  entry2: whatever
})

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  const templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// Empty template
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// using <%= %> will tell EJS that we want the result of the code to show up on the page. Without display desired? remove the =