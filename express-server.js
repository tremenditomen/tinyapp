const express = require("express");
const morgan = require ("morgan")
const cookieparser = require("cookie-parser")
const bcrypt = require("bcryptjs");
const app = express();
const PORT = 8081; // default port 8080
//adding ejs
app.set('view engine', 'ejs')
app.use(morgan('dev'))
app.use(cookieparser())
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

//EMAIL HELPER
// const helperEmail = (usersDb)=>{
// for (let user in usersDb){
//   console.log("user emails",users[user].email)
//   return users[user].email
// }
// }
//Email helper V2

const getUserByEmail = function (email, users) {
  let foundUser = null;
  for (user in users) {
    if (users[user].email === email) {
      foundUser = users[user];
    }
  }
  return foundUser;
};
//Pasword helper

const helperPassword = (usersDb)=>{
for (let user in usersDb){
  console.log("user passwords",users[user].password)
  return users[user].password
}
}
//URLSFORUSERS HELPER

const urlsForUser = (user_id) => {
  const shortURLs = {};
  for (const key in urlDatabase) {
    if (user_id === urlDatabase[key]["userID"]) {
      shortURLs[key] = urlDatabase[key]["longURL"];
    }
  }
  return shortURLs;
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
    const templateVars = { urls: urlsForUser(userid), user: users[userid] };
    if (!user) {
      return res.redirect("/login");
    }
    res.render("urls_index", templateVars);
  })
  //APP.GET FOR THE FORM
  app.get("/urls/new", (req, res) => {
    const templateVars = { user: req.cookies.user_id };
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
    console.log("USERID:",userid,"USER:",user)
    return res.redirect("/urls");
  } else {
    const templateVars = { urls: urlDatabase, user: user };
    return res.render("urls_register", templateVars);
  }
  
  
  })
  //LOGIN GET ROUT
  app.get("/login",(req,res)=>{
    const userid = req.cookies["user_id"];
  // const user = req.body.email;
  // if (user === helperEmail(users)) {
  //   console.log("USERID:",userid,"USER:",user)
  //   return res.redirect("/urls");
  // }
    
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
    console.log("long:",longURL)
    res.redirect(longURL);
  });
  //single url
  app.get("/urls/:shortURL", (req, res) => {
    // const longURL = urlDatabase.shortURL
    // const user = users[userid];
    const shortURL = urlDatabase[req.params.shortURL]
    const userid = req.cookies["user_id"];
    const templateVars = {
      shortURL: req.params.shortURL,
      longURL: shortURL.longURL,
      user: req.cookies["user_id"],
    };
    if(userid !== shortURL.userID){
      res.send("you dont have acces to this url")
    }
     return res.render("urls_show", templateVars);
  });
  //APP.POST for newURLS
  app.post("/urls", (req, res) => {
      const shortURL = generateRandomString()
      const longURL = req.body["longURL"]
      const userId = req.cookies["user_id"];
      const user = users[userId];
    console.log("LONGURL:",longURL)
    console.log("RANDOM:",shortURL);  // Log the POST request body to the console
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
      const shortUrl = req.params.shortURL
      const longURL = req.body.longURL;
      urlDatabase[shortURL]["longURL"] = longURL;
     return  res.redirect("/urls")

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
    res.send("Error code: 403, Account not registerd");
    return;
  } else if (bcrypt.compareSync(password, user.password)) {
    res.cookie("user_id", user.id);

    res.redirect("/urls");
  }
  })
  app.post("/logout",(req,res)=>{
    res.clearCookie("user_id")
    console.log(users)
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
      if(users[user] === email){
        
        return res.status(400).send('email already exists')
    }
    }
    users[user] = {
      id: user,
      email: req.body.email,
      password: encrypted,
    };
    console.log("USERS:", users)
    
    res.cookie("user_id", user)
    res.redirect("/urls")

  })
  
  
  

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});