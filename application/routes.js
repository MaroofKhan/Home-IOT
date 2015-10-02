
module.exports = function (application) {
    application.get('/api', 
        function (request, response) {
            response.json({
                message: "Central Hub!"
            });
        });
                    
    application.post('/api/',
        function() {
                
        });
}
