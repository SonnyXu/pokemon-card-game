import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import CardsInHand from './CardsInHand.js';
import './css/Fight.css'

class Fight extends Component {
  constructor(props) {
    super(props);
    var cardsInHand = [];
    var cards = this.props.cards;
    var cardsLeft = [];
    for (var i = 0; i < cards.length; i++) {
      cardsLeft.push(cards[i]);
    }
    for (var i = 0; i < 4; i++) {
      var j = cardsLeft.splice(this.getRandomInt(cardsLeft.length), 1)
      cardsInHand.push(j[0])
    }
    this.state = {
      worldMap: this.props.worldMap,
      position: this.props.position,
      pokemon: this.props.pokemon,
      allPokemon: this.props.allPokemon,
      cards: cards,
      cardsHold: {},
      cardsLeft: cardsLeft,
      cardsInHand: cardsInHand,
      cardsUsed: [],
      costHave: 3,
      costMax: 3,
      drag: false,
      color: this.props.color
    }
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  nextRound() {
    console.log(this.state.allPokemon);
    var pokemon = this.state.pokemon;
    var cardsInHand = this.state.cardsInHand;
    var cardsLeft = this.state.cardsLeft;

    var worldMap = this.state.worldMap;
    var enemyInformation = worldMap[this.state.position[0]][this.state.position[1]].attribute;


    //Fight process
    if (enemyInformation.attack.phy > pokemon.defence) {
      pokemon.health.currentHealth -= enemyInformation.attack.phy - pokemon.defence;
    }
    if (enemyInformation.defence < pokemon.attack.phy) {
      enemyInformation.health.currentHealth -= pokemon.attack.phy - enemyInformation.defence;
    }
    var enemyAttr = enemyInformation.attribute;
    var myAttr = pokemon.attribute;
    if (enemyAttr === "fire" && myAttr === "water") {
      if (enemyInformation.attack.mag > 2*pokemon.attack.mag) {
        pokemon.health.currentHealth -= enemyInformation.attack.mag - 2*pokemon.attack.mag;
      } else {
        enemyInformation.health.currentHealth -= 2*pokemon.attack.mag - enemyInformation.attack.mag
      }
    } else if (enemyAttr === "water" && myAttr === "fire") {
      if (2*enemyInformation.attack.mag > pokemon.attack.mag) {
        pokemon.health.currentHealth -= 2*enemyInformation.attack.mag - pokemon.attack.mag;
      } else {
        enemyInformation.health.currentHealth -= pokemon.attack.mag - 2*enemyInformation.attack.mag
      }
    } else if (enemyAttr === "water" && myAttr === "grass") {
      if (enemyInformation.attack.mag > 2*pokemon.attack.mag) {
        pokemon.health.currentHealth -= enemyInformation.attack.mag - 2*pokemon.attack.mag;
      } else {
        enemyInformation.health.currentHealth -= 2*pokemon.attack.mag - enemyInformation.attack.mag
      }
    } else if (enemyAttr === "grass" && myAttr === "water") {
      if (2*enemyInformation.attack.mag > pokemon.attack.mag) {
        pokemon.health.currentHealth -= 2*enemyInformation.attack.mag - pokemon.attack.mag;
      } else {
        enemyInformation.health.currentHealth -= pokemon.attack.mag - 2*enemyInformation.attack.mag
      }
    } else if (enemyAttr === "grass" && myAttr === "fire") {
      if (enemyInformation.attack.mag > 2*pokemon.attack.mag) {
        pokemon.health.currentHealth -= enemyInformation.attack.mag - 2*pokemon.attack.mag;
      } else {
        enemyInformation.health.currentHealth -= 2*pokemon.attack.mag - enemyInformation.attack.mag
      }
    } else if (enemyAttr === "fire" && myAttr === "grass") {
      if (2*enemyInformation.attack.mag > pokemon.attack.mag) {
        pokemon.health.currentHealth -= 2*enemyInformation.attack.mag - pokemon.attack.mag;
      } else {
        enemyInformation.health.currentHealth -= pokemon.attack.mag - 2*enemyInformation.attack.mag
      }
    } else {
      if (enemyInformation.attack.mag > pokemon.attack.mag) {
        pokemon.health.currentHealth -= enemyInformation.attack.mag - pokemon.attack.mag;
      } else {
        enemyInformation.health.currentHealth -= pokemon.attack.mag - enemyInformation.attack.mag
      }
    }
    this.setState({
      pokemon: pokemon,
      worldMap: worldMap
    })

    enemyInformation.attack.phy = 0;
    enemyInformation.attack.mag = 0;
    enemyInformation.defence = 0;
    pokemon.attack.phy = 0;
    pokemon.attack.mag = 0;
    pokemon.defence = 0;
    this.setState({
      worldMap: worldMap,
      pokemon: pokemon
    });


    if (pokemon.health.currentHealth <= 0) {
      this.props.lose();
      return;
    } else if (this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.health.currentHealth <= 0) {
      this.props.win();
      return;
    }
    this.setState({costHave: this.state.costMax});



    if (this.state.cardsLeft.length < 2) {
      if (this.state.cardsUsed.length === 0) {
        if (this.state.cardsLeft.length === 0) {
          this.enemy();
          return;
        }
        else {
          var arr = this.state.cardsLeft;
          var arrInHand = this.state.cardsInHand;
          arrInHand.push(arr.pop());
          this.setState({
            cardsInHand: arrInHand,
            cardsLeft: arr
          });
          this.enemy();
          return;
        }
      }
      else if (this.state.cardsUsed.length === 1) {
        var arrUsed = this.state.cardsUsed;
        var arrLeft = this.state.cardsLeft;
        var arrInHand = this.state.cardsInHand;
        if (arrLeft.length === 1) {
          arrInHand.push(arrLeft.pop());
          arrInHand.push(arrUsed.pop());
          this.setState({
            cardsLeft: arrLeft,
            cardsInHand: arrInHand,
            cardsUsed: arrUsed
          });
          console.log("New Round!", "All cards", this.state.cards, "cards left",this.state.cardsLeft,"cards in hand", this.state.cardsInHand,"cards used",this.state.cardsUsed);
          this.enemy();
          return;
        } else {
          arrInHand.push(arrUsed.pop());
          this.setState({
            cardsLeft: arrLeft,
            cardsInHand: arrInHand,
            cardsUsed: arrUsed
          });
          console.log("New Round!", "All cards", this.state.cards, "cards left",this.state.cardsLeft,"cards in hand", this.state.cardsInHand,"cards used",this.state.cardsUsed);
          this.enemy();
          return;
        }
      } else {
        var arrUsed = this.state.cardsUsed;
        var arrLeft = this.state.cardsLeft;
        var arrInHand = this.state.cardsInHand;
        while (arrUsed.length !== 0) {
          var arr = arrUsed.splice(this.getRandomInt(arrUsed.length), 1)
          arrLeft.push(arr[0]);
        }
        this.setState({
          cardsLeft: arrLeft,
          cardsInHand: arrInHand,
          cardsUsed: arrUsed
        });
      }
    }
    for (var i = 0; i < 2; i++) {
      var j = cardsLeft.splice(this.getRandomInt(cardsLeft.length), 1)
      cardsInHand.push(j[0])
    }
    this.setState({
      cardsLeft: cardsLeft,
      cardsInHand: cardsInHand
    });
    this.enemy();
    console.log("New Round!", "All cards", this.state.cards, "cards left",this.state.cardsLeft,"cards in hand", this.state.cardsInHand,"cards used",this.state.cardsUsed);
  }

  enemy() {
    var worldMap = this.state.worldMap;
    var enemyInformation = worldMap[this.state.position[0]][this.state.position[1]].attribute;
    var random = this.getRandomInt(2);
    console.log(random);
    if (random === 1) {
      enemyInformation.attack.phy = this.getRandomInt(9)+1;
    } else if (random === 0) {
      enemyInformation.attack.mag = this.getRandomInt(4)+1;
    }
    random = this.getRandomInt(2);
    if (random === 1) {
      enemyInformation.defence = this.getRandomInt(4)+1;
    }
    this.setState({worldMap: worldMap});
  }

  drop() {
    //if (this.state.drag) {
      var obj = this.state.pokemon;
      var phy = obj.attack.phy;
      var mag = obj.attack.mag;
      var defence = obj.defence;
      var costs = this.state.costHave;
      var health = obj.health.currentHealth;

      if (this.state.cardsHold.cost) {
        if (costs < this.state.cardsHold.cost) {
          console.log("Not enough costs");
          return;
        }
        costs -= this.state.cardsHold.cost;
      }
      if (this.state.cardsHold.attack) {
        obj.attack.phy += this.state.cardsHold.attack;
      }
      if (this.state.cardsHold.fire) {
        obj.attack.mag += this.state.cardsHold.fire;
      }
      if (this.state.cardsHold.water) {
        obj.attack.mag += this.state.cardsHold.water;
      }
      if (this.state.cardsHold.grass) {
        obj.attack.mag += this.state.cardsHold.grass;
      }
      if (this.state.cardsHold.defence) {
        obj.defence += this.state.cardsHold.defence;
      }
      if (this.state.cardsHold.healing) {
        obj.health.currentHealth += this.state.cardsHold.healing;
        if (obj.health.currentHealth >= this.state.pokemon.health.maxHealth) {
          obj.health.currentHealth = this.state.pokemon.health.maxHealth;
        }
      }
      if (this.state.cardsHold.ball) {
        var currentHealth = this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.health.currentHealth;
        var maxHealth = this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.health.maxHealth;
        var possibility = Math.pow(currentHealth/maxHealth, 1/3);
        console.log(possibility);
        if (Math.random() > possibility) {
          console.log("shou fu");
          var arr = this.state.allPokemon;
          arr.push({
            level: {
              num: 1,
              maxExp: 100,
              currentExp: 0
            },
            health: {
              maxHealth: this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.health.maxHealth,
              currentHealth: this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.health.maxHealth,
            },
            attack: {
              phy: 0,
              mag: 0
            },
            defence: 0,
            attribute: this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attribute
          });
          var arrColor = this.state.color;
          arrColor.push("white")
          this.setState({allPokemon: arr, color: arrColor});
          this.props.win();

        } else {
          console.log("shou fu fail");
        }
      }
      var cardsInHand = this.state.cardsInHand;
      var cardsUsed = this.state.cardsUsed;
      var cardsLeft = this.state.cardsLeft;
      if (this.state.cardsHold.getCards) {
        var num = this.state.cardsHold.getCards;
        while (num > 0) {
          var getCards = cardsLeft.pop();
          cardsInHand.push(getCards);
          num --;
        }
      }
      this.setState({
        pokemon: obj,
        costHave: costs,
        cardsInHand: cardsInHand,
        cardsLeft: cardsLeft
      });

      for (var i = 0; i < cardsInHand.length; i++) {
        if (cardsInHand[i] === this.state.cardsHold) {
          var cardUsed = cardsInHand.splice(i, 1);
          cardsUsed.push(cardUsed[0]);
          this.setState({
            cardsInHand: cardsInHand,
            cardsUsed: cardsUsed,
            cardsHold: {}
          })
        }
      }
  //}
  }

  dragEnter() {
    console.log("Drag Enter");
    this.setState({drag: true});
    console.log(this.state.drag);
  }

  dragLeave() {
    console.log("Drag Leave");
    this.setState({drag: false});
  }

  drag(cardsInHand) {
    this.setState({cardsHold: cardsInHand})
  }

  render() {
    console.log(this.state.cardsInHand);
    if (this.state.pokemon.attribute === "fire") {
      if (this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attribute === "fire") {
        return <div className='fight'>
          <div style={{color: 'red'}}><strong>Enemy Information</strong></div>
        <div className="health"><img width="30px" height="30px" src="https://www.redcross.org.hk/rcmovement/images/cross.jpg"/> {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.health.currentHealth}/{this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.health.maxHealth}</div>
        <div className="imageThree"><img className="images" width="30px" height="30px" src="https://t4.ftcdn.net/jpg/01/28/24/55/240_F_128245586_YohqYp6BYmV3oZIOXIu9FrC0zNr2i0K6.jpg"/> {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.phy}
        <img className="images" width="30px" height="30px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxCAPN7-m6xSUgTlH2cyPPNGDdYZaQNgRMQHVwnFhi1e8rkJed"/> {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.mag}
        <img className="images" width="30px" height="30px" src="http://www.clker.com/cliparts/p/n/W/Y/F/V/base-of-shield-logo-hi.png"/> {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.defence}</div>
        <br/><div><strong>My information</strong></div>
        <div className="health"><img width="30px" height="30px" src="https://www.redcross.org.hk/rcmovement/images/cross.jpg"/> {this.state.pokemon.health.currentHealth}/{this.state.pokemon.health.maxHealth}</div>
        <div className="imageThree"><img className="images" width="30px" height="30px" src="https://t4.ftcdn.net/jpg/01/28/24/55/240_F_128245586_YohqYp6BYmV3oZIOXIu9FrC0zNr2i0K6.jpg"/> {this.state.pokemon.attack.phy}
        <img className="images" width="30px" height="30px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxCAPN7-m6xSUgTlH2cyPPNGDdYZaQNgRMQHVwnFhi1e8rkJed"/> {this.state.pokemon.attack.mag}
        <img className="images" width="30px" height="30px" src="http://www.clker.com/cliparts/p/n/W/Y/F/V/base-of-shield-logo-hi.png"/> {this.state.pokemon.defence}</div>
        <div className="costs"><img width="30px" height="30px" src="http://origin-images.ttnet.net/pi/cto/40/10/99/03/40109903-logo.jpg"/> {this.state.costHave}/{this.state.costMax}</div>
        <br/><div style={{color: 'blue'}}><strong>Cards in hand: </strong></div>
        <div className="cards-in-hand">
          {
            this.state.cardsInHand.map((card, i) => {
              return <div className="Info" draggable="true" onDrag={() => this.drag(card)} onDragEnd={() => this.drop()}><div>{card.name}: {card.description}</div><div>Cost: {card.cost}</div></div>
            })
          }
          </div>
        <br/><button style={{marginBottom: 10}} onClick={() => this.nextRound()}>Next Round</button>
        </div>
      } else if (this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attribute === "water") {
        return <div className='fight'>
          <div style={{color: 'red'}}><strong>Enemy Information</strong></div>
        <div className="health"><img width="30px" height="30px" src="https://www.redcross.org.hk/rcmovement/images/cross.jpg"/> {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.health.currentHealth}/{this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.health.maxHealth}</div>
        <div className="imageThree"><img className="images" width="30px" height="30px" src="https://t4.ftcdn.net/jpg/01/28/24/55/240_F_128245586_YohqYp6BYmV3oZIOXIu9FrC0zNr2i0K6.jpg"/> {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.phy}
        <img className="images" width="30px" height="30px" src="http://ohidul.me/wp-content/uploads/10-tips-for-saving-water-in-the-garden-logo-google-and-logos-brilliant-save.jpg"/> {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.mag}
        <img className="images" width="30px" height="30px" src="http://www.clker.com/cliparts/p/n/W/Y/F/V/base-of-shield-logo-hi.png"/> {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.defence}</div>
        <br/><div><strong>My information</strong></div>
        <div className="health"><img width="30px" height="30px" src="https://www.redcross.org.hk/rcmovement/images/cross.jpg"/> {this.state.pokemon.health.currentHealth}/{this.state.pokemon.health.maxHealth}</div>
        <div className="imageThree"><img className="images" width="30px" height="30px" src="https://t4.ftcdn.net/jpg/01/28/24/55/240_F_128245586_YohqYp6BYmV3oZIOXIu9FrC0zNr2i0K6.jpg"/> {this.state.pokemon.attack.phy}
        <img className="images" width="30px" height="30px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxCAPN7-m6xSUgTlH2cyPPNGDdYZaQNgRMQHVwnFhi1e8rkJed"/> {this.state.pokemon.attack.mag}
        <img className="images" width="30px" height="30px" src="http://www.clker.com/cliparts/p/n/W/Y/F/V/base-of-shield-logo-hi.png"/> {this.state.pokemon.defence}</div>
        <div className="costs"><img width="30px" height="30px" src="http://origin-images.ttnet.net/pi/cto/40/10/99/03/40109903-logo.jpg"/> {this.state.costHave}/{this.state.costMax}</div>
        <br/><div style={{color: 'blue'}}><strong>Cards in hand: </strong></div>
        <div className="cards-in-hand">
          {
            this.state.cardsInHand.map((card, i) => {
              return <div className="Info" draggable="true" onDrag={() => this.drag(card)} onDragEnd={() => this.drop()}><div>{card.name}: {card.description}</div><div>Cost: {card.cost}</div></div>
            })
          }
          </div>
        <br/><button style={{marginBottom: 10}} onClick={() => this.nextRound()}>Next Round</button>

        </div>
      } else if (this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attribute === "grass") {
        return <div className='fight'>
          <div style={{color: 'red'}}><strong>Enemy Information</strong></div>
        <div className="health"><img width="30px" height="30px" src="https://www.redcross.org.hk/rcmovement/images/cross.jpg"/> {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.health.currentHealth}/{this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.health.maxHealth}</div>
        <div className="imageThree"><img className="images" width="30px" height="30px" src="https://t4.ftcdn.net/jpg/01/28/24/55/240_F_128245586_YohqYp6BYmV3oZIOXIu9FrC0zNr2i0K6.jpg"/> {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.phy}
        <img className="images" width="30px" height="30px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyZ0kK72Gz9etb2aYc5qgUPwwopF51f7zrcRbC1pcD6wxy_YEw"/> {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.mag}
        <img className="images" width="30px" height="30px" src="http://www.clker.com/cliparts/p/n/W/Y/F/V/base-of-shield-logo-hi.png"/> {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.defence}</div>
        <br/><div><strong>My information</strong></div>
        <div className="health"><img width="30px" height="30px" src="https://www.redcross.org.hk/rcmovement/images/cross.jpg"/> {this.state.pokemon.health.currentHealth}/{this.state.pokemon.health.maxHealth}</div>
        <div className="imageThree"><img className="images" width="30px" height="30px" src="https://t4.ftcdn.net/jpg/01/28/24/55/240_F_128245586_YohqYp6BYmV3oZIOXIu9FrC0zNr2i0K6.jpg"/> {this.state.pokemon.attack.phy}
        <img className="images" width="30px" height="30px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxCAPN7-m6xSUgTlH2cyPPNGDdYZaQNgRMQHVwnFhi1e8rkJed"/> {this.state.pokemon.attack.mag}
        <img className="images" width="30px" height="30px" src="http://www.clker.com/cliparts/p/n/W/Y/F/V/base-of-shield-logo-hi.png"/> {this.state.pokemon.defence}</div>
        <div className="costs"><img width="30px" height="30px" src="http://origin-images.ttnet.net/pi/cto/40/10/99/03/40109903-logo.jpg"/> {this.state.costHave}/{this.state.costMax}</div>
        <br/><div style={{color: 'blue'}}><strong>Cards in hand: </strong></div>
        <div className="cards-in-hand">
          {
            this.state.cardsInHand.map((card, i) => {
              return <div className="Info" draggable="true" onDrag={() => this.drag(card)} onDragEnd={() => this.drop()}><div>{card.name}: {card.description}</div><div>Cost: {card.cost}</div></div>
            })
          }
          </div>
        <br/><button style={{marginBottom: 10}} onClick={() => this.nextRound()}>Next Round</button>

        </div>
      }
    } else if (this.state.pokemon.attribute === "water") {
      if (this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attribute === "fire") {
        return <div className='fight'>
          <div style={{color: 'red'}}><strong>Enemy Information</strong></div>
        <div className="health"><img width="30px" height="30px" src="https://www.redcross.org.hk/rcmovement/images/cross.jpg"/> {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.health.currentHealth}/{this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.health.maxHealth}</div>
        <div className="imageThree"><img className="images" width="30px" height="30px" src="https://t4.ftcdn.net/jpg/01/28/24/55/240_F_128245586_YohqYp6BYmV3oZIOXIu9FrC0zNr2i0K6.jpg"/> {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.phy}
        <img className="images" width="30px" height="30px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxCAPN7-m6xSUgTlH2cyPPNGDdYZaQNgRMQHVwnFhi1e8rkJed"/> {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.mag}
        <img className="images" width="30px" height="30px" src="http://www.clker.com/cliparts/p/n/W/Y/F/V/base-of-shield-logo-hi.png"/> {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.defence}</div>
        <br/><div><strong>My information</strong></div>
        <div className="health"><img width="30px" height="30px" src="https://www.redcross.org.hk/rcmovement/images/cross.jpg"/> {this.state.pokemon.health.currentHealth}/{this.state.pokemon.health.maxHealth}</div>
        <div className="imageThree"><img className="images" width="30px" height="30px" src="https://t4.ftcdn.net/jpg/01/28/24/55/240_F_128245586_YohqYp6BYmV3oZIOXIu9FrC0zNr2i0K6.jpg"/> {this.state.pokemon.attack.phy}
        <img className="images" width="30px" height="30px" src="http://ohidul.me/wp-content/uploads/10-tips-for-saving-water-in-the-garden-logo-google-and-logos-brilliant-save.jpg"/> {this.state.pokemon.attack.mag}
        <img className="images" width="30px" height="30px" src="http://www.clker.com/cliparts/p/n/W/Y/F/V/base-of-shield-logo-hi.png"/> {this.state.pokemon.defence}</div>
        <div className="costs"><img width="30px" height="30px" src="http://origin-images.ttnet.net/pi/cto/40/10/99/03/40109903-logo.jpg"/> {this.state.costHave}/{this.state.costMax}</div>
        <br/><div style={{color: 'blue'}}><strong>Cards in hand: </strong></div>
        <div className="cards-in-hand">
          {
            this.state.cardsInHand.map((card, i) => {
              return <div className="Info" draggable="true" onDrag={() => this.drag(card)} onDragEnd={() => this.drop()}><div>{card.name}: {card.description}</div><div>Cost: {card.cost}</div></div>
            })
          }
          </div>
        <br/><button style={{marginBottom: 10}} onClick={() => this.nextRound()}>Next Round</button>

        </div>
      } else if (this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attribute === "water") {
        return <div className='fight'>
          <div style={{color: 'red'}}><strong>Enemy Information</strong></div>
        <div className="health"><img width="30px" height="30px" src="https://www.redcross.org.hk/rcmovement/images/cross.jpg"/> {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.health.currentHealth}/{this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.health.maxHealth}</div>
        <div className="imageThree"><img className="images" width="30px" height="30px" src="https://t4.ftcdn.net/jpg/01/28/24/55/240_F_128245586_YohqYp6BYmV3oZIOXIu9FrC0zNr2i0K6.jpg"/> {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.phy}
        <img className="images" width="30px" height="30px" src="http://ohidul.me/wp-content/uploads/10-tips-for-saving-water-in-the-garden-logo-google-and-logos-brilliant-save.jpg"/> {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.mag}
        <img className="images" width="30px" height="30px" src="http://www.clker.com/cliparts/p/n/W/Y/F/V/base-of-shield-logo-hi.png"/> {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.defence}</div>
        <br/><div><strong>My information</strong></div>
        <div className="health"><img width="30px" height="30px" src="https://www.redcross.org.hk/rcmovement/images/cross.jpg"/> {this.state.pokemon.health.currentHealth}/{this.state.pokemon.health.maxHealth}</div>
        <div className="imageThree"><img className="images" width="30px" height="30px" src="https://t4.ftcdn.net/jpg/01/28/24/55/240_F_128245586_YohqYp6BYmV3oZIOXIu9FrC0zNr2i0K6.jpg"/> {this.state.pokemon.attack.phy}
        <img className="images" width="30px" height="30px" src="http://ohidul.me/wp-content/uploads/10-tips-for-saving-water-in-the-garden-logo-google-and-logos-brilliant-save.jpg"/> {this.state.pokemon.attack.mag}
        <img className="images" width="30px" height="30px" src="http://www.clker.com/cliparts/p/n/W/Y/F/V/base-of-shield-logo-hi.png"/> {this.state.pokemon.defence}</div>
        <div className="costs"><img width="30px" height="30px" src="http://origin-images.ttnet.net/pi/cto/40/10/99/03/40109903-logo.jpg"/> {this.state.costHave}/{this.state.costMax}</div>
        <br/><div style={{color: 'blue'}}><strong>Cards in hand: </strong></div>
        <div className="cards-in-hand">
          {
            this.state.cardsInHand.map((card, i) => {
              return <div className="Info" draggable="true" onDrag={() => this.drag(card)} onDragEnd={() => this.drop()}><div>{card.name}: {card.description}</div><div>Cost: {card.cost}</div></div>
            })
          }
          </div>
        <br/><button style={{marginBottom: 10}} onClick={() => this.nextRound()}>Next Round</button>

        </div>
      } else if (this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attribute === "grass") {
        return <div className='fight'>
          <div style={{color: 'red'}}><strong>Enemy Information</strong></div>
        <div className="health"><img width="30px" height="30px" src="https://www.redcross.org.hk/rcmovement/images/cross.jpg"/> {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.health.currentHealth}/{this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.health.maxHealth}</div>
        <div className="imageThree"><img className="images" width="30px" height="30px" src="https://t4.ftcdn.net/jpg/01/28/24/55/240_F_128245586_YohqYp6BYmV3oZIOXIu9FrC0zNr2i0K6.jpg"/> {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.phy}
        <img className="images" width="30px" height="30px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyZ0kK72Gz9etb2aYc5qgUPwwopF51f7zrcRbC1pcD6wxy_YEw"/> {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.mag}
        <img className="images" width="30px" height="30px" src="http://www.clker.com/cliparts/p/n/W/Y/F/V/base-of-shield-logo-hi.png"/> {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.defence}</div>
        <br/><div><strong>My information</strong></div>
        <div className="health"><img width="30px" height="30px" src="https://www.redcross.org.hk/rcmovement/images/cross.jpg"/> {this.state.pokemon.health.currentHealth}/{this.state.pokemon.health.maxHealth}</div>
        <div className="imageThree"><img className="images" width="30px" height="30px" src="https://t4.ftcdn.net/jpg/01/28/24/55/240_F_128245586_YohqYp6BYmV3oZIOXIu9FrC0zNr2i0K6.jpg"/> {this.state.pokemon.attack.phy}
        <img className="images" width="30px" height="30px" src="http://ohidul.me/wp-content/uploads/10-tips-for-saving-water-in-the-garden-logo-google-and-logos-brilliant-save.jpg"/> {this.state.pokemon.attack.mag}
        <img className="images" width="30px" height="30px" src="http://www.clker.com/cliparts/p/n/W/Y/F/V/base-of-shield-logo-hi.png"/> {this.state.pokemon.defence}</div>
        <div className="costs"><img width="30px" height="30px" src="http://origin-images.ttnet.net/pi/cto/40/10/99/03/40109903-logo.jpg"/> {this.state.costHave}/{this.state.costMax}</div>
        <br/><div style={{color: 'blue'}}><strong>Cards in hand: </strong></div>
        <div className="cards-in-hand">
          {
            this.state.cardsInHand.map((card, i) => {
              return <div className="Info" draggable="true" onDrag={() => this.drag(card)} onDragEnd={() => this.drop()}><div>{card.name}: {card.description}</div><div>Cost: {card.cost}</div></div>
            })
          }
          </div>
        <br/><button style={{marginBottom: 10}} onClick={() => this.nextRound()}>Next Round</button>

        </div>
      }
    } else {
      if (this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attribute === "fire") {
        return <div className='fight'>
          <div style={{color: 'red'}}><strong>Enemy Information</strong></div>
        <div className="health"><img width="30px" height="30px" src="https://www.redcross.org.hk/rcmovement/images/cross.jpg"/> {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.health.currentHealth}/{this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.health.maxHealth}</div>
        <div className="imageThree"><img className="images" width="30px" height="30px" src="https://t4.ftcdn.net/jpg/01/28/24/55/240_F_128245586_YohqYp6BYmV3oZIOXIu9FrC0zNr2i0K6.jpg"/> {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.phy}
        <img className="images" width="30px" height="30px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxCAPN7-m6xSUgTlH2cyPPNGDdYZaQNgRMQHVwnFhi1e8rkJed"/> {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.mag}
        <img className="images" width="30px" height="30px" src="http://www.clker.com/cliparts/p/n/W/Y/F/V/base-of-shield-logo-hi.png"/> {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.defence}</div>
        <br/><div><strong>My information</strong></div>
        <div className="health"><img width="30px" height="30px" src="https://www.redcross.org.hk/rcmovement/images/cross.jpg"/> {this.state.pokemon.health.currentHealth}/{this.state.pokemon.health.maxHealth}</div>
        <div className="imageThree"><img className="images" width="30px" height="30px" src="https://t4.ftcdn.net/jpg/01/28/24/55/240_F_128245586_YohqYp6BYmV3oZIOXIu9FrC0zNr2i0K6.jpg"/> {this.state.pokemon.attack.phy}
        <img className="images" width="30px" height="30px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyZ0kK72Gz9etb2aYc5qgUPwwopF51f7zrcRbC1pcD6wxy_YEw"/> {this.state.pokemon.attack.mag}
        <img className="images" width="30px" height="30px" src="http://www.clker.com/cliparts/p/n/W/Y/F/V/base-of-shield-logo-hi.png"/> {this.state.pokemon.defence}</div>
        <div className="costs"><img width="30px" height="30px" src="http://origin-images.ttnet.net/pi/cto/40/10/99/03/40109903-logo.jpg"/> {this.state.costHave}/{this.state.costMax}</div>
        <br/><div style={{color: 'blue'}}><strong>Cards in hand: </strong></div>
        <div className="cards-in-hand">
          {
            this.state.cardsInHand.map((card, i) => {
              return <div className="Info" draggable="true" onDrag={() => this.drag(card)} onDragEnd={() => this.drop()}><div>{card.name}: {card.description}</div><div>Cost: {card.cost}</div></div>
            })
          }
          </div>
        <br/><button style={{marginBottom: 10}} onClick={() => this.nextRound()}>Next Round</button>

        </div>
      } else if (this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attribute === "water") {
        return <div className='fight'>
          <div style={{color: 'red'}}><strong>Enemy Information</strong></div>
        <div className="health"><img width="30px" height="30px" src="https://www.redcross.org.hk/rcmovement/images/cross.jpg"/> {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.health.currentHealth}/{this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.health.maxHealth}</div>
        <div className="imageThree"><img className="images" width="30px" height="30px" src="https://t4.ftcdn.net/jpg/01/28/24/55/240_F_128245586_YohqYp6BYmV3oZIOXIu9FrC0zNr2i0K6.jpg"/> {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.phy}
        <img className="images" width="30px" height="30px" src="http://ohidul.me/wp-content/uploads/10-tips-for-saving-water-in-the-garden-logo-google-and-logos-brilliant-save.jpg"/> {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.mag}
        <img className="images" width="30px" height="30px" src="http://www.clker.com/cliparts/p/n/W/Y/F/V/base-of-shield-logo-hi.png"/> {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.defence}</div>
        <br/><div><strong>My information</strong></div>
        <div className="health"><img width="30px" height="30px" src="https://www.redcross.org.hk/rcmovement/images/cross.jpg"/> {this.state.pokemon.health.currentHealth}/{this.state.pokemon.health.maxHealth}</div>
        <div className="imageThree"><img className="images" width="30px" height="30px" src="https://t4.ftcdn.net/jpg/01/28/24/55/240_F_128245586_YohqYp6BYmV3oZIOXIu9FrC0zNr2i0K6.jpg"/> {this.state.pokemon.attack.phy}
        <img className="images" width="30px" height="30px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyZ0kK72Gz9etb2aYc5qgUPwwopF51f7zrcRbC1pcD6wxy_YEw"/> {this.state.pokemon.attack.mag}
        <img className="images" width="30px" height="30px" src="http://www.clker.com/cliparts/p/n/W/Y/F/V/base-of-shield-logo-hi.png"/> {this.state.pokemon.defence}</div>
        <div className="costs"><img width="30px" height="30px" src="http://origin-images.ttnet.net/pi/cto/40/10/99/03/40109903-logo.jpg"/> {this.state.costHave}/{this.state.costMax}</div>
        <br/><div style={{color: 'blue'}}><strong>Cards in hand: </strong></div>
        <div className="cards-in-hand">
          {
            this.state.cardsInHand.map((card, i) => {
              return <div className="Info" draggable="true" onDrag={() => this.drag(card)} onDragEnd={() => this.drop()}><div>{card.name}: {card.description}</div><div>Cost: {card.cost}</div></div>
            })
          }
          </div>
        <br/><button style={{marginBottom: 10}} onClick={() => this.nextRound()}>Next Round</button>

        </div>
      } else if (this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attribute === "grass") {
        return <div className='fight'>
          <div style={{color: 'red'}}><strong>Enemy Information</strong></div>
        <div className="health"><img width="30px" height="30px" src="https://www.redcross.org.hk/rcmovement/images/cross.jpg"/> {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.health.currentHealth}/{this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.health.maxHealth}</div>
        <div className="imageThree"><img className="images" width="30px" height="30px" src="https://t4.ftcdn.net/jpg/01/28/24/55/240_F_128245586_YohqYp6BYmV3oZIOXIu9FrC0zNr2i0K6.jpg"/> {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.phy}
        <img className="images" width="30px" height="30px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyZ0kK72Gz9etb2aYc5qgUPwwopF51f7zrcRbC1pcD6wxy_YEw"/> {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.mag}
        <img className="images" width="30px" height="30px" src="http://www.clker.com/cliparts/p/n/W/Y/F/V/base-of-shield-logo-hi.png"/> {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.defence}</div>
        <br/><div><strong>My information</strong></div>
        <div className="health"><img width="30px" height="30px" src="https://www.redcross.org.hk/rcmovement/images/cross.jpg"/> {this.state.pokemon.health.currentHealth}/{this.state.pokemon.health.maxHealth}</div>
        <div className="imageThree"><img className="images" width="30px" height="30px" src="https://t4.ftcdn.net/jpg/01/28/24/55/240_F_128245586_YohqYp6BYmV3oZIOXIu9FrC0zNr2i0K6.jpg"/> {this.state.pokemon.attack.phy}
        <img className="images" width="30px" height="30px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyZ0kK72Gz9etb2aYc5qgUPwwopF51f7zrcRbC1pcD6wxy_YEw"/> {this.state.pokemon.attack.mag}
        <img className="images" width="30px" height="30px" src="http://www.clker.com/cliparts/p/n/W/Y/F/V/base-of-shield-logo-hi.png"/> {this.state.pokemon.defence}</div>
        <div className="costs"><img width="30px" height="30px" src="http://origin-images.ttnet.net/pi/cto/40/10/99/03/40109903-logo.jpg"/> {this.state.costHave}/{this.state.costMax}</div>
        <br/><div style={{color: 'blue'}}><strong>Cards in hand: </strong></div>
        <div className="cards-in-hand">
          {
            this.state.cardsInHand.map((card, i) => {
              return <div className="Info" draggable="true" onDrag={() => this.drag(card)} onDragEnd={() => this.drop()}><div>{card.name}: {card.description}</div><div>Cost: {card.cost}</div></div>
            })
          }
          </div>
        <br/><button style={{marginBottom: 10}} className="choose" onClick={() => this.nextRound()}>Next Round</button>

        </div>
      }
    }
  }
}

export default Fight;
