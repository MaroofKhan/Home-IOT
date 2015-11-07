var Firebase = require('firebase');
var FirebaseRef = new Firebase('https://homeiot.firebaseio.com/');

module.exports = function (application) {
    
    // TEST ROUTES
    
    application.get ('/api', 
        function (request, response) {
            response.json({
                message: "Central Hub!"
            });
        });
                    
    application.post ('/api/trypost',
        function (request, response) {
            var message = request.body.message;
            response.send({ message: message });
        });
   
    // USER ROUTES
    application.post ('/api/signup',
        function(request, response) {
            var recalled = false;
            var username = request.body.username;
            var password = request.body.password;
            var email = request.body.email;
            FirebaseRef.on("child_added", function(snapshot) {
                if (snapshot.key() == username && !recalled) {
                    response.json({Status: 'Username taken'});
                }
                else if (recalled) {
                    response.json({Status: 'New user created'})
                }
            });
            recalled = true;
            FirebaseRef.child(username).set({
                email: email,
                password: password
            })
        });
        
    application.post ('/api/login',
        function(request, response) {
            var username = request.body.username;
            var password = request.body.password;
            FirebaseRef.child(username).on("value", function(snapshot) {
                if (password == snapshot.val().password) {
                    response.json({Status: 'Success'});
                }
                else {
                    response.json({Status: 'Failed'});
                }
            }); 
        });
             
     application.get ('/api/users', 
        function(request, response) {
            var users = [];
            FirebaseRef.on("value", function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    var key = childSnapshot.key();
                    users.push(key);
                });
                response.json({users: users});
            });
        });
        
    // GEYSER ROUTES
    application.post ('/api/geyser/history', 
        function(request, response) {
            var time = request.body.time;
            var username = request.body.username;
            var newTime = FirebaseRef.child( username + '/geyser/history' ).push();
            newTime.set({
                time: time
            });
            response.json({ Status: "Success", TimeInserted: time});
        });
        
     application.post('/api/geyser/definitions',
        function(request, response) {
             var username = request.body.username;
             
             var custom = request.body.custom;
             var hot = request.body.hot;
             var normal = request.body.normal;
             var veryhot = request.body.veryhot;
             var warm = request.body.warm;
             
             var defRef = FirebaseRef.child( username + '/geyser/definitions' );
             defRef.set({ 
                 hot: hot, 
                 normal: normal, 
                 veryhot: veryhot, 
                 warm: warm, 
                 custom: custom });
             
             response.json({ status: "Success"});
        });
     
     // LOCK ROUTES
     application.get ('/api/:username/lock/guests/', 
        function(request, response) {
            var username = request.params.username;
            FirebaseRef.child(username + '/lock/guests').on("value", function(snapshot) {
                response.json(snapshot.val());
            });
        });
        
     application.post ('/api/lock/history',
        function(request, response) {
            var username = request.body.username;
            var time = request.body.time;
            var person = request.body.person;
            var newHistory = FirebaseRef.child(username + '/lock/history').push();
            newHistory.set({
                person: person,
                time: time
            })
        });

        
     application.post( '/api/:username/lock/guests', 
        function(request, response) {
            var username = request.params.username;
            var validFrom = request.body.validFrom;
            var guest = request.body.guest;
            var expires = request.body.expires;
            
            var newLock = FirebaseRef.child(username + '/lock/guests').push();
            newLock.set({
                guest: guest,
                validFrom: validFrom,
                expires: expires,
                created: date()
            });
            
            var newAvailableKey = FirebaseRef.child(guest + '/lock/available-keys/' + newLock.key());
            newAvailableKey.set({
                sender: username
            });
            
            response.json({ key: newLock.key() });
        });
        
     application.get( '/api/:username/lock/guests/latest',
        function(request, response) {
             var username = request.params.username;
             var latest = { };
             FirebaseRef.child(username + '/lock/guests').on( "value", 
                function(snapshot) {
                    snapshot.forEach(function(child) {
                        if ( !latest.created || parseInt(latest.created) < parseInt(child.val().created) ) {
                            latest = child.val();
                            latest.key = child.key();
                        }
                    });
                    response.json({ lastinserted: latest });
                });
        });
        
     application.delete( '/api/:username/lock/guests', 
        function(request, response) {
            var username = request.params.username;
            var key = request.body.key;
            var called = false;
            var keyRef = FirebaseRef.child(username + '/lock/guests/' + key);
            
            keyRef.on("value", 
                function(snapshot) {
                    if (!called) {
                        called = true;
                        if (snapshot.exists()) {
                            var guest = snapshot.val().guest;
                            var guestKeyRef = FirebaseRef.child(guest + '/lock/available-keys/' + key);
                            // Remove key from guest's account
                            guestKeyRef.remove();
                            // Remove key from host's account
                            keyRef.remove();
                            response.json({ Status: "Success" });
                        }
                        else {
                            response.json({ Status: "Failed" });
                        }
                    }
                });
        });
        
     application.get( '/api/:username/lock/available-keys', 
        function(request, response) {
            var username = request.params.username;
            
            var keys = [ ];
            
            FirebaseRef.child(username + '/lock/available-keys').on('value', 
                function(snapshot) {
                    snapshot.forEach(function(child) {
                        var key = { };
                        key.key = child.key();
                        key.sender = child.val().sender;
                        console.log(key.sender + '/lock/guests/' + key.key);
                        FirebaseRef.child(key.sender + '/lock/guests/' + key.key).on('value', 
                            function (snap) {
                                key.expires = snap.val().expires;
                                key.validFrom = snap.val().validFrom;
                                keys.push(key);
                            });
                    });    
                    response.json({ keys: keys });
                });
        }); 
}


