module.exports = function(app) {
    
    // Simple get route to see handlebars working
    app.get("/", function(req, res) {
        res.render('index');
    });
};