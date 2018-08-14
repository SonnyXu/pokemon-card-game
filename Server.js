var express = require('express');
var mongoose = require('mongoose')
var path = require('path');
var cors = require('cors');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var User = require('./models/Models.js').User;
var Info = require('./models/Models.js').Info;

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
            if (err) res.json({err: "Failed to sign token"});
            res.json({status: "success", token: token});
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
      if (err) res.json({err: "Wrong token"});
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
      Info.findOne({username: userInfo.username, savingSpots: req.body.savingSpots}, function(err, info) {
        if (err) res.json({'error': err});
        if (info === null) {
          let newInfo = new Info(Object.assign({}, req.body, {username: userInfo.username}));
          newInfo.save(function(err) {
            if (err) res.json({'error': err});
          })
          User.findOne({username: userInfo.username}, function(err, user) {
            let obj = user.saves;
            let key = JSON.stringify(req.body.savingSpots);
            let value = newInfo._id.toString()
            user.saves[key] = value;
            user.update(user, function(err) {
              if (err) res.json({'error': err});
              else res.json({'status': "success"})
            })
          })
        } else {
          info.update(req.body, function(err) {
            if (err) res.json({'error': err});
            else {
              User.findOne({username: userInfo.username}, function(err, user) {
                if (err) console.log(err);
                let obj = user.saves;
                let key = JSON.stringify(req.body.savingSpots);
                let value = info._id.toString()
                user.saves[key] = value;
                user.update(user, function(err) {
                  if (err) res.json({'error': err});
                  else res.json({'status': "success"})
                })
              })
            }
          })
        }
      })
    })
  } else {
    res.sendStatus(401);
  }
})

app.get('/continue', function(req, res) {
  let tokenArr = req.headers.authentication.split(' ')
  if (tokenArr[0] === 'bearer' && typeof tokenArr[1] === 'string') {
    jwt.verify(tokenArr[1], process.env.JWT_SECRET, function (err, userInfo) {
      Info.find({username: userInfo.username}, function(err, info) {
        if (err) res.json({'error': err});
        else if (info.length === 0) res.json({'error': 'No saving history'});
        else {
          let index = 0
          let latest = info[0].saveTime;
          for (let i = 1; i < info.length; i++) {
            if (info[i].saveTime > latest) {
              index = i;
              latest = info[i].saveTime;
            }
          }
          let obj = Object.assign({}, {}, info[index]._doc);
          delete obj.username;
          delete obj._id;
          delete obj.__v;
          delete obj.saveTime;

          res.json({info: obj});
        }
      })
    })
  } else {
    res.sendStatus(401);
  }
})

app.get('/showLoad', function(req, res) {
  let tokenArr = req.headers.authentication.split(' ')
  if (tokenArr[0] === 'bearer' && typeof tokenArr[1] === 'string') {
    jwt.verify(tokenArr[1], process.env.JWT_SECRET, function (err, userInfo) {
      Info.find({username: userInfo.username}, function(err, info) {
        if (err) res.json({'error': err});
        else if (info.length === 0) res.json({'empty': 'No saving history'})
        else {
          let data = [];
          for (let i = 0; i < info.length; i++) {
            data.push({saveTime: info[i].saveTime, pokemon: info[i].pokemon, savingSpots: info[i].savingSpots});
          }
          res.json({info: data});
        }
      })
    })
  } else {
    res.sendStatus(401);
  }
})

app.post('/loadGame', function(req, res) {
  console.log('goes inside load game route');
  let tokenArr = req.headers.authentication.split(' ')
  if (tokenArr[0] === 'bearer' && typeof tokenArr[1] === 'string') {
    jwt.verify(tokenArr[1], process.env.JWT_SECRET, function (err, userInfo) {
      Info.findOne({username: userInfo.username, savingSpots: req.body.savingSpots}, async function(err, info) {
        if (err) res.json({'error': err});
        else if (!info) res.json({'error': 'empty'});
        else {
          let obj = Object.assign({}, {}, info._doc);
          delete obj.username;
          delete obj._id;
          delete obj.__v;
          delete obj.saveTime;
          console.log(obj.username)

          res.json({info: obj});
        }
      })
    })
  } else {
    res.sendStatus(401);
  }
})

app.listen(1337, function() {
  console.log("Server starting!")
})
