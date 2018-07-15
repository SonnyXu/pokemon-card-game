import React, { Component } from 'react';
import ReactModal from 'react-modal';
import App from './App.js';
import Fight from './Fight.js'
import Card from './Card.js';
import './css/Game.css';
import Sound from 'react-sound';
import Merchant from './Merchant.js';
import Event from './Event.js';

class Game extends Component {
  constructor(props) {
    super(props);
    var x = new Array();
    for (var i = 0; i < 10; i++) {
      x[i] = new Array(20);
      for (var j = 0; j < 20; j++) {
        x[i][j] = {};
      }
    }
    this.state = {
      level: 0,
      start: false,
      worldMap: x,
      position: [],
      status: "free",
      showModal: false,
      showModal2: true,
      showModal3: true,
      showModal4: false,
      showModal5: true,
      cards:[],
      cardsCanBeUsed: {
        phy: [
          {name: "attack", attack: 5, cost: 1, description: "5 damages"},
          {name: "attack", attack: 5, cost: 1, description: "5 damages"},
          {name: "attack", attack: 5, cost: 1, description: "5 damages"},
          {name: "attack", attack: 5, cost: 1, description: "5 damages"},
          {name: "attack", attack: 5, cost: 1, description: "5 damages"},
          {name: "defence", defence: 5, cost: 1, description: "5 armor"},
          {name: "defence", defence: 5, cost: 1, description: "5 armor"},
          {name: "defence", defence: 5, cost: 1, description: "5 armor"},
          {name: "defence", defence: 5, cost: 1, description: "5 armor"},
          {name: "defence", defence: 5, cost: 1, description: "5 armor"},
          {name: "get two cards", getCards: 2, cost: 1, description: "get 2 cards"},
          {name: "healing", healing: 3, cost: 1, description: "get 3 health"},
        ],
        fire: [
          {name: "fire", fire: 3, cost: 1, description: "3 fire damages"},
          {name: "fire", fire: 3, cost: 1, description: "3 fire damages"},
          {name: "fire", fire: 3, cost: 1, description: "3 fire damages"}
        ],
        grass: [
          {name: "grass", grass: 3, cost: 1, description: "3 grass damages"},
          {name: "grass", grass: 3, cost: 1, description: "3 grass damages"},
          {name: "grass", grass: 3, cost: 1, description: "3 grass damages"}
        ],
        water: [
          {name: "water", water: 3, cost: 1, description: "3 water damages"},
          {name: "water", water: 3, cost: 1, description: "3 water damages"},
          {name: "water", water: 3, cost: 1, description: "3 water damages"}
        ]
      },
      allcards: {
        phy: [
          {name: "attack", attack: 5, cost: 1, description: "5 damages"},
          {name: "defence", defence: 5, cost: 1, description: "5 armor"},
          {name: "get two cards", getCards: 2, cost: 1, description: "get 2 cards"},
          {name: "healing", healing: 3, cost: 1, description: "get 3 health"},
        ],
        fire: [{name: "fire", fire: 3, cost: 1, description: "3 fire damages"}],
        grass: [{name: "grass", grass: 3, cost: 1, description: "3 grass damages"}],
        water: [{name: "water", water: 3, cost: 1, description: "3 water damages"}]
      },
      pokemon: {},
      allPokemon: [],
      money: 0,
      cardsAfterWin: [],
      wakeup: false,
      color: ['blue']
    }
  }

  openModal() {
    this.setState({
      showModal: true
    })
  }

  closeModal2() {
    var worldMap = this.state.worldMap;
    var position = this.state.position;
    worldMap[position[0]][position[1]].attribute.name = "";
    this.setState({
      showModal2: false,
      status: 'free',
      worldMap: worldMap
    })
  }

  closeModal3() {
    this.setState({
      showModal3: false,
      status: 'free'
    })
  }

  closeModal4() {
    this.setState({
      showModal4: false
    });
  }

  closeModal5() {
    this.setState({
      showModal5: false,
      status: 'free',
      wakeup: true
    })
  }

  handleCloseModal() {
    this.setState({
      showModal: false
    })
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }


  startGame() {
    if (this.state.start) return;
    var worldMap = this.state.worldMap;
    var level = this.state.level;
    level++;
    for (var i = 0; i < 10; i++) {
      for (var j = 0; j < 20; j++) {
        worldMap[i][j].attribute = {name: ""};
        worldMap[i][j].discovered = false;
      }
    }
    var startRow = this.getRandomInt(10);
    var startCol = this.getRandomInt(20);
    var endRow;
    var endCol;
    worldMap[startRow][startCol].attribute.name = "start";
    while (true) {
      endRow = this.getRandomInt(10);
      endCol = this.getRandomInt(20);
      if (Math.abs(endRow - startRow) + Math.abs(endCol - startCol) > 12) {
        worldMap[endRow][endCol].attribute.name = "end";
        break;
      }
    }
    var check = true;
    while (check) {
      for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 20; j++) {
          if (Math.abs(i - startRow) + Math.abs(j - startCol) <= 2) {
            worldMap[i][j].discovered = true;
          } else {
            worldMap[i][j].discovered = false;
          }
          if (worldMap[i][j].attribute.name !== "start") {
            if (worldMap[i][j].attribute.name !== "end" ) {
              worldMap[i][j].attribute.name = "";
            }
          }
        }
      }
      var rock = 0;
      while (rock < 80) {
        var rockRow = this.getRandomInt(10);
        var rockCol = this.getRandomInt(20);
        if (worldMap[rockRow][rockCol].attribute.name !== "start") {
          if (worldMap[rockRow][rockCol].attribute.name !== "end") {
            worldMap[rockRow][rockCol].attribute.name = "rock";
            rock ++;
          }
        }
      }
      var maze = new Array(10);
      for (var m = 0; m < 10; m++) {
        maze[m] = new Array(20);
        for (var n = 0; n < 20; n++) {
          maze[m][n] = {};
        }
      }
      for (var k = 0; k < 10; k++) {
        for (var l = 0; l < 20; l++) {
          maze[k][l].attribute = worldMap[k][l].attribute.name;
        }
      }

      var searchList = [[startRow, startCol]];
      while (searchList.length > 0) {
        var lastStep = searchList.pop();
        maze[lastStep[0]][lastStep[1]].attribute = "rock"
        if (lastStep[0] === endRow && lastStep[1] === endCol) {
          check = false;
          break;
        }
        else {
          if (lastStep[0]+1 < 10 && maze[lastStep[0]+1][lastStep[1]].attribute !== "rock") {
            searchList.push([lastStep[0]+1, lastStep[1]]);
          }
          if (lastStep[0]-1 >= 0 && maze[lastStep[0]-1][lastStep[1]].attribute !== "rock") {
            searchList.push([lastStep[0]-1, lastStep[1]]);
          }
          if (lastStep[1]+1 < 20 && maze[lastStep[0]][lastStep[1]+1].attribute !== "rock") {
            searchList.push([lastStep[0], lastStep[1]+1]);
          }
          if (lastStep[1]-1 >= 0 && maze[lastStep[0]][lastStep[1]-1].attribute !== "rock") {
            searchList.push([lastStep[0], lastStep[1]-1]);
          }
        }
      }
    }
    var pokemon = 0;
    var limit = this.getRandomInt(16);

    while(pokemon < limit + 16) {
      var pokemonRow = this.getRandomInt(10);
      var pokemonCol = this.getRandomInt(20);
      if (worldMap[pokemonRow][pokemonCol].attribute.name === "") {
        var health = this.getRandomInt(20*level) + 10;
        var random = this.getRandomInt(3);
        var attribute;
        if (random === 0) {
          attribute = "fire";
        } else if (random === 1) {
          attribute = "water";
        } else {
          attribute = "grass"
        }
        worldMap[pokemonRow][pokemonCol].attribute = {
          name: "pokemon",
          attribute: attribute,
          health: {
            currentHealth: health,
            maxHealth: health,
          },
          attack: {
            phy: 0,
            mag: 0
          },
          defence: 0,
          exp: this.getRandomInt(level*10) + 10,
          money: this.getRandomInt(level*10) + 10
        };
        pokemon ++;
      }
    }

    var merchant = 0;
    while (merchant < 5) {
      var merchantRow = this.getRandomInt(10);
      var merchantCol = this.getRandomInt(20);
      if (worldMap[merchantRow][merchantCol].attribute.name === "") {
        worldMap[merchantRow][merchantCol].attribute = {
          name: "merchant",
        };
        merchant ++
      }
    }

    var random = 0;
    var limit2 = this.getRandomInt(2)
    while (random < 5) {
      var randomRow = this.getRandomInt(10);
      var randomCol = this.getRandomInt(20);
      if (worldMap[randomRow][randomCol].attribute.name === "") {
        worldMap[randomRow][randomCol].attribute = {
          name: "random",
        };
        random ++
      }
    }
    var arr = this.state.position;
    arr.push(startRow, startCol);
    this.setState({
      level: level,
      worldMap: worldMap,
      start: true,
      position: arr,
    });
    console.log("Start Game!", this.state);
  }

  endGame2() {
    var obj = this.state.worldMap;
    for (var i = 0; i < 10; i++) {
      for (var j = 0; j < 20; j++) {
        obj[i][j].attribute.name = "";
        obj[i][j].discovered = false;
      }
    }
    var arr = this.state.position;
    arr.pop();
    arr.pop();
    this.setState({
      level: 0,
      start: false,
      worldMap: obj,
      position: arr,
      status: "free",
      showModal: false,
      showModal2: true,
      showModal3: true,
      showModal4: false,
      showModal5: true,
      cards:[],
      cardsCanBeUsed: {
        phy: [
          {name: "attack", attack: 5, cost: 1, description: "5 damages"},
          {name: "attack", attack: 5, cost: 1, description: "5 damages"},
          {name: "attack", attack: 5, cost: 1, description: "5 damages"},
          {name: "attack", attack: 5, cost: 1, description: "5 damages"},
          {name: "attack", attack: 5, cost: 1, description: "5 damages"},
          {name: "defence", defence: 5, cost: 1, description: "5 armor"},
          {name: "defence", defence: 5, cost: 1, description: "5 armor"},
          {name: "defence", defence: 5, cost: 1, description: "5 armor"},
          {name: "defence", defence: 5, cost: 1, description: "5 armor"},
          {name: "defence", defence: 5, cost: 1, description: "5 armor"},
          {name: "get two cards", getCards: 2, cost: 1, description: "get 2 cards"},
          {name: "healing", healing: 3, cost: 1, description: "get 3 health"},
        ],
        fire: [
          {name: "fire", fire: 3, cost: 1, description: "3 fire damages"},
          {name: "fire", fire: 3, cost: 1, description: "3 fire damages"},
          {name: "fire", fire: 3, cost: 1, description: "3 fire damages"}
        ],
        grass: [
          {name: "grass", grass: 3, cost: 1, description: "3 grass damages"},
          {name: "grass", grass: 3, cost: 1, description: "3 grass damages"},
          {name: "grass", grass: 3, cost: 1, description: "3 grass damages"}
        ],
        water: [
          {name: "water", water: 3, cost: 1, description: "3 water damages"},
          {name: "water", water: 3, cost: 1, description: "3 water damages"},
          {name: "water", water: 3, cost: 1, description: "3 water damages"}
        ]
      },
      allcards: {
        phy: [
          {name: "attack", attack: 5, cost: 1, description: "5 damages"},
          {name: "defence", defence: 5, cost: 1, description: "5 armor"},
          {name: "get two cards", getCards: 2, cost: 1, description: "get 2 cards"},
          {name: "healing", healing: 3, cost: 1, description: "get 3 health"},
        ],
        fire: [{name: "fire", fire: 3, cost: 1, description: "3 fire damages"}],
        grass: [{name: "grass", grass: 3, cost: 1, description: "3 grass damages"}],
        water: [{name: "water", water: 3, cost: 1, description: "3 water damages"}]
      },
      pokemon: {},
      allPokemon: [],
      money: 0,
      cardsAfterWin: [],
      wakeup: false,
      color: ['blue']
    });
  }

  endGame() {
    if (!this.state.start) return;
    var result = window.confirm("Are you sure to end this round")
    if (result) {
      var obj = this.state.worldMap;
      for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 20; j++) {
          obj[i][j].attribute.name = "";
          obj[i][j].discovered = false;
        }
      }
      var arr = this.state.position;
      arr.pop();
      arr.pop();
      this.setState({
        level: 0,
        start: false,
        worldMap: obj,
        position: arr,
        status: "free",
        showModal: false,
        showModal2: true,
        showModal3: true,
        showModal4: false,
        showModal5: true,
        cards:[],
        cardsCanBeUsed: {
          phy: [
            {name: "attack", attack: 5, cost: 1, description: "5 damages"},
            {name: "attack", attack: 5, cost: 1, description: "5 damages"},
            {name: "attack", attack: 5, cost: 1, description: "5 damages"},
            {name: "attack", attack: 5, cost: 1, description: "5 damages"},
            {name: "attack", attack: 5, cost: 1, description: "5 damages"},
            {name: "defence", defence: 5, cost: 1, description: "5 armor"},
            {name: "defence", defence: 5, cost: 1, description: "5 armor"},
            {name: "defence", defence: 5, cost: 1, description: "5 armor"},
            {name: "defence", defence: 5, cost: 1, description: "5 armor"},
            {name: "defence", defence: 5, cost: 1, description: "5 armor"},
            {name: "get two cards", getCards: 2, cost: 1, description: "get 2 cards"},
            {name: "healing", healing: 3, cost: 1, description: "get 3 health"},
          ],
          fire: [
            {name: "fire", fire: 3, cost: 1, description: "3 fire damages"},
            {name: "fire", fire: 3, cost: 1, description: "3 fire damages"},
            {name: "fire", fire: 3, cost: 1, description: "3 fire damages"}
          ],
          grass: [
            {name: "grass", grass: 3, cost: 1, description: "3 grass damages"},
            {name: "grass", grass: 3, cost: 1, description: "3 grass damages"},
            {name: "grass", grass: 3, cost: 1, description: "3 grass damages"}
          ],
          water: [
            {name: "water", water: 3, cost: 1, description: "3 water damages"},
            {name: "water", water: 3, cost: 1, description: "3 water damages"},
            {name: "water", water: 3, cost: 1, description: "3 water damages"}
          ]
        },
        allcards: {
          phy: [
            {name: "attack", attack: 5, cost: 1, description: "5 damages"},
            {name: "defence", defence: 5, cost: 1, description: "5 armor"},
            {name: "get two cards", getCards: 2, cost: 1, description: "get 2 cards"},
            {name: "healing", healing: 3, cost: 1, description: "get 3 health"},
          ],
          fire: [{name: "fire", fire: 3, cost: 1, description: "3 fire damages"}],
          grass: [{name: "grass", grass: 3, cost: 1, description: "3 grass damages"}],
          water: [{name: "water", water: 3, cost: 1, description: "3 water damages"}]
        },
        pokemon: {},
        allPokemon: [],
        money: 0,
        cardsAfterWin: [],
        wakeup: false,
        color: ['blue']
      });
    } else {
      return;
    }
  }

  move(row, col) {
    if (!this.state.start) return;
    if( Math.abs(this.state.position[0] - row) + Math.abs(this.state.position[1] - col) === 1) {
      var arr = this.state.position;
      arr.pop();
      arr.pop();
      arr.push(row, col);
      var obj = this.state.worldMap;
      for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 20; j++) {
          if (Math.abs(i - row) + Math.abs(j - col) <= 2) {
            obj[i][j].discovered = true;
          }
        }
      }
      this.setState({
        position: arr,
        worldMap: obj
      });
      if (this.state.worldMap[row][col].attribute.name === "pokemon") {
        console.log("Fight!");
        this.setState({status: "fight"});
      } else if (this.state.worldMap[row][col].attribute.name === "end") {
        window.alert("Congratulations!")
        this.endGame();
      } else if (this.state.worldMap[row][col].attribute.name === "merchant") {
        console.log('Merchant')
        this.setState({status: 'merchant'})
      } else if (this.state.worldMap[row][col].attribute.name === 'random') {
        console.log('Random')
        this.setState({status: 'random'})
      } else {
        this.setState({status: 'free'})
      }
    } else return;
  }

  win() {
    var worldMap = this.state.worldMap;
    var position = this.state.position;
    worldMap[position[0]][position[1]].attribute.name = "";
    var money = this.state.money;
    money += this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.money;
    var arr = this.state.cardsAfterWin;
    while (arr.length !== 0) {
      arr.pop();
    }
    var random = this.getRandomInt(3) + 1;
    while (random > 0) {
      arr.push(this.state.cards[this.getRandomInt(this.state.cards.length)]);
      random --;
    }
    this.setState({
      worldMap: worldMap,
      status: "free",
      showModal4: true,
      money: money,
      cardsAfterWin: arr
    });
    console.log(this.state.cardsAfterWin);
  }

  lose() {
    var obj = this.state.worldMap;
    for (var i = 0; i < 10; i++) {
      for (var j = 0; j < 20; j++) {
        obj[i][j].attribute.name = "";
        obj[i][j].discovered = false;
      }
    }
    var arr = this.state.position;
    arr.pop();
    arr.pop();
    this.setState({
      level: 0,
      start: false,
      worldMap: obj,
      position: arr,
      status: "free",
      showModal: false,
      showModal2: true,
      showModal3: true,
      showModal4: false,
      showModal5: true,
      cards:[],
      cardsCanBeUsed: {
        phy: [
          {name: "attack", attack: 5, cost: 1, description: "5 damages"},
          {name: "attack", attack: 5, cost: 1, description: "5 damages"},
          {name: "attack", attack: 5, cost: 1, description: "5 damages"},
          {name: "attack", attack: 5, cost: 1, description: "5 damages"},
          {name: "attack", attack: 5, cost: 1, description: "5 damages"},
          {name: "defence", defence: 5, cost: 1, description: "5 armor"},
          {name: "defence", defence: 5, cost: 1, description: "5 armor"},
          {name: "defence", defence: 5, cost: 1, description: "5 armor"},
          {name: "defence", defence: 5, cost: 1, description: "5 armor"},
          {name: "defence", defence: 5, cost: 1, description: "5 armor"},
          {name: "get two cards", getCards: 2, cost: 1, description: "get 2 cards"},
          {name: "healing", healing: 3, cost: 1, description: "get 3 health"},
        ],
        fire: [
          {name: "fire", fire: 3, cost: 1, description: "3 fire damages"},
          {name: "fire", fire: 3, cost: 1, description: "3 fire damages"},
          {name: "fire", fire: 3, cost: 1, description: "3 fire damages"}
        ],
        grass: [
          {name: "grass", grass: 3, cost: 1, description: "3 grass damages"},
          {name: "grass", grass: 3, cost: 1, description: "3 grass damages"},
          {name: "grass", grass: 3, cost: 1, description: "3 grass damages"}
        ],
        water: [
          {name: "water", water: 3, cost: 1, description: "3 water damages"},
          {name: "water", water: 3, cost: 1, description: "3 water damages"},
          {name: "water", water: 3, cost: 1, description: "3 water damages"}
        ]
      },
      allcards: {
        phy: [
          {name: "attack", attack: 5, cost: 1, description: "5 damages"},
          {name: "defence", defence: 5, cost: 1, description: "5 armor"},
          {name: "get two cards", getCards: 2, cost: 1, description: "get 2 cards"},
          {name: "healing", healing: 3, cost: 1, description: "get 3 health"},
        ],
        fire: [{name: "fire", fire: 3, cost: 1, description: "3 fire damages"}],
        grass: [{name: "grass", grass: 3, cost: 1, description: "3 grass damages"}],
        water: [{name: "water", water: 3, cost: 1, description: "3 water damages"}]
      },
      pokemon: {},
      allPokemon: [],
      money: 0,
      cardsAfterWin: [],
      wakeup: false,
      color: ['blue']
    });
    window.alert("Try next time!")
  }

  addBall() {
    var money = this.state.money;
    if (money >= 5) {
      var newArr = this.state.cards;
      var arrCan = this.state.cardsCanBeUsed;
      newArr.push({name: "Pokemon Ball", ball: true, cost: 3, description: 'Help catch a pokemon'});
      arrCan.phy.push({name: "Pokemon Ball", ball: true, cost: 3, description: 'Help catch a pokemon'})
      this.setState({
        cards: newArr,
        money: this.state.money - 5,
        cardsCanBeUsed: arrCan
      })
    }
  }

  addPack() {
      var money = this.state.money;
      if (money >= 10) {
        var newArr = this.state.cards;
        var arrCan = this.state.cardsCanBeUsed;
        newArr.push({name: "Pokemon Healthpack", healing: 10, cost: 3,description: 'Add 10 HP'});
        arrCan.phy.push({name: "Pokemon Healthpack", healing: 10, cost: 3,description: 'Add 10 HP'});
        this.setState({
          cards: newArr,
          money: this.state.money - 10,
          cardsCanBeUsed: arrCan
        });
      }
    }

  addCard(index) {
    console.log("add cards");
    var arrCards = this.state.cards;
    var arrCardsCanBeused = this.state.cardsCanBeUsed;
    var arrAfterWin = this.state.cardsAfterWin;
    var card = arrAfterWin.splice(index, 1);
    arrCards.push(card[0]);
    arrCardsCanBeused.phy.push(card[0]);
    this.setState({
      cards: arrCards,
      cardsAfterWin: arrAfterWin,
      cardsCanBeUsed: arrCardsCanBeused
    });
  }

  chooseA() {
    var attributeMyPokemon = "fire";
    var obj = this.state.pokemon;
    obj = {
      level: {
        num: 1,
        maxExp: 100,
        currentExp: 0
      },
      health: {
        maxHealth: 20,
        currentHealth: 20,
      },
      attack: {
        phy: 0,
        mag: 0
      },
      defence: 0,
      attribute: attributeMyPokemon
    }
    console.log(obj);
    var arrAllPokemon = this.state.allPokemon;
    arrAllPokemon.push(obj);
    var cards = this.state.cards;
    for (var i = 0; i < 5; i++) {
      cards.push({name: "attack", attack: 5, cost: 1, description: "5 damages"});
    }
    for (var i = 0; i < 5; i++) {
      cards.push({name: "defence", defence: 5, cost: 1, description: "5 armor"});
    }
    if (attributeMyPokemon === "fire") {
      for (var i = 0; i < 3; i++) {
        cards.push({name: "fire", fire: 3, cost: 1, description: "3 fire damages"});
      }
    } else if (attributeMyPokemon === "water") {
      for (var i = 0; i < 3; i++) {
        cards.push({name: "water", water: 3, cost: 1, description: "3 water damages"});
      }
    } else if (attributeMyPokemon === "grass") {
      for (var i = 0; i < 3; i++) {
        cards.push({name: "grass", grass: 3, cost: 1, description: "3 grass damages"});
      }
    }
    for (var i = 0; i < 1; i++) {
      cards.push({name: "get two cards", getCards: 2, cost: 1, description: "get 2 cards"});
    }
    for (var i = 0; i < 1; i++) {
      cards.push({name: "healing", healing: 3, cost: 1, description: "get 3 health"});
    }
    this.setState({
      pokemon: obj,
      allPokemon: arrAllPokemon,
      cards: cards,
      showModal5: false
    });
  }
  chooseB() {
    var attributeMyPokemon = "water";
    var obj = this.state.pokemon;
    obj = {
      level: {
        num: 1,
        maxExp: 100,
        currentExp: 0
      },
      health: {
        maxHealth: 20,
        currentHealth: 20,
      },
      attack: {
        phy: 0,
        mag: 0
      },
      defence: 0,
      attribute: attributeMyPokemon
    }
    console.log(obj);
    var arrAllPokemon = this.state.allPokemon;
    arrAllPokemon.push(obj);
    var cards = this.state.cards;
    for (var i = 0; i < 5; i++) {
      cards.push({name: "attack", attack: 5, cost: 1, description: "5 damages"});
    }
    for (var i = 0; i < 5; i++) {
      cards.push({name: "defence", defence: 5, cost: 1, description: "5 armor"});
    }
    if (attributeMyPokemon === "fire") {
      for (var i = 0; i < 3; i++) {
        cards.push({name: "fire", fire: 3, cost: 1, description: "3 fire damages"});
      }
    } else if (attributeMyPokemon === "water") {
      for (var i = 0; i < 3; i++) {
        cards.push({name: "water", water: 3, cost: 1, description: "3 water damages"});
      }
    } else if (attributeMyPokemon === "grass") {
      for (var i = 0; i < 3; i++) {
        cards.push({name: "grass", grass: 3, cost: 1, description: "3 grass damages"});
      }
    }
    for (var i = 0; i < 1; i++) {
      cards.push({name: "get two cards", getCards: 2, cost: 1, description: "get 2 cards"});
    }
    for (var i = 0; i < 1; i++) {
      cards.push({name: "healing", healing: 3, cost: 1, description: "get 3 health"});
    }
    this.setState({
      pokemon: obj,
      allPokemon: arrAllPokemon,
      cards: cards,
      showModal5: false
    });
  }
  chooseC() {
    var attributeMyPokemon = "grass";
    var obj = this.state.pokemon;
    obj = {
      level: {
        num: 1,
        maxExp: 100,
        currentExp: 0
      },
      health: {
        maxHealth: 20,
        currentHealth: 20,
      },
      attack: {
        phy: 0,
        mag: 0
      },
      defence: 0,
      attribute: attributeMyPokemon
    }
    console.log(obj);
    var arrAllPokemon = this.state.allPokemon;
    arrAllPokemon.push(obj);
    var cards = this.state.cards;
    for (var i = 0; i < 5; i++) {
      cards.push({name: "attack", attack: 5, cost: 1, description: "5 damages"});
    }
    for (var i = 0; i < 5; i++) {
      cards.push({name: "defence", defence: 5, cost: 1, description: "5 armor"});
    }
    if (attributeMyPokemon === "fire") {
      for (var i = 0; i < 3; i++) {
        cards.push({name: "fire", fire: 3, cost: 1, description: "3 fire damages"});
      }
    } else if (attributeMyPokemon === "water") {
      for (var i = 0; i < 3; i++) {
        cards.push({name: "water", water: 3, cost: 1, description: "3 water damages"});
      }
    } else if (attributeMyPokemon === "grass") {
      for (var i = 0; i < 3; i++) {
        cards.push({name: "grass", grass: 3, cost: 1, description: "3 grass damages"});
      }
    }
    for (var i = 0; i < 1; i++) {
      cards.push({name: "get two cards", getCards: 2, cost: 1, description: "get 2 cards"});
    }
    for (var i = 0; i < 1; i++) {
      cards.push({name: "healing", healing: 3, cost: 1, description: "get 3 health"});
    }
    this.setState({
      pokemon: obj,
      allPokemon: arrAllPokemon,
      cards: cards,
      showModal5: false
    });
  }

  changePokemon(index) {
    if (this.state.status !== "free") return;
    var arr = this.state.cards;
    var cardsCanBeUsed = this.state.cardsCanBeUsed;
    arr = [];
    for (var i = 0; i < cardsCanBeUsed.phy.length; i++) {
      arr.push(cardsCanBeUsed.phy[i])
    }
    var attribute = this.state.allPokemon[index].attribute;
    console.log(this.state.allPokemon,attribute);
    for (var i = 0; i < cardsCanBeUsed[attribute].length; i++) {
      arr.push(cardsCanBeUsed[attribute][i]);
    }
    var arrColor = this.state.color;
    for (var i = 0; i < arrColor.length; i++) {
      arrColor[i] = "white"
    }
    arrColor[index] = "blue";
    this.setState({
      pokemon: this.state.allPokemon[index],
      cards: arr,
      color: arrColor
    });
  }

  choice2A1() {
    this.setState({money: this.state.money += 10});
    console.log(this.state.money);
  }

  choice3A1() {
    this.setState({money: this.state.money += 15});
    console.log(this.state.money)
  }

  choice4A1() {
    this.setState({money: this.state.money -= 5});
    console.log(this.state.money)
  }

  choice4B1() {
    this.setState({money: this.state.money -= 8});
    console.log(this.state.money)
  }

  choice6A1() {
    this.setState({money: 0});
    console.log(this.state.money)
  }

  render() {
    if (!this.state.start) {
      return <div>
          <div className="start-and-end">
            <button className="start-game" onClick={() => this.startGame()}>Start</button>
            <button className="end-game" onClick={() => this.endGame()}>End</button>
          </div>
            <div className="Before-Start">Please start game.</div>
          </div>

    } else {
      var random1 = this.getRandomInt(this.state.cards.length);
      var random2 = this.getRandomInt(this.state.cards.length);
      var random3 = this.getRandomInt(this.state.cards.length);
      return <div>
        <Sound
       url='http://www.170mv.com/kw/other.web.rc01.sycdn.kuwo.cn/resource/n1/15/99/1879608878.mp3'
       playStatus={Sound.status.PLAYING}
     />
      <div className="start-and-end">
          <button className="start-game" onClick={() => this.startGame()}>Start</button>
          <button className="end-game" onClick={() => this.endGame()}>End</button>
          </div>
          <div className='info'>
            <h2>Status</h2>
            <div className="money"><img height="40px" width="40px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNFEfQpOgik7rqwk-vSAi_0JRuMCdkF6o4E8HXpAwa8iNEPQNfYQ"/> {this.state.money}</div>
            <img onClick={() => this.openModal()} height="40px" width="40px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxiU3srf5eo0zh5MTzLpI9_j93foOwgaiufXVj70_6feNN_ckW6g" />
            <h6>Click to Switch Pokemon</h6>
            <h6>You can only swtich</h6>
            <h6>when not in the battle</h6>
            <div>{this.state.allPokemon.map((pokemon, i) => {
              if (pokemon.attribute === "water") {
                return <div style={{backgroundColor: this.state.color[i]}}><img onClick={() => this.changePokemon(i)} height="40px" width="40px" src="https://pic.chinaz.com/2016/0802/6360573314774644572287630.jpeg"/> HP: {pokemon.health.currentHealth}</div>
              } else if (pokemon.attribute === "fire") {
                return <div style={{backgroundColor: this.state.color[i]}}><img onClick={() => this.changePokemon(i)} height="40px" width="40px" src="https://upload-images.jianshu.io/upload_images/6153592-bb6710852912c64f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/700"/> HP: {pokemon.health.currentHealth}</div>
              } else if (pokemon.attribute === "grass") {
                return <div style={{backgroundColor: this.state.color[i]}}><img onClick={() => this.changePokemon(i)} height="40px" width="40px" src="https://i.ytimg.com/vi/NN9LaU2NlLM/maxresdefault.jpg"/> HP: {pokemon.health.currentHealth}</div>
              }
          })}</div>
         </div>
            {this.state.status !== "fight" ?
          <App worldMap={this.state.worldMap}
              start={this.state.start}
              position={this.state.position}
              move={(i ,j) => this.move(i, j)}/>
              :
          <Fight worldMap={this.state.worldMap}
            position={this.state.position}
            win={() => this.win()}
            lose={() => this.lose()}
            pokemon={this.state.pokemon}
            cards={this.state.cards}
            allPokemon = {this.state.allPokemon}
          color={this.state.color}/>
          }
          {
            this.state.wakeup === false ?
            <div>
              <ReactModal
                className='firstChoice'
                isOpen={this.state.showModal5}
                contentLabel='Last Night'>
                  <img id='firstpic' height='175px' width='250px' src='https://seda.college/wp-content/uploads/party.jpg' />
                  <div></div>
                <div className='firstText'>
                  Last night before starting your Pokemon journey, what should you do?
                </div>
                <button className='choiceA' onClick={() => this.chooseA()}>Sleep early</button>
                <button className='choiceB' onClick={() => this.chooseB()}>Watch Pokemon-related TV shows</button>
                <button className='choiceD' onClick={() => this.chooseC()}>Read Pokemon-related books</button>
              </ReactModal>
            </div>
            : ''
          }
          {
            this.state.status === 'merchant' ?
            <Merchant
              cards={this.state.cards}
              money={this.state.money}
              addBall={this.addBall.bind(this)}
              addPack={this.addPack.bind(this)}
              closeModal={this.closeModal2.bind(this)}
            />
            : ''
          }
          {
            this.state.status === 'random' ?
            <Event

              allPokemon = {this.state.allPokemon}
              pokemon={this.state.pokemon}
              cards={this.state.cards}
              cardsCanBeUsed={this.state.cardsCanBeUsed}
              money={this.state.money}
              addBall={this.addBall.bind(this)}
              addPack={this.addPack.bind(this)}
              closeModal={this.closeModal2.bind(this)}
              endGame={() => this.endGame2()}
              choice2A1={() => this.choice2A1()}
              choice3A1={() => this.choice3A1()}
              choice4A1={() => this.choice4A1()}
              choice4B1={() => this.choice4B1()}
              choice6A1={() => this.choice6A1()}
            />
            : ''
          }

          <ReactModal
            className='bag'
             isOpen={this.state.showModal}
             contentLabel="All cards">
             <h3>Cards</h3>
             <ul>
               {
                 this.state.cards.map((cards, i) => {
                   return <Card card={this.state.cards[i]}/>
                 })
              }
             </ul>
            <button className="Bag-Btn" onClick={() => this.handleCloseModal()}>Back</button>
          </ReactModal>
          <ReactModal
             className='congrats'
             isOpen={this.state.showModal4}
             contentLabel="Congratulations">
             <div className='text'>
             <h3>Congratulations! You won!</h3>
             <p>Money You Get: {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.money}</p>
             <p>Cards You Get (Click to Get)</p>
               <div className='cards'>{this.state.cardsAfterWin.map((cardAfterWin, i) => {
                 return <div className="info1" onClick={() => this.addCard(i)}>{cardAfterWin.name}: {cardAfterWin.description}</div>
               })}</div>
             </div>
            <button className="choiceA" onClick={() => this.closeModal4()}>Back</button>
          </ReactModal>
        </div>

    }
  }
}

export default Game;
