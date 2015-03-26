/**
 * AuthenticationController
 *
 * @description :: Server-side logic for managing authentications
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var cryptoJS = require("crypto-js");

module.exports = {
    /**
     * `AuthenticationController.index()`
     */
    index: function (req, res) {
        return res.json({
            todo: 'index() is not implemented yet!'
        });
    },
    /**
     * `AuthenticationController.login()`
     */
    login: function (req, res) {

        var givenUsername = req.param("username");
        var givenPassword = req.param("password");

        if (givenUsername === null || givenUsername === undefined)
        {
            return res.json({
                message: "Bad username.",
                errorMessage: "Bad username. No valid login parameter found",
                errorCode: 3000
            });
        }

        if (givenPassword === null || givenPassword === undefined)
        {
            return res.json({
                message: "Bad username.",
                errorMessage: "Bad username. No valid password parameter found",
                errorCode: 3010
            });
        }


        var lookingForUser = {username: givenUsername, password: cryptoJS.SHA256(givenPassword).toString(cryptoJS.enc.Base64), isActive: true};

        ChatonUser.findOne(lookingForUser, function (err, cUser) {

            if (err !== null)
            {
                console.log("login error: " + err);
                return res.json({
                    message: "Login problem.",
                    errorMessage: "Login problem. Please check this error: " + err,
                    errorCode: 3020,
                    err: err
                });
            }

            if (cUser !== undefined)
            {
                console.log("login, user found: " + cUser.username);
                req.session.authenticated = true;
                req.session.sessionkey = cUser.sessionkey;
                req.session.username = cUser.username;

                //req.signedCookies.authenticated = true;
                //req.signedCookies.sessionkey = cUser.sessionkey;
                //req.signedCookies.username = cUser.username;

                res.cookie('authenticated', true);
                res.cookie('sessionkey', cUser.sessionkey);
                res.cookie('username', cUser.username);


                console.log("login, req.session.authenticated: " + req.session.authenticated);
                console.log("login, req.session.authenticated: " + req.session.authenticated);
                console.log("login, req.session.sessionkey: " + req.session.sessionkey);
                console.log("login, req.session.username: " + req.session.username);

                console.log("login, req.cookies.authenticated: " + req.cookies.authenticated);
                console.log("login, req.cookies.sessionkey: " + req.cookies.sessionkey);
                console.log("login, req.cookies.username: " + req.cookies.username);

                return res.json({
                    message: "Login OK.",
                    errorMessage: "",
                    errorCode: 0
                });

            } else
            {
                console.log("login, problem with user: " + cUser);
                return res.json({
                    message: "Login problem.",
                    errorMessage: "Login problem. Please check this error: " + err,
                    errorCode: 3040,
                    err: err
                });
            }

        });


    },
    /**
     * `AuthenticationController.logout()`
     */
    logout: function (req, res) {

        res.clearCookie('authenticated');
        res.clearCookie('sessionkey');
        res.clearCookie('username');

        req.session.authenticated = true;
        req.session.sessionkey = "";
        req.session.username = "";


        return res.json({
            message: "Logged out. Goodbye !",
            errorMessage: "",
            errorCode: 0
        });
    },
    /**
     * `AuthenticationController.register()`
     */
    register: function (req, res) {

        res.clearCookie('authenticated');
        res.clearCookie('sessionkey');
        res.clearCookie('username');

        req.session.authenticated = true;
        req.session.sessionkey = "";
        req.session.username = "";

        var givenUsername = req.param("username");
        var givenPassword1 = req.param("password1");
        var givenPassword2 = req.param("password2");
        var givenEmail = req.param("email");



        var newUser = {username: givenUsername, password: cryptoJS.SHA256(givenPassword1).toString(cryptoJS.enc.Base64), isActive: true, isAdmin: false, email: givenEmail};

        ChatonUser.create(newUser).exec(function (err, record) {

            if (err !== null)
            {
                console.log("Registration error: " + err);
                return res.json({
                    message: "Registration problem.",
                    errorMessage: "Registration problem. Please check this error: " + err,
                    errorCode: 3080,
                    err: err
                });
            } else
            {
                return res.json({
                    message: "Registration OK.",
                    errorMessage: "",
                    errorCode: 0,
                    err: err
                });
            }



        });

    },
    /**
     * `AuthenticationController.check()`
     */
    check: function (req, res) {

        var authStatus = {authenticated: false, usedCookies: false, usedSession: false, username: "guest", code: 9999};

        if (req.cookies.authenticated) {

            ChatonUser.findOne({sessionkey: req.cookies.sessionkey}, function (err, cUser) {

                if (err !== null)
                {
                    console.log("check error: " + err);
                    //return res.serverError("Error when finding user for authentication !!!");
                    authStatus.code = 1010;
                    try {
                        return res.json(authStatus);
                    } catch (ex)
                    {
                        console.log("res.json(authStatus) problem");
                    }
                }

                if (cUser !== undefined)
                {
                    console.log("check username: " + cUser.username);
                    //return next();
                    authStatus.authenticated = true;
                    authStatus.usedCookies = true;
                    authStatus.username = cUser.username;
                    authStatus.code = 1020;
                    try {
                        return res.json(authStatus);
                    } catch (ex)
                    {
                        console.log("res.json(authStatus) problem");
                    }
                } else
                {
                    console.log("check, problem with user: " + cUser);
                    //return res.forbidden('You are not permitted to perform this action.');
                    authStatus.code = 1030;
                    try {
                        return res.json(authStatus);
                    } catch (ex)
                    {
                        console.log("res.json(authStatus) problem");
                    }
                }


            });

        } else
        {
            console.log("check, req.signedCookies.authenticated: " + req.cookies.authenticated);
            //return res.forbidden('You are not permitted to perform this action.');
            authStatus.code = 1040;
            try {
                return res.json(authStatus);
            } catch (ex)
            {
                console.log("res.json(authStatus) problem");
            }
        }

        if (req.session.authenticated) {

            ChatonUser.findOne({sessionkey: req.session.sessionkey}, function (err, cUser) {

                if (err !== null)
                {
                    console.log("check error: " + err);
                    //return res.serverError("Error when finding user for authentication !!!");
                    authStatus.code = 1050;
                    try {
                        return res.json(authStatus);
                    } catch (ex)
                    {
                        console.log("res.json(authStatus) problem");
                    }
                }

                if (cUser !== undefined)
                {
                    console.log("check username: " + cUser.username);
                    //return next();
                    authStatus.authenticated = true;
                    authStatus.usedSession = true;
                    authStatus.username = cUser.username;
                    authStatus.code = 1060;
                    try {
                        return res.json(authStatus);
                    } catch (ex)
                    {
                        console.log("res.json(authStatus) problem");
                    }
                } else
                {
                    console.log("check, problem with user: " + cUser);
                    //return res.forbidden('You are not permitted to perform this action.');
                    authStatus.code = 1070;
                    try {
                        return res.json(authStatus);
                    } catch (ex)
                    {
                        console.log("res.json(authStatus) problem");
                    }
                }


            });

        } else
        {
            console.log("check, req.session.authenticated: " + req.session.authenticated);
            //return res.forbidden('You are not permitted to perform this action.');
            authStatus.code = 1080;
            try {
                return res.json(authStatus);
            } catch (ex)
            {
                console.log("res.json(authStatus) problem");
            }
        }



    }
};

