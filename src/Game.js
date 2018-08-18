import React, { Component } from 'react';
import ReactModal from 'react-modal';

import WorldMap from './WorldMap.js';
import Fight from './Fight.js'
import Cards from './Card.js';
import Sound from 'react-sound';
import Merchant from './Merchant.js';
import Event from './Event.js';

import {Button, Icon, Container, Label, Dropdown, Progress, Card } from 'semantic-ui-react';
import './css/Game.css';

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

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function emptyArray(oldArr) {
  let arr = oldArr;
  while (arr.length !== 0) {
    arr.pop();
  }
  return arr;
}

const startStatus = {
  level: 0,
  start: false,
  row: 10,
  col: 20,
  worldMap: generateEmptyMap(10, 20),
  position: [],
  status: "free",
  showModal: false,
  showModal2: true,
  showModal3: true,
  showModal4: false,
  showModal5: true,
  showSave: false,
  showLoad: false,
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
    ],
    electric: [
      {name: "electric", electric: 3, cost: 1, description: "3 electric damages"},
      {name: "electric", electric: 3, cost: 1, description: "3 electric damages"},
      {name: "electric", electric: 3, cost: 1, description: "3 electric damages"}
    ],
    bug: [
      {name: "bug", bug: 3, cost: 1, description: "3 bug damages"},
      {name: "bug", bug: 3, cost: 1, description: "3 bug damages"},
      {name: "bug", bug: 3, cost: 1, description: "3 bug damages"}
    ],
    dark: [
      {name: "dark", dark: 3, cost: 1, description: "3 dark damages"},
      {name: "dark", dark: 3, cost: 1, description: "3 dark damages"},
      {name: "dark", dark: 3, cost: 1, description: "3 dark damages"}
    ],
    dragon: [
      {name: "dragon", dragon: 3, cost: 1, description: "3 dragon damages"},
      {name: "dragon", dragon: 3, cost: 1, description: "3 dragon damages"},
      {name: "dragon", dragon: 3, cost: 1, description: "3 dragon damages"}
    ],
    fairy: [
      {name: "fairy", fairy: 3, cost: 1, description: "3 fairy damages"},
      {name: "fairy", fairy: 3, cost: 1, description: "3 fairy damages"},
      {name: "fairy", fairy: 3, cost: 1, description: "3 fairy damages"}
    ],
    fighting: [
      {name: "fighting", fighting: 3, cost: 1, description: "3 fighting damages"},
      {name: "fighting", fighting: 3, cost: 1, description: "3 fighting damages"},
      {name: "fighting", fighting: 3, cost: 1, description: "3 fighting damages"}
    ],
    flying: [
      {name: "flying", flying: 3, cost: 1, description: "3 flying damages"},
      {name: "flying", flying: 3, cost: 1, description: "3 flying damages"},
      {name: "flying", flying: 3, cost: 1, description: "3 flying damages"}
    ],
    ghost: [
      {name: "ghost", ghost: 3, cost: 1, description: "3 ghost damages"},
      {name: "ghost", ghost: 3, cost: 1, description: "3 ghost damages"},
      {name: "ghost", ghost: 3, cost: 1, description: "3 ghost damages"}
    ],
    ground: [
      {name: "ground", ground: 3, cost: 1, description: "3 ground damages"},
      {name: "ground", ground: 3, cost: 1, description: "3 ground damages"},
      {name: "ground", ground: 3, cost: 1, description: "3 ground damages"}
    ],
    ice: [
      {name: "ice", ice: 3, cost: 1, description: "3 ice damages"},
      {name: "ice", ice: 3, cost: 1, description: "3 ice damages"},
      {name: "ice", ice: 3, cost: 1, description: "3 ice damages"}
    ],
    normal: [
      {name: "normal", normal: 3, cost: 1, description: "3 normal damages"},
      {name: "normal", normal: 3, cost: 1, description: "3 normal damages"},
      {name: "normal", normal: 3, cost: 1, description: "3 normal damages"}
    ],
    poison: [
      {name: "poison", poison: 3, cost: 1, description: "3 poison damages"},
      {name: "poison", poison: 3, cost: 1, description: "3 poison damages"},
      {name: "poison", poison: 3, cost: 1, description: "3 poison damages"}
    ],
    psychic: [
      {name: "psychic", psychic: 3, cost: 1, description: "3 psychic damages"},
      {name: "psychic", psychic: 3, cost: 1, description: "3 psychic damages"},
      {name: "psychic", psychic: 3, cost: 1, description: "3 psychic damages"}
    ],
    rock: [
      {name: "rock", rock: 3, cost: 1, description: "3 rock damages"},
      {name: "rock", rock: 3, cost: 1, description: "3 rock damages"},
      {name: "rock", rock: 3, cost: 1, description: "3 rock damages"}
    ],
    steel: [
      {name: "steel", steel: 3, cost: 1, description: "3 steel damages"},
      {name: "steel", steel: 3, cost: 1, description: "3 steel damages"},
      {name: "steel", steel: 3, cost: 1, description: "3 steel damages"}
    ],
    other: []
  },
  allCards: {
    phy: [
      {name: "attack", attack: 5, cost: 1, description: "5 damages"},
      {name: "defence", defence: 5, cost: 1, description: "5 armor"},
      {name: "get two cards", getCards: 2, cost: 1, description: "get 2 cards"},
      {name: "healing", healing: 3, cost: 1, description: "get 3 health"},
    ],
    fire: [
      {name: "fire", fire: 3, cost: 1, description: "3 fire damages"}
    ],
    grass: [
      {name: "grass", grass: 3, cost: 1, description: "3 grass damages"}
    ],
    water: [
      {name: "water", water: 3, cost: 1, description: "3 water damages"}
    ],
    electric: [
      {name: "electric", electric: 3, cost: 1, description: "3 electric damages"},
    ],
    bug: [
      {name: "bug", bug: 3, cost: 1, description: "3 bug damages"},
    ],
    dark: [
      {name: "dark", dark: 3, cost: 1, description: "3 dark damages"},
    ],
    dragon: [
      {name: "dragon", dragon: 3, cost: 1, description: "3 dragon damages"},
    ],
    fairy: [
      {name: "fairy", fairy: 3, cost: 1, description: "3 fairy damages"},
    ],
    fighting: [
      {name: "fighting", fighting: 3, cost: 1, description: "3 fighting damages"},
    ],
    flying: [
      {name: "flying", flying: 3, cost: 1, description: "3 flying damages"},
    ],
    ghost: [
      {name: "ghost", ghost: 3, cost: 1, description: "3 ghost damages"},
    ],
    ground: [
      {name: "ground", ground: 3, cost: 1, description: "3 ground damages"},
    ],
    ice: [
      {name: "ice", ice: 3, cost: 1, description: "3 ice damages"},
    ],
    normal: [
      {name: "normal", normal: 3, cost: 1, description: "3 normal damages"},
    ],
    poison: [
      {name: "poison", poison: 3, cost: 1, description: "3 poison damages"},
    ],
    psychic: [
      {name: "psychic", psychic: 3, cost: 1, description: "3 psychic damages"},
    ],
    rock: [
      {name: "rock", rock: 3, cost: 1, description: "3 rock damages"},
    ],
    steel: [
      {name: "steel", steel: 3, cost: 1, description: "3 steel damages"},
    ],
    other: [
      {name: "Pokemon Ball", ball: true, cost: 3, description: 'Help catch a pokemon'},
      {name: "Pokemon Healthpack", healing: 10, cost: 3, sdescription: 'Add 10 HP'}
    ]
  },
  cardsAfterWin: [],
  pokemon: {},
  allPokemon: [],
  money: 0,
  wakeup: false,
  color: ['blue'],
  savingStatus: false,
  savingSpots: 1,
  currentPage: "",
  loads: []
}


class Game extends Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, {}, startStatus)
  }

  async save() {
    console.log(this.state);
    if (this.state.showSave) {
      this.setState({savingStatus: true})
    } else {
      await this.setState({savingSpots: 1, savingStatus: true});
    }
    fetch('http://localhost:1337/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authentication': 'bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify(Object.assign({}, this.state, {saveTime: new Date()}))
    })
    .then((res) => res.json())
    .then(resp => {

      if (resp.status === "success") {
        this.setState({savingStatus: false});
        console.log(this.state);
      } else {
        console.log(resp.error);
        window.alert("Error!");
      }
    })
    .catch((err) => {
      // network error
      console.log('error', err)
    })
  }

  continue() {
    const token = localStorage.getItem('token');
    fetch('http://localhost:1337/continue', {
      method: 'GET',
      headers: {
        'Authentication' : 'bearer ' + token,
        'Content-Type': 'application/json'
      }
    })
    .then((res) => res.json())
    .then((resp) => {
      if (resp.info) {
        console.log(resp.info);
        this.setState(Object.assign(this.state, resp.info, {
          fightInfo: {
            cardsLeft: resp.info.cardsLeft,
            cardsInHand: resp.info.cardsInHand,
            cardsUsed: resp.info.cardsUsed,
            costHave: resp.info.costHave,
            costMax: resp.info.costMax,
            status: resp.info.status
          }
        }))
        // this.goGame()
      }
    })
    .catch((err) => {
      // network error
      console.log('error', err)
    })
  }

  showSave() {
    this.setState({showSave: true})
  }

  openModal() {
    this.setState({
      showModal: true
    });
  }

  handleCloseModal() {
    this.setState({
      showModal: false
    })
  }

  closeModal2() {
    let worldMap = this.state.worldMap;
    let position = this.state.position;
    worldMap[position[0]][position[1]].attribute.name = "";
    this.setState({
      showModal2: false,
      status: 'free',
      worldMap: worldMap
    });
  }

  closeModal3() {
    this.setState({
      showModal3: false,
      status: 'free'
    });
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
    });
  }

  closeSave() {
    this.setState({
      showSave: false
    })
  }

  getFirstPokemon(attribute) {
    let name = window.prompt("Pick a name for your pokemon");
    let obj = {
      name: name,
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
      attribute: attribute
    }
    return obj;
  }

  getFirstCards(attribute) {
    let cards = this.state.cards;
    for (let i = 0; i < 5; i++) {
      cards.push({name: "attack", attack: 5, cost: 1, description: "5 damages"});
    }
    for (let i = 0; i < 5; i++) {
      cards.push({name: "defence", defence: 5, cost: 1, description: "5 armor"});
    }
    for (let i = 0; i < 3; i++) {
      cards.push({name: attribute, [attribute]: 3, cost: 1, description: `3 ${attribute} damages`});
    }
    for (let i = 0; i < 1; i++) {
      cards.push({name: "get two cards", getCards: 2, cost: 1, description: "get 2 cards"});
    }
    for (let i = 0; i < 1; i++) {
      cards.push({name: "healing", healing: 3, cost: 1, description: "get 3 health"});
    }
    this.setState({cards: cards});
  }

  async startGame() {
    if (this.state.start) return;
    let worldMap = this.state.worldMap;
    let level = this.state.level;
    level++;
    let rowOfMap = this.state.row;
    let colOfMap = this.state.col;
    for (let i = 0; i < rowOfMap; i++) {
      for (let j = 0; j < colOfMap; j++) {
        worldMap[i][j].attribute = {name: ""};
        worldMap[i][j].discovered = false;
      }
    }
    let startRow = getRandomInt(rowOfMap);
    let startCol = getRandomInt(colOfMap);
    let endRow;
    let endCol;
    worldMap[startRow][startCol].attribute.name = "start";
    while (true) {
      endRow = getRandomInt(rowOfMap);
      endCol = getRandomInt(colOfMap);
      if (Math.abs(endRow - startRow) + Math.abs(endCol - startCol) > 12) {
        worldMap[endRow][endCol].attribute.name = "end";
        break;
      }
    }
    let check = true;
    while (check) {
      for (let i = 0; i < rowOfMap; i++) {
        for (let j = 0; j < colOfMap; j++) {
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
      let rock = 0;
      while (rock < 80) {
        let rockRow = getRandomInt(rowOfMap);
        let rockCol = getRandomInt(colOfMap);
        if (worldMap[rockRow][rockCol].attribute.name !== "start") {
          if (worldMap[rockRow][rockCol].attribute.name !== "end") {
            worldMap[rockRow][rockCol].attribute.name = "rock";
            rock ++;
          }
        }
      }
      let maze = new Array(rowOfMap);
      for (let m = 0; m < rowOfMap; m++) {
        maze[m] = new Array(colOfMap);
        for (let n = 0; n < colOfMap; n++) {
          maze[m][n] = {};
        }
      }
      for (let k = 0; k < rowOfMap; k++) {
        for (let l = 0; l < colOfMap; l++) {
          maze[k][l].attribute = worldMap[k][l].attribute.name;
        }
      }

      let searchList = [[startRow, startCol]];
      while (searchList.length > 0) {
        let lastStep = searchList.pop();
        maze[lastStep[0]][lastStep[1]].attribute = "rock"
        if (lastStep[0] === endRow && lastStep[1] === endCol) {
          check = false;
          break;
        }
        else {
          if (lastStep[0]+1 < rowOfMap && maze[lastStep[0]+1][lastStep[1]].attribute !== "rock") {
            searchList.push([lastStep[0]+1, lastStep[1]]);
          }
          if (lastStep[0]-1 >= 0 && maze[lastStep[0]-1][lastStep[1]].attribute !== "rock") {
            searchList.push([lastStep[0]-1, lastStep[1]]);
          }
          if (lastStep[1]+1 < colOfMap && maze[lastStep[0]][lastStep[1]+1].attribute !== "rock") {
            searchList.push([lastStep[0], lastStep[1]+1]);
          }
          if (lastStep[1]-1 >= 0 && maze[lastStep[0]][lastStep[1]-1].attribute !== "rock") {
            searchList.push([lastStep[0], lastStep[1]-1]);
          }
        }
      }
    }

    let pokemon = 0;
    while(pokemon < getRandomInt(16) + 16) {
      let pokemonRow = getRandomInt(rowOfMap);
      let pokemonCol = getRandomInt(colOfMap);
      if (worldMap[pokemonRow][pokemonCol].attribute.name === "") {
        let health = getRandomInt(20*level) + 10;
        let random = getRandomInt(120);
        let attribute;
        if (random < 15) {
          attribute = "fire";
        } else if (random < 30) {
          attribute = "water";
        } else if (random < 45) {
          attribute = "grass";
        } else if (random < 55) {
          attribute = "electric";
        } else if (random < 58) {
          attribute = "dark";
        } else if (random < 61) {
          attribute = "dragon";
        } else if (random < 69){
          attribute = "bug"
        } else if (random < 72) {
          attribute = "fairy";
        } else if (random < 80) {
          attribute = "fighting";
        } else if (random < 85) {
          attribute = "flying";
        } else if (random < 88) {
          attribute = "ghost";
        } else if (random < 93) {
          attribute = "ground";
        } else if (random < 98){
          attribute = "ice"
        } else if (random < 103) {
          attribute = "normal";
        } else if (random < 106) {
          attribute = "poison";
        } else if (random < 111) {
          attribute = "phychic";
        } else if (random < 116) {
          attribute = "rock";
        } else {
          attribute = "steel";
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
          exp: getRandomInt(level*10) + 10,
          money: getRandomInt(level*10) + 10
        };
        pokemon ++;
      }
    }

    let merchant = 0;
    while (merchant < 5) {
      let merchantRow = getRandomInt(rowOfMap);
      let merchantCol = getRandomInt(colOfMap);
      if (worldMap[merchantRow][merchantCol].attribute.name === "") {
        worldMap[merchantRow][merchantCol].attribute = {
          name: "merchant",
        };
        merchant ++
      }
    }

    let event = 0;
    while (event < getRandomInt(3) + 1) {
      let randomRow = getRandomInt(rowOfMap);
      let randomCol = getRandomInt(colOfMap);
      if (worldMap[randomRow][randomCol].attribute.name === "") {
        worldMap[randomRow][randomCol].attribute = {
          name: "event",
        };
        event ++
      }
    }

    let arr = this.state.position;
    arr.push(startRow, startCol);
    await this.setState({
      level: level,
      worldMap: worldMap,
      start: true,
      position: arr,
    });
    console.log("end startgame",this.state)
  }

  async endGameDirectly() {
    await this.setState({
      position: emptyArray(this.state.position),
      cards: emptyArray(this.state.cards),
      color: emptyArray(this.state.color),
      allPokemon: emptyArray(this.state.allPokemon),
      start: false
    });
    this.save()
  }

  async lose() {
    this.setState({
      position: emptyArray(this.state.position),
      cards: emptyArray(this.state.cards),
      color: emptyArray(this.state.color),
      allPokemon: emptyArray(this.state.allPokemon)
    });
    await this.setState({start: false});
    this.save();
    window.alert("Try next time!")
  }

  async endGame() {
    if (!this.state.start) return;
    let result = window.confirm("Are you sure to end this round")
    if (result) {
      await this.setState({
        position: emptyArray(this.state.position),
        cards: emptyArray(this.state.cards),
        color: emptyArray(this.state.color),
        allPokemon: emptyArray(this.state.allPokemon),
        start: false
      });
      this.save()
    } else {
      return;
    }
  }



  async move(row, col) {
    if (!this.state.start) return;
    let rowOfMap = this.state.row;
    let colOfMap = this.state.col;
    if( Math.abs(this.state.position[0] - row) + Math.abs(this.state.position[1] - col) === 1) {
      let arr = this.state.position;
      arr.pop();
      arr.pop();
      arr.push(row, col);
      let obj = this.state.worldMap;
      for (let i = 0; i < rowOfMap; i++) {
        for (let j = 0; j < colOfMap; j++) {
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
        this.setState({status: "fight"});
      } else if (this.state.worldMap[row][col].attribute.name === "end") {
        // 曾经写过但是失败的code sad :(
        // await this.setState(Object.assign({}, this.state, {
        // worldMap: generateEmptyMap(10, 20),
        // position: [],
        // status: "free",
        // cardsAfterWin: [],
        // savingSpots: 1,
        // currentPage: "",
        // loads: []
        // }));
        // console.log('aljsfladsshenyu', this.state, this.state.worldMap);
        // await this.startGame()
        window.alert("Congratulations!")
        this.endGame()
      } else if (this.state.worldMap[row][col].attribute.name === "merchant") {
        this.setState({status: 'merchant'})
      } else if (this.state.worldMap[row][col].attribute.name === 'event') {
        this.setState({status: 'event'})
      } else {
        this.setState({status: 'free'})
      }
    } else return;
  }

  win() {
    let worldMap = this.state.worldMap;
    let position = this.state.position;
    worldMap[position[0]][position[1]].attribute.name = "";
    let money = this.state.money;
    money += this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.money;
    let arr = this.state.cardsAfterWin;
    while (arr.length !== 0) {
      arr.pop();
    }
    // let arrAllCards = [];
    // for (let key in this.state.allCards) {
    //   arrAllCards = arrAllCards.concat(this.state.allCards[key]);
    // }
    let random = getRandomInt(3) + 1;
    while (random > 0) {
      arr.push(this.state.cards[getRandomInt(this.state.cards.length)]);
      random --;
    }
    this.setState({
      worldMap: worldMap,
      status: "free",
      showModal4: true,
      money: money,
      cardsAfterWin: arr,
      fightInfo: {}
    });
  }

  addBall() {
    let money = this.state.money;
    if (money >= 5) {
      let newArr = this.state.cards;
      let arrCan = this.state.cardsCanBeUsed;
      let money = this.state.money;
      money -= 5;
      newArr.push({name: "Pokemon Ball", ball: true, cost: 3, description: 'Help catch a pokemon'});
      arrCan.phy.push({name: "Pokemon Ball", ball: true, cost: 3, description: 'Help catch a pokemon'})
      this.setState({
        cards: newArr,
        money: money,
        cardsCanBeUsed: arrCan
      })
    }
  }

  addPack() {
    let money = this.state.money;
    if (money >= 10) {
      let newArr = this.state.cards;
      let arrCan = this.state.cardsCanBeUsed;
      let money = this.state.money;
      money -= 10;
      newArr.push({name: "Pokemon Healthpack", healing: 10, cost: 3, description: 'Add 10 HP'});
      arrCan.phy.push({name: "Pokemon Healthpack", healing: 10, cost: 3, description: 'Add 10 HP'});
      this.setState({
        cards: newArr,
        money: money,
        cardsCanBeUsed: arrCan
      });
    }
  }

  addCard(index) {
    let arrCards = this.state.cards;
    let arrCardsCanBeused = this.state.cardsCanBeUsed;
    let arrAfterWin = this.state.cardsAfterWin;
    let card = arrAfterWin.splice(index, 1);
    arrCards.push(card[0]);
    if (card[0].name === "attack" || card[0].name === "defence" || card[0].name === "healing" || card[0].name === "get two cards") {
      arrCardsCanBeused.phy.push(card[0]);
    } else if (card[0].name === "Pokemon Ball" || card[0].name === "Pokemon Healthpack") {
      arrCardsCanBeused.other.push(card[0]);
    } else {
      let name = card[0].name;
      arrCardsCanBeused[name].push(card[0]);
    }
    this.setState({
      cards: arrCards,
      cardsAfterWin: arrAfterWin,
      cardsCanBeUsed: arrCardsCanBeused
    });
  }

  chooseFirstPokemon(attribute) {
    let obj = this.getFirstPokemon(attribute);
    let arrAllPokemon = this.state.allPokemon;
    arrAllPokemon.push(obj);
    this.getFirstCards(attribute);
    this.setState({
      pokemon: obj,
      allPokemon: arrAllPokemon,
      showModal5: false
    });
  }

  changePokemon(index) {
    if (this.state.status !== "free") return;
    let arr = this.state.cards;
    let cardsCanBeUsed = this.state.cardsCanBeUsed;
    arr = [];
    for (let i = 0; i < cardsCanBeUsed.phy.length; i++) {
      arr.push(cardsCanBeUsed.phy[i])
    }
    let attribute = this.state.allPokemon[index].attribute;
    for (let i = 0; i < cardsCanBeUsed[attribute].length; i++) {
      arr.push(cardsCanBeUsed[attribute][i]);
    }
    let arrColor = this.state.color;
    for (let i = 0; i < arrColor.length; i++) {
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
    let money = this.state.money;
    money += 10;
    this.setState({money: money});
  }

  choice3A1() {
    let money = this.state.money;
    money += 10;
    this.setState({money: money});
  }

  choice4A1() {
    let money = this.state.money;
    money += 10;
    this.setState({money: money});
  }

  choice4B1() {
    let money = this.state.money;
    money += 10;
    this.setState({money: money});
  }

  choice6A1() {
    this.setState({money: 0});
  }

  showLoad() {
    const token = localStorage.getItem('token');
    fetch('http://localhost:1337/showLoad', {
      method: 'GET',
      headers: {
        'Authentication' : 'bearer ' + token,
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(resp => {
      if (resp.info) {
        this.setState({loads: emptyArray(this.state.loads)});
        let newArr = this.state.loads.concat(resp.info)
        this.setState({loads: newArr, showLoad: true});
      } else if (resp.empty) {
        this.setState({load: [], showLoad: true})
      } else {
        window.alert(resp.error)
      }
    })
    .catch(err => console.log(err));
  }

  loadGame() {
      const token = localStorage.getItem('token');
      fetch('http://localhost:1337/loadGame', {
        method: 'POST',
        headers: {
          'Authentication' : 'bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({savingSpots: this.state.savingSpots})
      })
      .then((res) => res.json())
      .then(async (resp) => {
        if (resp.info) {
          console.log('kjalksdkfldsa', resp.info);
          await this.setState(Object.assign({}, {}, startStatus))
          this.setState(Object.assign(this.state, resp.info, {
            fightInfo: {
              cardsLeft: resp.info.cardsLeft,
              cardsInHand: resp.info.cardsInHand,
              cardsUsed: resp.info.cardsUsed,
              costHave: resp.info.costHave,
              costMax: resp.info.costMax,
              status: resp.info.status
            }
          }))
          console.log(startStatus, this.state);
          // this.goGame()
          this.setState({showLoad: false});
        }
      })
      .catch((err) => {
        // network error
        console.log('error', err)
      })
  }

  goHome() {
    let result = window.confirm("Are you sure to go back to home page? You will lose all the data unsaved.");
    console.log(startStatus);
    if (result) {
      this.setState(Object.assign({}, startStatus, {
        position: [],
        cards:[],
        cardsAfterWin: [],
        allPokemon: [],
        color: ['blue'],
        loads: []
      }));
    }
  }

  render() {
    console.log(startStatus);
    if (this.state.currentPage === "settings") {
      return (<div>
        <h1>This is the settings</h1>
        <Button content='Back' onClick={() => this.setState({currentPage: ""})} />
      </div>);
    } else if (this.state.currentPage === "about") {
      return (<div>
        <h1>This is the about</h1>
        <Button content='Back' onClick={() => this.setState({currentPage: ""})} />
      </div>);
    } else {

      let colors = ['red', 'orange', 'yellow', 'olive', 'green'];
      let options = [];
      this.state.allPokemon.forEach(pokemon => {
        if (pokemon.attribute === "fire") {
          options.push({
            label: {
              icon: "gripfire",
              content: pokemon.name
            },
            currentHealth: pokemon.health.currentHealth,
            maxHealth: pokemon.health.maxHealth
          })
        } else if (pokemon.attribute === "water") {
          options.push({
            label: {
              icon: "theme",
              content: pokemon.name
            },
            currentHealth: pokemon.health.currentHealth,
            maxHealth: pokemon.health.maxHealth
          })
        } else if (pokemon.attribute === "grass") {
          options.push({
            label: {
              icon: "leaf",
              content: pokemon.name
            },
            currentHealth: pokemon.health.currentHealth,
            maxHealth: pokemon.health.maxHealth
          })
        } else if (pokemon.attribute === "normal") {
          options.push({
            label: {
              icon: "circle",
              content: pokemon.name
            },
            currentHealth: pokemon.health.currentHealth,
            maxHealth: pokemon.health.maxHealth
          })
        } else if (pokemon.attribute === "fighting") {
          options.push({
            label: {
              icon: "hand rock",
              content: pokemon.name
            },
            currentHealth: pokemon.health.currentHealth,
            maxHealth: pokemon.health.maxHealth
          })
        } else if (pokemon.attribute === "flying") {
          options.push({
            label: {
              icon: "earlybirds",
              content: pokemon.name
            },
            currentHealth: pokemon.health.currentHealth,
            maxHealth: pokemon.health.maxHealth
          })
        } else if (pokemon.attribute === "poison") {
          options.push({
            label: {
              icon: "flask",
              content: pokemon.name
            },
            currentHealth: pokemon.health.currentHealth,
            maxHealth: pokemon.health.maxHealth
          })
        } else if (pokemon.attribute === "ground") {
          options.push({
            label: {
              icon: "blackberry",
              content: pokemon.name
            },
            currentHealth: pokemon.health.currentHealth,
            maxHealth: pokemon.health.maxHealth
          })
        } else if (pokemon.attribute === "rock") {
          options.push({
            label: {
              icon: "chart area",
              content: pokemon.name
            },
            currentHealth: pokemon.health.currentHealth,
            maxHealth: pokemon.health.maxHealth
          })
        } else if (pokemon.attribute === "bug") {
          options.push({
            label: {
              icon: "bug",
              content: pokemon.name
            },
            currentHealth: pokemon.health.currentHealth,
            maxHealth: pokemon.health.maxHealth
          })
        } else if (pokemon.attribute === "ghost") {
          options.push({
            label: {
              icon: 'snapchat ghost',
              content: pokemon.name
            },
            currentHealth: pokemon.health.currentHealth,
            maxHealth: pokemon.health.maxHealth
          })
        } else if (pokemon.attribute === "steel") {
          options.push({
            label: {
              icon: "settings",
              content: pokemon.name
            },
            currentHealth: pokemon.health.currentHealth,
            maxHealth: pokemon.health.maxHealth
          })
        }else if (pokemon.attribute === "electric") {
          options.push({
            label: {
              icon: "bolt",
              content: pokemon.name
            },
            currentHealth: pokemon.health.currentHealth,
            maxHealth: pokemon.health.maxHealth
          })
        } else if (pokemon.attribute === "psychic") {
          options.push({
            label: {
              icon: "podcast",
              content: pokemon.name
            },
            currentHealth: pokemon.health.currentHealth,
            maxHealth: pokemon.health.maxHealth
          })
        } else if (pokemon.attribute === "ice") {
          options.push({
            label: {
              icon: "snowflake",
              content: pokemon.name
            },
            currentHealth: pokemon.health.currentHealth,
            maxHealth: pokemon.health.maxHealth
          })
        } else if (pokemon.attribute === "dragon") {
          options.push({
            label: {
              icon: "chess knight",
              content: pokemon.name
            },
            currentHealth: pokemon.health.currentHealth,
            maxHealth: pokemon.health.maxHealth
          })
        } else if (pokemon.attribute === "dark") {
          options.push({
            label: {
              icon: "low vision",
              content: pokemon.name
            },
            currentHealth: pokemon.health.currentHealth,
            maxHealth: pokemon.health.maxHealth
          })
        } else {
          options.push({
            label: {
              icon: "balance scale",
              content: pokemon.name
            },
            currentHealth: pokemon.health.currentHealth,
            maxHealth: pokemon.health.maxHealth
          })
        }
      })
      const pokemonLoads = this.state.loads.map(obj => {
        const p = obj.pokemon;
        const t = new Date(obj.saveTime);
        const spot = obj.savingSpots
        return (
          <Card onClick={() => this.setState({savingSpots: spot})}>
            <Card.Content>
              <Card.Header><Icon name="circle" color={colors[obj.savingSpots - 1]}/> {p.name}</Card.Header>
              <Card.Meta>{`${t.getFullYear()}-${t.getMonth()}-${t.getDate()} ${t.getHours()}: ${(t.getMinutes() + 100).toString().substring(1)}`}</Card.Meta>
              <Card.Description>{"Level #" + p.level.num}</Card.Description>
            </Card.Content>
          </Card>
        );
      });
      if (!this.state.start) {
        return (<div className="home">
          <Container className="container">
          <div className="home-btn">
            <Button color="gray" style={{width: '150px'}} content='New Game' onClick={() => this.startGame()}/>
          </div>
          <div className="home-btn">
            <Button color="gray" style={{width: '150px'}} content='Continue' onClick={() => this.continue()}/>
          </div>
          <div className="home-btn">
            <Button color="gray" style={{width: '150px'}} content='Load Game' onClick={() => this.showLoad()}/>
          </div>
          <div className="home-btn">
            <Button color="gray" style={{width: '150px'}} content='Settings' onClick={() => this.setState({currentPage: "settings"})} />
          </div>
          <div className="home-btn">
            <Button color="gray" style={{width: '150px'}} content='About' onClick={() => this.setState({currentPage: "about"})}/>
          </div>
          <div className="home-btn">
            <Button color="gray" style={{width: '150px'}} content='Logout' onClick={() => this.props.logout()}/>
          </div>
        </Container>

        <ReactModal
          className=''
          isOpen={this.state.showLoad}
          contentLabel="Loading">
          <div>
          <div className='text'>
            <h3>Loading...</h3>
            <span>Choose the game you want to load</span>
            <br/>
            <Card.Group>{pokemonLoads}</Card.Group>
          </div>
          <button className="choiceA" onClick={() => this.loadGame()}>Load</button>
          <button className="choiceA" onClick={() => this.setState({showLoad: false})}>Back</button>
        </div>
        </ReactModal>
      </div>)
      } else {
        return <div className={this.state.pokemon.attribute}>
          <Sound
            url='http://www.170mv.com/kw/other.web.rc01.sycdn.kuwo.cn/resource/n1/15/99/1879608878.mp3'
            playStatus={Sound.status.PLAYING}
          />
          {this.state.status !== 'fight' ?
          <div className="start-and-end">
            <Button className="btn-top" animated='vertical' onClick={() => this.showLoad()}>
              <Button.Content hidden>Load</Button.Content>
              <Button.Content visible>
                <Icon name='download' />
              </Button.Content>
            </Button>
            {this.state.savingStatus ?
              <Button className="btn-top" loading>
                Loading
              </Button>
              :
              <Button className="btn-top" animated='vertical' onClick={() => this.save()}>
                <Button.Content hidden>Quick Save</Button.Content>
                <Button.Content visible>
                  <Icon name='save' />
                </Button.Content>
              </Button>
            }
            <Button className="btn-top" animated='vertical' onClick={() => this.showSave()}>
              <Button.Content hidden>Save</Button.Content>
              <Button.Content visible>
                <Icon name='save outline' />
              </Button.Content>
            </Button>
            <Button className="btn-top" animated='vertical' onClick={() => this.endGame()}>
              <Button.Content hidden>End</Button.Content>
              <Button.Content visible>
                <Icon name='close' />
              </Button.Content>
            </Button>
            <Button className="btn-top" animated='vertical' onClick={() => this.goHome()}>
              <Button.Content hidden>Home</Button.Content>
              <Button.Content visible>
                <Icon name='home'/>
              </Button.Content>
            </Button>
          </div>
          : <div></div>}
          <div className="info">
            <Label style={{height: "40px", width: "80px", display: "flex", alignItems: "center", justifyContent: 'center', fontSize: "18px"}} as='a' content={this.state.money} icon='dollar sign' />
            <Button style={{height: "40px", width: "60px"}} animated='vertical' onClick={() => this.openModal()}>
              <Button.Content hidden>Bag</Button.Content>
              <Button.Content visible>
                <Icon name='dolly' />
              </Button.Content>
            </Button>
            <Dropdown style={{height: "40px", width: "180px"}} className="icon" text='Pokemons' icon='filter' floating item labeled button>
              <Dropdown.Menu>
                <Dropdown.Item style={{margin: 'auto'}}>
                  {
                    options.map((pokemon, i) =>
                    <div onClick={() => this.changePokemon(i)}>
                      <Dropdown.Item {...pokemon} />
                      {
                        pokemon.currentHealth/pokemon.maxHealth < 0.2 ?
                        <Progress size="small" color='red' value={pokemon.currentHealth} total={pokemon.maxHealth} progress='ratio' /> :
                        pokemon.currentHealth/pokemon.maxHealth < 0.4 ?
                        <Progress size="small" color='orange' value={pokemon.currentHealth} total={pokemon.maxHealth} progress='ratio' /> :
                        pokemon.currentHealth/pokemon.maxHealth < 0.6 ?
                        <Progress size="small" color='yellow' value={pokemon.currentHealth} total={pokemon.maxHealth} progress='ratio' /> :
                        pokemon.currentHealth/pokemon.maxHealth < 0.8 ?
                        <Progress size="small" color='olive' value={pokemon.currentHealth} total={pokemon.maxHealth} progress='ratio' /> :
                        <Progress size="small" color='green' value={pokemon.currentHealth} total={pokemon.maxHealth} progress='ratio' />
                      }
                    </div>)
                  }
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          {this.state.status !== "fight" ?
          <WorldMap worldMap={this.state.worldMap}
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
              color={this.state.color}
              save={() => this.save()}
              endGame={() => this.endGame()}
              fightInfo={this.state.fightInfo}
              status={this.state.status}
              loadGame={() => this.loadGame()}
              goHome={() => this.goHome()}
            />
          }
          {
            this.state.wakeup === false ?
            <div>
              <ReactModal
                className='firstChoice'
                isOpen={this.state.showModal5}
                contentLabel='Last Night'>
                <img alt="" id='firstpic' height='175px' width='250px' src='https://seda.college/wp-content/uploads/party.jpg' />
                <div></div>
                <div className='firstText'>
                  Last night before starting your Pokemon journey, what should you do?
                </div>
                <button className='choiceA' onClick={() => this.chooseFirstPokemon("fire")}>Sleep early</button>
                <button className='choiceB' onClick={() => this.chooseFirstPokemon("water")}>Watch Pokemon-related TV shows</button>
                <button className='choiceD' onClick={() => this.chooseFirstPokemon("grass")}>Read Pokemon-related books</button>
              </ReactModal>
            </div>
            : ''
          }
          {
            this.state.status === 'merchant' ?
            <Merchant
              cards={this.state.cards}
              money={this.state.money}
              addBall={() => this.addBall()}
              addPack={() => this.addPack()}
              closeModal={() => this.closeModal2()}
            />
            : ''
          }
          {
            this.state.status === 'event' ?
            <Event
              this={this.state}
              allPokemon = {this.state.allPokemon}
              pokemon={this.state.pokemon}
              cards={this.state.cards}
              cardsCanBeUsed={this.state.cardsCanBeUsed}
              money={this.state.money}
              addBall={() => this.addBall()}
              addPack={() => this.addPack()}
              closeModal={() => this.closeModal2()}
              endGame={() => this.endGameDirectly()}
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
                  return <div className="card"><Cards card={this.state.cards[i]}/></div>
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
              <p>Cards You Get: (Click to Get)</p>
              <ul>
                {
                  this.state.cardsAfterWin.map((cardAfterWin, i) => {
                    return <div className="card" onClick={() => this.addCard(i)}><Cards card={cardAfterWin}/></div>
                  })
                }
              </ul>
            </div>
            <button className="choiceA" onClick={() => this.closeModal4()}>Back</button>
          </ReactModal>
          <ReactModal
            className=''
            isOpen={this.state.showSave}
            contentLabel="Saving">
            <div className='text'>
              <h3>Saving...</h3>
              <span>Save your game status in one of the spots below</span>
              <div>
              <Button inverted color='red' onClick={() => this.setState({savingSpots: 1})}>
                1
              </Button>
              <Button inverted color='orange' onClick={() => this.setState({savingSpots: 2})}>
                2
              </Button>
              <Button inverted color='yellow' onClick={() => this.setState({savingSpots: 3})}>
                3
              </Button>
              <Button inverted color='olive' onClick={() => this.setState({savingSpots: 4})}>
                4
              </Button>
              <Button inverted color='green' onClick={() => this.setState({savingSpots: 5})}>
                5
              </Button>
              </div>
            </div>
            <button className="choiceA" onClick={() => this.save()}>Save</button>
            <button className="choiceA" onClick={() => this.closeSave()}>Back</button>
          </ReactModal>

          <ReactModal
            className=''
            isOpen={this.state.showLoad}
            contentLabel="Loading">
            <div className='text'>
              <h3>Loading</h3>
              <span>Choose the game you want to load</span>
              <Card.Group>{pokemonLoads}</Card.Group>
            </div>
            <button className="choiceA" onClick={() => this.loadGame()}>Load</button>
            <button className="choiceA" onClick={() => this.setState({showLoad: false})}>Back</button>
          </ReactModal>
        </div>
      }
    }
  }
}

export default Game;
