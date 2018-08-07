import React, { Component } from 'react';
import ReactModal from 'react-modal';
import WorldMap from './WorldMap.js';
import Fight from './Fight.js'
import Card from './Card.js';
import Sound from 'react-sound';
import Merchant from './Merchant.js';
import Event from './Event.js';
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

let startStatus = {
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
    ]
  },
  cardsAfterWin: [],
  pokemon: {},
  allPokemon: [],
  money: 0,
  wakeup: false,
  color: ['blue']
}

class Game extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount () {
    console.log('Will Mount', this.props.info)
    if (this.props.info && this.props.info.start) {
      this.setState(this.props.info)
    } else {
      this.save(startStatus)
    }

  }

  async save(obj) {
    console.log("I'm saving start")
    
    this.setState(obj)
    console.log('Done setting the state.')
    await fetch('http://localhost:1337/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authentication': 'bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify(obj)
    })
    .then((res) => res.json())
    .catch((err) => {
      // network error
      console.log('error', err)
    })
    console.log('Done saving before return')
  }

  openModal() {
    this.save({showModal: true})
  }

  handleCloseModal() {
    this.save({showModal: false})
  }

  closeModal2() {
    let worldMap = this.state.worldMap;
    let position = this.state.position;
    worldMap[position[0]][position[1]].attribute.name = "";
    this.save({showModal2: false, status: 'free', worldMap: worldMap})
  }

  closeModal4() {
    this.save({showModal4: false})
  }

  getFirstPokemon(attribute) {
    let obj = {
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

    this.save({cards: cards});
  }

  startGame() {
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
        let random = getRandomInt(3);
        let attribute;
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

    this.save({level: level, worldMap: worldMap, start: true, position: arr});
  }

  endGameDirectly() {
    this.save({
      position: emptyArray(this.state.position),
      cards: emptyArray(this.state.cards),
      color: emptyArray(this.state.color),
      allPokemon: emptyArray(this.state.allPokemon)
    });
    this.save({startStatus});
  }

  lose() {
    this.save({
      position: emptyArray(this.state.position),
      cards: emptyArray(this.state.cards),
      color: emptyArray(this.state.color),
      allPokemon: emptyArray(this.state.allPokemon)
    });
    this.save({startStatus});
    window.alert("Try next time!")
  }

  endGame() {
    if (!this.state.start) return;
    let result = window.confirm("Are you sure to end this round")
    if (result) {
      this.save({
        position: emptyArray(this.state.position),
        cards: emptyArray(this.state.cards),
        color: emptyArray(this.state.color),
        allPokemon: emptyArray(this.state.allPokemon)
      });
      this.save({startStatus});
    } else {
      return;
    }
  }

  move(row, col) {
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

      this.save({position: arr, worldMap: obj});

      if (this.state.worldMap[row][col].attribute.name === "pokemon") {
        this.save({status: "fight"});
      } else if (this.state.worldMap[row][col].attribute.name === "end") {
        window.alert("Congratulations!")
        this.endGame();
      } else if (this.state.worldMap[row][col].attribute.name === "merchant") {
        this.save({status: 'merchant'})
      } else if (this.state.worldMap[row][col].attribute.name === 'event') {
        this.save({status: 'event'})
      } else {
        this.save({status: 'free'})
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
    let random = getRandomInt(3) + 1;
    while (random > 0) {
      arr.push(this.state.cards[getRandomInt(this.state.cards.length)]);
      random --;
    }
    this.save({
      worldMap: worldMap,
      status: "free",
      showModal4: true,
      money: money,
      cardsAfterWin: arr
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
      this.save({
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
      arrCan.phy.push({name: "Pokemon Healthpack", healing: 10, cost: 3, sdescription: 'Add 10 HP'});
      this.save({
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
    arrCardsCanBeused.phy.push(card[0]);
    this.save({
      cards: arrCards,
      cardsAfterWin: arrAfterWin,
      cardsCanBeUsed: arrCardsCanBeused
    })
  }

  chooseFirstPokemon(attribute) {
    let obj = this.getFirstPokemon(attribute);
    let arrAllPokemon = this.state.allPokemon;

    arrAllPokemon.push(obj);
    this.getFirstCards(attribute);

    // 1 save
    this.save({
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
    this.save({
      pokemon: this.state.allPokemon[index],
      cards: arr,
      color: arrColor
    });
  }

  choice2A1() {
    let money = this.state.money;
    money += 10;
    this.save({money: money})
  }

  choice3A1() {
    let money = this.state.money;
    money += 10;
    this.save({money: money})
  }

  choice4A1() {
    let money = this.state.money;
    money += 10;
    this.save({money: money})
  }

  choice4B1() {
    let money = this.state.money;
    money += 10;
    this.save({money: money})
  }

  choice6A1() {
    this.save({money: 0})
  }

  render() {
    console.log(this.state);
    if (!this.state.start) {
      return <div>
        <div className="start-and-end">
          <button className="start-game" onClick={() => this.startGame()}>Start</button>
          <button className="end-game" onClick={() => this.props.logout()}>Logout</button>
        </div>
        <div className="Before-Start">Please start game.</div>
      </div>
    } else {
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
          <div className="money"><img alt="" height="40px" width="40px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNFEfQpOgik7rqwk-vSAi_0JRuMCdkF6o4E8HXpAwa8iNEPQNfYQ"/> {this.state.money}</div>
          <img alt="" onClick={() => this.openModal()} height="40px" width="40px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxiU3srf5eo0zh5MTzLpI9_j93foOwgaiufXVj70_6feNN_ckW6g" />
          <h6>Click to Switch Pokemon</h6>
          <h6>You can only swtich</h6>
          <h6>when not in the battle</h6>
          <div>{this.state.allPokemon.map((pokemon, i) => {
            if (pokemon.attribute === "water") {
              return <div style={{backgroundColor: this.state.color[i]}}><img alt="" onClick={() => this.changePokemon(i)} height="40px" width="40px" src="https://pic.chinaz.com/2016/0802/6360573314774644572287630.jpeg"/> HP: {pokemon.health.currentHealth}</div>
            } else if (pokemon.attribute === "fire") {
              return <div style={{backgroundColor: this.state.color[i]}}><img alt="" onClick={() => this.changePokemon(i)} height="40px" width="40px" src="https://upload-images.jianshu.io/upload_images/6153592-bb6710852912c64f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/700"/> HP: {pokemon.health.currentHealth}</div>
            } else if (pokemon.attribute === "grass") {
              return <div style={{backgroundColor: this.state.color[i]}}><img alt="" onClick={() => this.changePokemon(i)} height="40px" width="40px" src="https://i.ytimg.com/vi/NN9LaU2NlLM/maxresdefault.jpg"/> HP: {pokemon.health.currentHealth}</div>
            } else {
              return;
            }
          })}</div>
        </div>
        {this.state.status !== "fight" ?
        <WorldMap worldMap={this.state.worldMap}
          start={this.state.start}
          position={this.state.position}
          move={(i ,j) => this.move(i, j)}/>
          :
          <Fight
            save={(obj) => this.save(obj)}
            worldMap={this.state.worldMap}
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
              addBall={this.addBall.bind(this)}
              addPack={this.addPack.bind(this)}
              closeModal={this.closeModal2.bind(this)}
            />
            : ''
          }
          {
            this.state.status === 'event' ?
            <Event
              allPokemon = {this.state.allPokemon}
              pokemon={this.state.pokemon}
              cards={this.state.cards}
              cardsCanBeUsed={this.state.cardsCanBeUsed}
              money={this.state.money}
              addBall={this.addBall.bind(this)}
              addPack={this.addPack.bind(this)}
              closeModal={this.closeModal2.bind(this)}
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
