
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
}
