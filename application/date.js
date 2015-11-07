module.exports = {
    date: function() {
            var now = new Date();
            var builder = "";
            builder += now.getFullYear();
            builder += now.getMonth() < 10 ? '0' + now.getMonth() + 1 : now.getMonth() + 1;
            builder += now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
            builder += now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
            builder += now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
            builder += now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds();
            return builder;
    }
}