const express = require("express");
const morgan = require ("morgan")
const cookieparser = require("cookie-parser")
const bcrypt = require("bcryptjs");
const {generateRandomString,getUserByEmail,urlsForUser} = require("./helpers")
const app = express();
const PORT = 8081; // default port 8080
//adding ejs
app.set('view engine', 'ejs')
app.use(morgan('dev'))
app.use(cookieparser())
app.use(express.urlencoded({extended: false}))

//USERS
const users = {
  RandomID: {
    id: "userRandomID",
    email: "user@user.com",
    password: bcrypt.hashSync("1234"),
  },

  user2RandomID: {
    id: "user2RandomID",
    email: "user2@user.com",
    password: bcrypt.hashSync("4321"),
  },
};


//DATA BASE
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

app.get("/", (req, res) => {
  res.redirect("/login");
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
    const userid = req.cookies["user_id"];
    const user = users[userid];
    const templateVars = { urls: urlsForUser(userid,urlDatabase), user: users[userid] };
    if (!user) {
      return res.redirect("/login");
    }
    res.render("urls_index", templateVars);
  })
  //APP.GET FOR THE FORM
  app.get("/urls/new", (req, res) => {
    const userid = req.cookies["user_id"];
    const user = users[userid];
    const templateVars = { user: user };
  if (!templateVars["user"]) {
    return res.redirect("/login");
  } else {
    res.render("urls_new", templateVars);
  }
});
  //REGISTER GET ROUT
  app.get("/register", (req,res)=>{
    const userid = req.cookies["user_id"];
  const user = users[userid];
  if (user) {
    return res.redirect("/urls");
  } else {
    const templateVars = { urls: urlDatabase, user: user };
    return res.render("urls_register", templateVars);
  }
  
  
  })
  //LOGIN GET ROUT
  app.get("/login",(req,res)=>{
    const userid = req.cookies["user_id"];
 
    
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[userid],
  };
    return  res.render("urls_login", templateVars);
  })
  // to redirect to the website
  app.get("/u/:shortURL", (req, res) => {
    // const longURL = ...
    const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL]["longURL"];
    res.redirect(longURL);
  });
  //single url
  app.get("/urls/:shortURL", (req, res) => {
    
    const userid = req.cookies["user_id"];
  const user = users[userid];
  const shortURL = urlDatabase[req.params.shortURL]
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: shortURL.longURL,
    userID: req.cookies["user_id"],
    user:user
  };
    if(userid !== shortURL.userID){
      res.send("you dont have acces to this url")
    }

  res.render("urls_show", templateVars);
  });
  //APP.POST for newURLS
  app.post("/urls", (req, res) => {
      const shortURL = generateRandomString()
      const longURL = req.body["longURL"]
      const userId = req.cookies["user_id"];
      const user = users[userId];
    if (!user) {
      res.redirect("/login");
    }
  
    urlDatabase[shortURL] = {
      longURL: longURL,
      userID: userId,
    };
    return res.redirect("/urls");         // Respond with 'Ok' (we will replace this)
  });
  //DELETING URLS
  app.post("/urls/:shortURL/delete", (req,res)=>{
    const shortURL = req.params.shortURL;

    delete urlDatabase[shortURL];
    res.redirect("/urls");

  })
  // EDITING URLS
  app.post("/urls/:shortURL/edit",(req,res)=>{
    const longURL = req.body.longURL;
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL]["longURL"] = longURL;
  res.redirect("/urls");
  })
  // POST FOR LOGIN
  app.post("/login",(req,res)=>{
    const email = req.body.email;
  const password = req.body.password;
  let user = getUserByEmail(email, users);

  if (!user) {
    res.send("Error code: 403,please check Email Adress or Password");
    return;
  } else if (bcrypt.compareSync(password, user.password)) {
    res.cookie("user_id", user.id);

    res.redirect("/urls");
  }
  })
  app.post("/logout",(req,res)=>{
    res.clearCookie("user_id")
    return res.redirect("/urls")

  })
  //REGISTER POST ROUT
  app.post("/register",(req,res)=>{
    
    const email = req.body.email
    const password = req.body.password
    const encrypted = bcrypt.hashSync(password, 10);
    let user = generateRandomString(email)
    if(email === "" || password === ""){
      return res.status(400).send('Bad email or password')
    }
    for(let user in users){
      if(users[user].email === email){
        
        return res.status(400).send('Email already exists')
    }
    }
  
    users[user] = {
      id: user,
      email: req.body.email,
      password: encrypted,
    };
    
    res.cookie("user_id", user)
    res.redirect("/urls")

  })
  
  
  

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});