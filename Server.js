var express = require('express');
var mongoose = require('mongoose')
var path = require('path');
var cors = require('cors');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var User = require('./models/Models.js').User;

// Express setup
var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', function() {
  console.log('Connected to MongoDB!')
})
mongoose.connection.on('error', function(err) {
  console.log(err)
})

app.post('/login', function(req, res) {
  if (typeof req.body.username === 'string' && typeof req.body.password === 'string') {
    User.findOne({username: req.body.username}, function(err, result) {
      if (err) console.log(err);
      if (!result) {
        res.json({err: `Username not found!`});
      } else {
        if (result.password === req.body.password) {
          jwt.sign({id: result._id, username: result.username, password: result.password}, process.env.JWT_SECRET, { expiresIn: '1d' }, function(err, token) {
            let newObj = {};
            for (let key in result) {
              if (key !== "username" && key !== "password" && key !== "_id") {
                newObj[key] = result[key]
              }
            }
            res.json({token: token, info: newObj});
          });
        } else {
          res.json({err: "Wrong password"});
        }
      }
    })
  } else {
    res.status(403).send({err: 'Invalid username or password.'});
  }
});

app.post('/register', function(req, res) {
  if (typeof req.body.username === 'string' && typeof req.body.password === 'string') {
    User.findOne({username: req.body.username}, function(err, result) {
      if (err) console.log(err);
      if (!result) {
        new User(req.body)
        .save()
        .then((user) => {
          res.json({username: user.username});
        })
        .catch((err) => res.status(500).end(err.message))
      } else {
        res.json({err: "repetitve username"})
      }
    })
  } else {
    res.status(403).send({err: 'Invalid username or password.'});
  }
})

app.post('/checktoken', function(req, res) {
  let tokenArr = req.headers.authentication.split(' ')
  if (tokenArr[0] === 'bearer' && typeof tokenArr[1] === 'string') {
    jwt.verify(tokenArr[1], process.env.JWT_SECRET, function (err, userInfo) {
      res.json({username: userInfo.username, password: userInfo.password});
    })
  } else {
    res.sendStatus(401);
  }
})

app.post('/save', function(req, res) {
  let tokenArr = req.headers.authentication.split(' ')
  if (tokenArr[0] === 'bearer' && typeof tokenArr[1] === 'string') {
    jwt.verify(tokenArr[1], process.env.JWT_SECRET, function (err, userInfo) {
      User.findOne({username: userInfo.username}, function(err, user) {
        for (let key in req.body) {
          user[key] = req.body[key]
        }
        user.save()
        .then(user => res.json(req.body))
      })
    })
  } else {
    res.sendStatus(401);
  }
})


app.listen(1337, function() {
  console.log("Server starting!")
})
