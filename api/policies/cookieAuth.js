/**
 * cookieAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function (req, res, next) {

    // User is allowed, proceed to the next policy, 
    // or if this is the last policy, the controller

    console.log("cookieAuth, sails.sid: " + sails.sid);

    if (req.cookies.authenticated) {

        ChatonUser.findOne({sessionkey: req.cookies.sessionkey}, function (err, cUser) {

            if (err != null)
            {
                console.log("cookieAuth error: " + err);
                return res.serverError("Error when finding user for authentication !!!");
            }

            if (cUser !== undefined)
            {
                console.log("cookieAuth username: " + cUser.username);
                return next();
            } else
            {
                console.log("cookieAuth, problem with user: " + cUser);
                return res.forbidden('You are not permitted to perform this action.');
            }


        });

    } else
    {
        console.log("cookieAuth, req.signedCookies.authenticated: " + req.cookies.authenticated);
        return res.forbidden('You are not permitted to perform this action.');
    }

    // User is not allowed
    // (default res.forbidden() behavior can be overridden in `config/403.js`)

};
