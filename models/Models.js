var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectID;
if (! process.env.MONGODB_URI) {
  console.log('Error: MONGODB_URI is not set. Did you run source env.sh ?');
  process.exit(1);
}
var connect = process.env.MONGODB_URI;
mongoose.connect(connect);

function generateEmptyMap(row, col) {
  let x = [];
  for (let i = 0; i < row; i++) {
    x[i] = new Array(col);
    for (let j = 0; j < col; j++) {
      x[i][j] = {};
    }
  }
  return x;
}

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  saves: {
    type: Object,
    default: {1: "", 2: "", 3: "", 4: "", 5:""}
  }
});

var saveInfoSchema = new mongoose.Schema({
  username: {
    type: String
  },
  savingSpots: {
    type: Number
  },
  worldMap: {
    type: Array,
  },
  position: {
    type: Array,
  },
  start: {
    type: Boolean,
  },
  status: {
    type: String,
  },
  level: {
    type: Number,
  },
  row: {
    type: Number,
  },
  col: {
    type: Number,
  },
  showModal: {
    type: Boolean,
  },
  showModal2: {
    type: Boolean,
  },
  showModal3: {
    type: Boolean,
  },
  showModal4: {
    type: Boolean,
  },
  showModal5: {
    type: Boolean,
  },
  cards: {
    type: Array,
  },
  cardsCanBeUsed: {
    type: Object,
  },
  cardsAfterWin: {
    type: Array,
  },
  cardsHold: {
    type: Object,
  },
  pokemon: {
    type: Object,
  },
  allPokemon: {
    type: Array,
  },
  money: {
    type: Number,
  },
  wakeup: {
    type: Boolean,
  },
  color: {
    type: Array,
  },
  costHave: {
    type: Number,
  },
  costMax: {
    type: Number,
  },
  cardsUsed: {
    type: Array,
  },
  cardsLeft: {
    type: Array
  },
  cardsInHand: {
    type: Array
  },
  saveTime: {
    type: Date
  }
});


var User = mongoose.model('User', userSchema);
var Info = mongoose.model('Info', saveInfoSchema);


module.exports = {
  User: User,
  Info: Info
}
