//helps generate randome string
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
//Email helper V2

const getUserByEmail = function (email, usersDB) {
    let foundUser = null;
    for (user in usersDB) {
      if (usersDB[user].email === email) {
        foundUser = usersDB[user];
      }
    }
    return foundUser;
  };
  //URLSFORUSERS HELPER

const urlsForUser = (user_id,urlDB) => {
    const shortURLs = {};
    for (const key in urlDB) {
      if (user_id === urlDB[key]["userID"]) {
        shortURLs[key] = urlDB[key]["longURL"];
      }
    }
    return shortURLs;
  };
  module.exports = {generateRandomString,getUserByEmail,urlsForUser}