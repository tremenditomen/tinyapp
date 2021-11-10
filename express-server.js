const express = require("express");
const morgan = require ("morgan")
const app = express();
const PORT = 8080; // default port 8080
//adding ejs
app.set('view engine', 'ejs')
app.use(morgan('dev'))
app.use(express.urlencoded({extended: false}))
function generateRandomString(string) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const characterLength = 6;
    for (let i = 0; i <= characterLength; i++) {
      result += characters.charAt(Math.floor(Math.random() * characterLength));
    }
    return result.toLocaleLowerCase();
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
  // to redirect to the website
  app.get("/u/:shortURL", (req, res) => {
    // const longURL = ...
    const shortURL = req.params.shortURL
    const longURL = urlDatabase[shortURL]
    console.log("long:",longURL)
    res.redirect(longURL);
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
      shortURL = generateRandomString()
      longURL = req.body["longURL"]
    console.log("LONGURL:",longURL)
    console.log("RANDOM:",shortURL);  // Log the POST request body to the console
    urlDatabase[shortURL] =  longURL
    return res.redirect("/urls");         // Respond with 'Ok' (we will replace this)
  });
  //DELETING URLS
  app.post("/urls/:shortURL/delete", (req,res)=>{
      const url = req.params.shortURL
      delete urlDatabase[url]
      res.redirect("/urls")

  })
  
  

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});