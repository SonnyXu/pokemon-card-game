import React, { Component } from 'react';
import './css/Fight.css'

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

class Fight extends Component {
  constructor(props) {
    super(props);
    let cardsInHand = [];
    let cards = this.props.cards;
    let cardsLeft = [];
    for (let i = 0; i < cards.length; i++) {
      cardsLeft.push(cards[i]);
    }
    for (let i = 0; i < 4; i++) {
      let j = cardsLeft.splice(getRandomInt(cardsLeft.length), 1)
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
      color: this.props.color
    }
  }

  compareMag(enemyAttr, myAttr) {
    if (enemyAttr === myAttr) return 0;
    else if ((myAttr === "fire" && enemyAttr === "grass")
            ||(myAttr === "water" && enemyAttr === "fire")
            ||(myAttr === "grass" && enemyAttr === "water")) return 1;
    else return -1;
  }

  nextRound() {
    let pokemon = this.state.pokemon;
    let cardsInHand = this.state.cardsInHand;
    let cardsLeft = this.state.cardsLeft;
    let worldMap = this.state.worldMap;
    let enemyInformation = worldMap[this.state.position[0]][this.state.position[1]].attribute;
    let enemyAttr = enemyInformation.attribute;
    let myAttr = pokemon.attribute;

    if (enemyInformation.attack.phy > pokemon.defence) {
      pokemon.health.currentHealth -= enemyInformation.attack.phy - pokemon.defence;
    }
    if (enemyInformation.defence < pokemon.attack.phy) {
      enemyInformation.health.currentHealth -= pokemon.attack.phy - enemyInformation.defence;
    }
    if (this.compareMag(enemyAttr, myAttr) > 0) {
      if (enemyInformation.attack.mag > 2 *pokemon.attack.mag) {
        pokemon.health.currentHealth -= enemyInformation.attack.mag - 2 * pokemon.attack.mag;
      } else {
        enemyInformation.health.currentHealth -= 2 * pokemon.attack.mag - enemyInformation.attack.mag
      }
    } else if (this.compareMag(enemyAttr, myAttr) < 0) {
      if (2 * enemyInformation.attack.mag > pokemon.attack.mag) {
        pokemon.health.currentHealth -= 2 * enemyInformation.attack.mag - pokemon.attack.mag;
      } else {
        enemyInformation.health.currentHealth -= pokemon.attack.mag - 2 * enemyInformation.attack.mag
      }
    } else {
      if (enemyInformation.attack.mag > pokemon.attack.mag) {
        pokemon.health.currentHealth -= enemyInformation.attack.mag - pokemon.attack.mag;
      } else {
        enemyInformation.health.currentHealth -= pokemon.attack.mag - enemyInformation.attack.mag
      }
    }

    enemyInformation.attack.phy = 0;
    enemyInformation.attack.mag = 0;
    enemyInformation.defence = 0;
    pokemon.attack.phy = 0;
    pokemon.attack.mag = 0;
    pokemon.defence = 0;
    this.props.save({
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
    this.props.save({costHave: this.state.costMax});

    if (this.state.cardsLeft.length < 2) {
      if (this.state.cardsUsed.length === 0) {
        if (this.state.cardsLeft.length === 0) {
          this.enemy();
          return;
        }
        else {
          let arr = this.state.cardsLeft;
          let arrInHand = this.state.cardsInHand;
          arrInHand.push(arr.pop());
          this.props.save({
            cardsInHand: arrInHand,
            cardsLeft: arr
          });
          this.enemy();
          return;
        }
      }
      else if (this.state.cardsUsed.length === 1) {
        let arrUsed = this.state.cardsUsed;
        let arrLeft = this.state.cardsLeft;
        let arrInHand = this.state.cardsInHand;
        if (arrLeft.length === 1) {
          arrInHand.push(arrLeft.pop());
          arrInHand.push(arrUsed.pop());
          this.props.save({
            cardsLeft: arrLeft,
            cardsInHand: arrInHand,
            cardsUsed: arrUsed
          });
          this.enemy();
          return;
        } else {
          arrInHand.push(arrUsed.pop());
          this.props.save({
            cardsLeft: arrLeft,
            cardsInHand: arrInHand,
            cardsUsed: arrUsed
          });
          this.enemy();
          return;
        }
      } else {
        let arrUsed = this.state.cardsUsed;
        let arrLeft = this.state.cardsLeft;
        let arrInHand = this.state.cardsInHand;
        while (arrUsed.length !== 0) {
          let arr = arrUsed.splice(getRandomInt(arrUsed.length), 1)
          arrLeft.push(arr[0]);
        }
        this.props.save({
          cardsLeft: arrLeft,
          cardsInHand: arrInHand,
          cardsUsed: arrUsed
        });
      }
    }
    for (let i = 0; i < 2; i++) {
      let j = cardsLeft.splice(getRandomInt(cardsLeft.length), 1)
      cardsInHand.push(j[0])
    }
    this.props.save({
      cardsLeft: cardsLeft,
      cardsInHand: cardsInHand
    });
    this.enemy();
  }

  enemy() {
    let worldMap = this.state.worldMap;
    let enemyInformation = worldMap[this.state.position[0]][this.state.position[1]].attribute;
    let random = getRandomInt(4);
    if (random >= 1) {
      enemyInformation.attack.phy = getRandomInt(10)+1;
    } else if (random === 0) {
      enemyInformation.attack.mag = getRandomInt(3)+1;
    }
    random = getRandomInt(2);
    if (random === 1) {
      enemyInformation.defence = getRandomInt(5)+1;
    }
    this.props.save({worldMap: worldMap});
  }

  drop() {
    let obj = this.state.pokemon;
    let costs = this.state.costHave;

    if (this.state.cardsHold.cost) {
      if (costs < this.state.cardsHold.cost) {
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
      let currentHealth = this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.health.currentHealth;
      let maxHealth = this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.health.maxHealth;
      let possibility = Math.pow(currentHealth/maxHealth, 1/3);
      if (Math.random() > possibility) {
        let arr = this.state.allPokemon;
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

        let arrColor = this.state.color;
        arrColor.push("white")
        this.props.save({allPokemon: arr, color: arrColor});
        this.props.win();
      }
    }
    let cardsInHand = this.state.cardsInHand;
    let cardsUsed = this.state.cardsUsed;
    let cardsLeft = this.state.cardsLeft;
    if (this.state.cardsHold.getCards) {
      let num = this.state.cardsHold.getCards;
      while (num > 0) {
        let getCards = cardsLeft.pop();
        cardsInHand.push(getCards);
        num --;
      }
    }
    
    this.props.save({
      pokemon: obj,
      costHave: costs,
      cardsInHand: cardsInHand,
      cardsLeft: cardsLeft
    });

    for (let i = 0; i < cardsInHand.length; i++) {
      if (cardsInHand[i] === this.state.cardsHold) {
        let cardUsed = cardsInHand.splice(i, 1);
        cardsUsed.push(cardUsed[0]);
        this.props.save({
          cardsInHand: cardsInHand,
          cardsUsed: cardsUsed,
          cardsHold: {}
        })
      }
    }
  }

  drag(cardsInHand) {
    this.props.save({cardsHold: cardsInHand});
  }

  render() {
    var enemyAttr = this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attribute;
    var myAttr = this.state.pokemon.attribute;
    let currentHealth = this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.health.currentHealth;
    let maxHealth = this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.health.maxHealth;
    let myCurrentHealth = this.state.pokemon.health.currentHealth;
    let myMaxHealth = this.state.pokemon.health.maxHealth
    return <div className='fight'>
    <div style={{color: 'red'}}><strong>Enemy Information</strong></div>
    <div className="health"><img alt="" width="30px" height="30px" src="https://www.redcross.org.hk/rcmovement/images/cross.jpg"/> {currentHealth}/{maxHealth}</div>
    <div className="imageThree">
      <img alt="" className="images" width="30px" height="30px" src="https://t4.ftcdn.net/jpg/01/28/24/55/240_F_128245586_YohqYp6BYmV3oZIOXIu9FrC0zNr2i0K6.jpg"/>
      {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.phy}
      {enemyAttr === "fire" ?
      <div>
        <img alt="" className="images" width="30px" height="30px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxCAPN7-m6xSUgTlH2cyPPNGDdYZaQNgRMQHVwnFhi1e8rkJed"/>
        {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.mag}
      </div>
      : enemyAttr === "water" ?
      <div>
        <img alt="" className="images" width="30px" height="30px" src="http://ohidul.me/wp-content/uploads/10-tips-for-saving-water-in-the-garden-logo-google-and-logos-brilliant-save.jpg"/>
        {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.mag}
      </div>
      : enemyAttr === "grass" ?
      <div>
        <img alt="" className="images" width="30px" height="30px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyZ0kK72Gz9etb2aYc5qgUPwwopF51f7zrcRbC1pcD6wxy_YEw"/>
        {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.mag}
      </div>
      : <img alt="" src="#"/>}
      <img alt="" className="images" width="30px" height="30px" src="http://www.clker.com/cliparts/p/n/W/Y/F/V/base-of-shield-logo-hi.png"/>
      {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.defence}
    </div>
    <br/>
    <div><strong>My information</strong></div>
    <div className="health"><img alt="" width="30px" height="30px" src="https://www.redcross.org.hk/rcmovement/images/cross.jpg"/> {myCurrentHealth}/{myMaxHealth}</div>
    <div className="imageThree"><img alt="" className="images" width="30px" height="30px" src="https://t4.ftcdn.net/jpg/01/28/24/55/240_F_128245586_YohqYp6BYmV3oZIOXIu9FrC0zNr2i0K6.jpg"/>
      {this.state.pokemon.attack.phy}
      {myAttr === "fire" ?
      <div>
        <img alt="" className="images" width="30px" height="30px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxCAPN7-m6xSUgTlH2cyPPNGDdYZaQNgRMQHVwnFhi1e8rkJed"/>
        {this.state.pokemon.attack.mag}
      </div>
      : myAttr === "water" ?
      <div>
        <img alt="" className="images" width="30px" height="30px" src="http://ohidul.me/wp-content/uploads/10-tips-for-saving-water-in-the-garden-logo-google-and-logos-brilliant-save.jpg"/>
        {this.state.pokemon.attack.mag}
      </div>
      : myAttr === "grass" ?
      <div>
        <img alt="" className="images" width="30px" height="30px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyZ0kK72Gz9etb2aYc5qgUPwwopF51f7zrcRbC1pcD6wxy_YEw"/>
        {this.state.pokemon.attack.mag}
      </div>
      : <img alt="" src="#"/>}
      <img alt="" className="images" width="30px" height="30px" src="http://www.clker.com/cliparts/p/n/W/Y/F/V/base-of-shield-logo-hi.png"/>
      {this.state.pokemon.defence}
    </div>
    <div className="costs"><img alt="" width="30px" height="30px" src="http://origin-images.ttnet.net/pi/cto/40/10/99/03/40109903-logo.jpg"/>
    {this.state.costHave}/{this.state.costMax}</div>
    <br/>
    <div style={{color: 'blue'}}><strong>Cards in hand: </strong></div>
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
}

export default Fight;
