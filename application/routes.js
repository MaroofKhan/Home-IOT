
module.exports = function (application) {
    application.get ('/api', 
        function (request, response) {
            response.json({
                message: "Central Hub!"
            });
        });
                    
    application.post ('/api/trypost',
        function (request, response) {
            
            /*
            response.on("data", function(){})
            
            response.on("end", function() {
                console.log("Status Code: " + response.statusCode);
            });
            */
            var message = request.body.message;
            console.log(message);
            response.send(message);
        });
}
