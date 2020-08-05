var express = require('express');
var routes = require('routes');
var http = require('http');
var path = require('path');
var urlencoded = require('url');
var bodyparser = require('body-parser');
var json = require('json');
var logger = require('logger');
var methodOverride = require('method-override');

var nano = require('nano')('http://localhost:5948');

var db = nano.use('address');
var app = express();

app.set('port', process.env.port||3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);
app.post('/createdb', function(req, res) {
  nano.db.create(req.body.dbname, function(err) {
    if(err) {
      res.send('Error Creating Database' + req.body.dbname);
      return;
    }
    res.send('Database' + req.body.dbname + 'created successfully');
  });
});

app.post('/new_contact', function(req, res) {
  var name = req.body.name;
  var phone = req.body.phone;

  db.insert({name: name, phone: phone, crazy:true}, phone, function(err, body, header) {
    if(err) {
      res.send("Error Creating Contact");
      return;
    }
    res.send("Contact Created Successfully");
  });
});

app.post('/view_contact', function(req, res) {
  var alldoc = "Following are the contacts";

  db.get(req.body.phone, {revs_info:true}, function(err, body) {
    if(!err) {
      console.log(body);
    }
    if(body) {
      alldoc+="name: "+ body.name +"<br/Phone no:" + body.phone;
    }
    else {
      alldoc = "No Documents found";
    }
    res.send(alldoc);
  })
});

app.post('/delete_contact', function(req, res) {
  db.get(req.body.phone, {revs_info:true}, function(err, body) {
    if(!err) {
      db.destroy(req.body.phone, body_rev, function(err, body) {
        if(err) {
          res.send("Error Deleting Contact");
        }
        res.send("Contacts Deleted Successfully");
      })
    }
  })
})

http.createServer(app).listen(app.get('port'), function() {
  console.log('express server listening on port' + app.get('port'));
})

