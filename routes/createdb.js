const nano = require("./node_modules/nano")

exports.create = function(req, res) {
  nano.bind.create(req.body.dbname, function() {
    if(err) {
      res.send('Error creating the database');
      return;
    }
    res.send('Database created successfully');
  });
}