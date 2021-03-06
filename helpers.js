const getUserByEmail = function(email, database) {
  for (let data in database) {
    if (database[data].email === email) {
      return database[data].id;
    }
  }
  return undefined;
};

const inUse = function(email, users) {
  for (let user in users) {
    if (email === users[user].email) {
      return true;
    }
  }
  return false;
};

const urlsForUser = function(id, database) {
  let listOfUrls = [];
  for (const url in database) {
    if (database[url].userID == id) {
      listOfUrls.push(url);
    }
  }
  return listOfUrls;
};

const generateRandomString = () => {
  let options = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let length = 6;
  let short = '';
  for (let i = 0; i <= length; i++) {
    short += options.charAt(Math.floor(Math.random() * options.length));
  }
  return short;
};

module.exports =  { getUserByEmail, inUse, urlsForUser, generateRandomString };