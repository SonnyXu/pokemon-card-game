var express = require('express');
var mongoose = require('mongoose')
var path = require('path');
var cors = require('cors');
// var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/Models.js').User;
// var Document = require('./models/Models.js').Document;
// var EditorState = require('draft-js').EditorState;
// var convertToRaw = require('draft-js').convertToRaw;
// Express setup
var app = express();
// app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
mongoose.connection.on('connected', function() {
  console.log('Connected to MongoDB!')
})
mongoose.connection.on('error', function(err) {
  console.log(err)
})

var session = require('express-session')
var MongoStore = require('connect-mongo')(session)

app.use(session({
  secret: 'my secret here',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}))


passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({username: username}, function(error, result) {
      if (error) {
        console.log('Error in finding the user', error)
        return done(error)
      } else {
        if (!result) {
          console.log(result);
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (password === result.password) {
          return done(null, result)
        } else {
          console.log('Incorrect password')
          return done(null, false)
        }
      }
    })
  }
))

// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  done(null, user._id)
})

passport.deserializeUser(function(id, done) {
  var user;
  User.findById(id, function(error, result) {
    if (error) {
      console.log('Error in finding the user', error)
    } else {
      user = result
    }
    done(error, user)
  })
})

// PASSPORT MIDDLEWARE HERE
app.use(passport.initialize())
app.use(passport.session())

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (!user) {return res.status(400).json({error: 'No user found!'})}
    if (err) {return res.status(500).json({error: err.message})}
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.json({username: user.username})
    });
  })(req, res, next);
});

app.post('/register', function(req, res) {
  User.findOne({username: req.body.username}, function(err, result) {
    if (err) console.log(err);
    if (!result) {
      new User(req.body)
        .save()
        .then((user) => {
          console.log(user);
          res.json({username: user.username});
        })
        .catch((err) => res.status(500).end(err.message))
    } else {
      res.json({err: "repetitve username"})
    }
  })
})



app.listen(1337, function() {
  console.log("Server starting!")
})
