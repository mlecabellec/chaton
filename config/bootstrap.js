/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function (cb) {

// It's very important to trigger this callback method when you are finished
// with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)


    var cryptoJS = require("crypto-js");
    var bootstrappedUsers = [{username: "root", password: cryptoJS.SHA256("root").toString(cryptoJS.enc.Base64), isActive: true, isAdmin: true, email: "mickael.lecabellec@gmail.com"},
        {username: "test1", password: cryptoJS.SHA256("test1").toString(cryptoJS.enc.Base64), isActive: true, isAdmin: false, email: "test1@booleanworks.com"},
        {username: "test2", password: cryptoJS.SHA256("test2").toString(cryptoJS.enc.Base64), isActive: true, isAdmin: false, email: "test2@booleanworks.com"},
        {username: "test3", password: cryptoJS.SHA256("test3").toString(cryptoJS.enc.Base64), isActive: true, isAdmin: false, email: "test3@booleanworks.com"}];

    bootstrappedUsers.forEach(function (cUser, cb) {
        ChatonUser.findOrCreate(cUser, cUser).exec(function (err, cUser) {
            if (err !== null)
            {
                console.log("Error with user creation/check: " + err);
            } else
            {
                console.log("User found or created: " + JSON.stringify(cUser));

            }

            var relatedProfile = {user: cUser, displayName: cUser.username};
            ChatonUserProfile.findOrCreate(relatedProfile, relatedProfile).exec(function (err, cUserProfile) {
                if (err !== null)
                {
                    console.log("Error with user profile creation/check: " + err);
                } else
                {
                    console.log("User profile found or created: " + JSON.stringify(cUserProfile));


                    if (cUser.username === "root")
                    {
                        var serverStatusThread = {title: "Server status thread"};

                        ChatonThread.findOrCreate(serverStatusThread, serverStatusThread).exec(function (err, cThread) {

                            if (err !== null)
                            {
                                console.log("Error with server status thread creation/check: " + err);
                            } else
                            {
                                console.log("Server status thread found or created: " + JSON.stringify(cThread));

                                if (err !== null)
                                {
                                    console.log("Error with root's profile retrieval: " + err);
                                } else
                                {

                                    console.log("Root's profile found: " + JSON.stringify(cUserProfile));

                                    var startupMessage = {thread: cThread.id, userProfile: cUserProfile.id, content: "Server started at " + new Date().toISOString()};
                                    ChatonMessage.findOrCreate(startupMessage, startupMessage).exec(function (err, cMessage) {
                                        if (err !== null)
                                        {
                                            console.log("Error with server status message creation/check: " + err);
                                        } else
                                        {
                                            if (cMessage === undefined)
                                            {
                                                console.log("Server status message NOT created: " + cMessage);
                                            } else
                                            {
                                                console.log("Server status message created: " + JSON.stringify(cMessage));

                                            }

                                        }


                                    });
                                }



                            }







                        });
                    }

                }

            });

        });
    });



    cb();
};
