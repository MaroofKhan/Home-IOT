var Firebase = require('firebase');
var FirebaseRef = new Firebase('https://homeiot.firebaseio.com/');

module.exports = function (application) {
    application.get ('/api', 
        function (request, response) {
            response.json({
                message: "Central Hub!"
            });
        });
                    
    application.post ('/api/trypost',
        function (request, response) {
            var message = request.body.message;
            console.log('Success');
            response.send({ message: message });
        });
   
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
        
     application.get ('/api/lock/guests/:username', 
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
        
     application.get ('/api/users', 
        function(request, response) {
            var users = [];
            FirebaseRef.on("value", function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    var key = childSnapshot.key();
                    // key === "fred"
                    users.push(key);
                });
                response.json({users: users});
            });
        });
}
