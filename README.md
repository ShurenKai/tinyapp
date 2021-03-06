# Welcome to the tiny-url app created by Cassie/Ren Chen! #

## In order for all of this madness to work, I needed to download the following dependencies: ##
* "bcryptjs" version 2.4.3,
* "body-parser" version 1.19.0,
* "cookie-session" version 1.4.0,
* "ejs" version 3.1.6,
* "express" version 4.17.1,
* "method-override" version 3.0.0

You can download all of these with a simple ``` npm install ``` command!
Once that is done, you may use the command ```node express_server``` to see what's going on :3c
(that is the ```express_server.js``` file)

##### Oh, I see that you're not logged in or registered but tried to . Well don't worry, you can click either sentence to redirect you to the relevent pages #####

 !["Screenshot of Unlogged in URLS page"](https://github.com/ShurenKai/tinyapp/blob/master/docs/urlsPageUnloggedInUPDATED.png?raw=true)

##### Register yourself in order to access anything within this app, this screenshot only shows the change in the page, everything else is roughly the same :D #####

!["Screenshot of Registration page"](https://github.com/ShurenKai/tinyapp/blob/master/docs/registration.png?raw=true)

##### When you register, you realize that you have a new urls page, listing all of your URLs. So far, we've created none but that's soon to change. #####

!["Screenshot of Logged in URLS page"](https://github.com/ShurenKai/tinyapp/blob/master/docs/URLsPageLoggedIn.png?raw=true)

##### And voila! You've made a URL that is so much shorter than it's original! If you clicked the tinyURL link itself, it'll redirect you to wherever you need to go. #####

!["Screenshot of URL creation page"](https://github.com/ShurenKai/tinyapp/blob/master/docs/URLCreationAndEditing.png?raw=true)

###### Thank you for registering and may your links be very small ######

### Additional information ###
#### Behaviour requirements ####

**GET /**

*if user is logged in:*
>(Minor) redirect to /urls

*if user is not logged in:*
>(Minor) redirect to /login

**GET /URLS**

*if user is logged in:*
>returns HTML with:
>>the site header (see Display Requirements above)
>>a list (or table) of URLs the user has created, each list item containing:
>>a short URL
>>the short URL's matching long URL
>>an edit button which makes a GET request to /urls/:id
>>a delete button which makes a POST request to /urls/:id/delete
>>(Minor) a link to "Create a New Short Link" which makes a GET request to /urls/new

*if user is not logged in:*
>returns HTML with a relevant error message

**GET /urls/new**

*if user is logged in:*
>returns HTML with:
>>the site header (see Display Requirements above)
>a form which contains:
>>a text input field for the original (long) URL
>>a submit button which makes a POST request to /urls

*if user is not logged in:*
>redirects to the /login page

**GET /urls/:id**

*if user is logged in and owns the URL for the given ID:*
>returns HTML with:
>>the site header (see Display Requirements above)
>>the short URL (for the given ID)
>a form which contains:
>>the corresponding long URL
>>an update button which makes a POST request to /urls/:id

*if a URL for the given ID does not exist:*
>(Minor) returns HTML with a relevant error message

*if user is not logged in:*
>returns HTML with a relevant error message

*if user is logged it but does not own the URL with the given ID:*
>returns HTML with a relevant error message

**GET /u/:id**

*if URL for the given ID exists:*
>redirects to the corresponding long URL

*if URL for the given ID does not exist:*
>(Minor) returns HTML with a relevant error message

**POST /urls**

*if user is logged in:*
>generates a short URL, saves it, and associates it with the user
redirects to /urls/:id, where :id matches the ID of the newly saved URL

*if user is not logged in:*
>(Minor) returns HTML with a relevant error message

**POST /urls/:id**

*if user is logged in and owns the URL for the given ID:*
>updates the URL
>redirects to /urls
>if user is not logged in:
>(Minor) returns HTML with a relevant error message

*if user is logged it but does not own the URL for the given ID:*
>(Minor) returns HTML with a relevant error message

**POST /urls/:id/delete**

*if user is logged in and owns the URL for the given ID:*
>deletes the URL
>redirects to /urls

*if user is not logged in:*
>(Minor) returns HTML with a relevant error message

*if user is logged it but does not own the URL for the given ID:*
>(Minor) returns HTML with a relevant error message

**GET /login**

*if user is logged in:*
>(Minor) redirects to /urls

*if user is not logged in:*
>returns HTML with:
>a form which contains:
>>input fields for email and password
>>submit button that makes a POST request to /login

**GET /register**

*if user is logged in:*
>(Minor) redirects to /urls

*if user is not logged in:*
>returns HTML with:
>a form which contains:
>>input fields for email and password
>>a register button that makes a POST request to /register

**POST /login**

*if email and password params match an existing user:*
>sets a cookie
>redirects to /urls

*if email and password params don't match an existing user:*
>returns HTML with a relevant error message

**POST /register**

*if email or password are empty:*
>returns HTML with a relevant error message

*if email already exists:*
>returns HTML with a relevant error message
>otherwise:
>>creates a new user
>>encrypts the new user's password with bcrypt
>>sets a cookie
>>redirects to /urls

**POST /logout**

deletes cookie
redirects to /urls