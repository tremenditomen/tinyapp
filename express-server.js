const express = require("express");
const morgan = require ("morgan")
const app = express();
const PORT = 8080; // default port 8080
//adding ejs
app.set('view engine', 'ejs')
app.use(morgan('dev'))
app.use(express.urlencoded({extended: false}))
function generateRandomString() {

}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
  });
  //hello world page
app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n");
  });
  //urls page 
  app.get("/urls", (req,res)=>{
    const templateVars = { urls: urlDatabase };
    res.render("urls_index",templateVars)
  })
  //APP.GET FOR THE FORM
  app.get("/urls/new", (req, res) => {
    res.render("urls_new");
  });
  //single url
  app.get("/urls/:shortURL", (req, res) => {
      const shortURL = req.params.shortURL
      const longURL = urlDatabase.shortURL
    const templateVars = { shortURL: shortURL, longURL: longURL};
    res.render("urls_show", templateVars);
  });
  //APP.POST for newURLS
  app.post("/urls", (req, res) => {
    console.log(req.body);  // Log the POST request body to the console
    res.send("Ok");         // Respond with 'Ok' (we will replace this)
  });
  
  

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});