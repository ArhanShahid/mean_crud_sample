var express        = require('express');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var errorhandler  = require('static-favicon');
var path = require('path');

var mongoose       = require("mongoose");
var app            = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'client'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/client')); 	// set the static files location /public/img will be /img for users
app.use(morgan('dev')); 					// log every request to the console
app.use(bodyParser()); 						// pull information from html in POST
app.use(methodOverride()); 					// simulate DELETE and PUT


if ('development' == app.get('env')) {
    app.use(errorhandler());
}

mongoose.connect('localhost/sampledb', function(err, db) {
    if (err) {
        console.log("Can not connect to DB");
        console.log(err);
    }
    else {
        console.log("Connected to DB");
    }
});

var Schema   = mongoose.Schema;

var UserSchema = new Schema ({
    f_name        : String,
    l_name        : String
});

var UserModel = mongoose.model('user', UserSchema);

app.post('/api/register', function(req, res){

    console.log("API : /api/register");
    console.log(req.body);

    var user = new  UserModel();

    user.f_name    = req.body.f_name;
    user.l_name    = req.body.l_name;

    user.save(function(err, data){
        if(err){
            console.log("Operation failed, error in saving new Profile in DB");
            console.log(err);
            res.send({status: false, message : "Operation failed, error in saving new Profile in DB", errObj : err});
        } else {
            res.json({status: true, data : data});
        }
    });

});

app.post('/api/update/:id', function(req, res){

    console.log("API : /api/update/:id");
    console.log(req.body);

    UserModel.findOne({_id:req.params.id},function (err, data) {
        if (err) {
            console.log(err)
        }else{

            data.f_name    = req.body.f_name;
            data.l_name    = req.body.l_name;
            data.save(function(err, data){
                if(err){
                    console.log("Operation failed, error in saving new Profile in DB");
                    console.log(err);
                    res.send({status: false, message : "Operation failed, error in saving new Profile in DB", errObj : err});
                } else {
                    res.json({status: true, data : data});
                }
            });
        }
    });

});

app.get("/api/get", function(req, res){

    console.log("API : /get");
    UserModel.find({},function (err, data) {
        if (err) {
            console.log(err)
        }else{
            console.log(data);
            res.json({status: true, data : data});
        }
    });
});

app.delete('/api/delete/:id', function(req, res){

    UserModel.findOne({_id:req.params.id},function (err, data) {
        if (err) {
            console.log(err)
        }else{
            console.log(data);
            data.remove(function(err,deleteResponce){
                if(err){
                    res.send(err)
                }else {
                    res.json({status: true, data : deleteResponce});
                }
            });

        }
    });

});


app.listen(app.get('port'),function(){
    console.log('Express server listening on port ' + app.get('port'));
});

