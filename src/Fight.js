import React, { Component } from 'react';
import ReactModal from 'react-modal';

import Cards from './Card.js'

import { Card, Button, Icon, Header } from 'semantic-ui-react'
import './css/Fight.css'

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
    let state = this.props.this
    let startStatus = {
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
      color: this.props.color,
      savingStatus: false,
      showSave: false,
      showLoad: false,
      savingSpots: this.props.savingSpots,
      loads: []
    }
    let data = {};
    for (let key in this.props.fightInfo) {
      if (this.props.fightInfo[key] !== undefined && this.props.fightInfo[key].length !== 0) {
        data[key] = this.props.fightInfo[key];
      }
    }
    this.state = Object.assign({}, state, startStatus, data, {status: "fight"});
  }

  async saveFightStatus() {
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
      } else {
        window.alert("Error!");
      }
    })
    .catch((err) => {
      // network error
      console.log('error', err)
    })
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


  loadFight() {
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
    .then((resp) => {
      if (resp.info) {
        this.setState(Object.assign({}, this.state, resp.info))
        this.setState({showLoad: false});
      }
    })
    .catch((err) => {
      // network error
      console.log('error', err)
    })
  }

  compareMag(enemyAttr, myAttr) {
    let attributeTable = {
      normal: {
        "0": ["ghost"],
        "0.5": ["rock", "steel"],
        "2": []
      },
      fighting: {
        "0":["ghost"],
        "0.5": ["flying", "poison", "bug", "psychic", "fairy"],
        "2": ["normal", "rock", "steel", "ice", "dark"]
      },
      flying: {
        "0": [],
        "0.5": ["rock", "electric", "steel"],
        "2": ["fighting", "bug", "grass"]
      },
      poison: {
        "0": ["steel"],
        "0.5": ["poison", "ground", "rock", "ghost"],
        "2": ["grass", "fairy"]
      },
      ground: {
        "0": ["flying"],
        "0.5": ["bug", "grass"],
        "2": ["poison", "rock", "steel", "fire", "electric"]
      },
      rock: {
        "0": [],
        "0.5": ["fighting", "ground", 'steel'],
        "2": ['flying', 'bug', 'fire', 'ice']
      },
      bug: {
        "0": [],
        "0.5": ["fighting", "flying", 'poison', "ghost", "steel", "fire", "fairy"],
        "2": ['grass', 'phychic', 'dark']
      },
      ghost: {
        "0": ["normal"],
        "0.5": ["dark"],
        "2": ['ghost', 'phychic']
      },
      steel: {
        "0": [],
        "0.5": ["steel", "fire", "water", "electric"],
        "2": ['rock', 'ice', "fairy"]
      },
      fire: {
        "0": [],
        "0.5": ["rock", "fire", "water", "dragon"],
        "2": ['bug', 'steel', "grass", "ice"]
      },
      water: {
        "0": [],
        "0.5": ["water", "grass", 'dragon'],
        "2": ['ground', 'rock', 'fire']
      },
      grass: {
        "0": [],
        "0.5": ["flying", 'poison', "steel", 'bug', 'fire', 'grass', 'dragon'],
        "2": ["ground", "rock", "water"]
      },
      electric: {
        "0": ["ground"],
        "0.5": ["grass", 'electric', 'dragon'],
        "2": ['flying', 'water']
      },
      psychic: {
        "0": ["dark"],
        "0.5": ["psychic", "steel"],
        "2": ['fighting', 'poison']
      },
      ice: {
        "0": [],
        "0.5": ["fire", "steel", 'water', 'ice'],
        "2": ['flying', 'ground', 'grass', 'dragon']
      },
      dragon: {
        "0": ["fairy"],
        "0.5": ["steel"],
        "2": ['dragon']
      },
      dark: {
        "0": [],
        "0.5": ["fighting", "dark", 'fairy'],
        "2": ['ghost', 'psychic']
      },
      fairy: {
        "0": [],
        "0.5": ["posion", "steel", 'fire'],
        "2": ['fighting', 'dark', 'dragon']
      }
    }
    let result = [1, 1];
    let obj1 = attributeTable[myAttr];
    for (let key in obj1) {
      if (obj1[key].indexOf(enemyAttr) !== -1) {
        result[0] = parseFloat(key);
      }
    }
    let obj2 = attributeTable[enemyAttr];
    for (let key in obj2) {
      if (obj2[key].indexOf(myAttr) !== -1) {
        result[1] = parseFloat(key);
      }
    }
    // console.log(result);
    return result;
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

    let arr = this.compareMag(enemyAttr, myAttr);
    let myMagAttack = pokemon.attack.mag * arr[0];
    let enemyMagAttack = enemyInformation.attack.mag * arr[1];
    if (myMagAttack > enemyMagAttack) {
      enemyInformation.health.currentHealth -= myMagAttack - enemyMagAttack;
    } else {
      pokemon.health.currentHealth -= enemyMagAttack - myMagAttack;
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
          let arr = this.state.cardsLeft;
          let arrInHand = this.state.cardsInHand;
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
        let arrUsed = this.state.cardsUsed;
        let arrLeft = this.state.cardsLeft;
        let arrInHand = this.state.cardsInHand;
        if (arrLeft.length === 1) {
          arrInHand.push(arrLeft.pop());
          arrInHand.push(arrUsed.pop());
          this.setState({
            cardsLeft: arrLeft,
            cardsInHand: arrInHand,
            cardsUsed: arrUsed
          });
          this.enemy();
          return;
        } else {
          arrInHand.push(arrUsed.pop());
          this.setState({
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
        this.setState({
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
    this.setState({
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
    this.setState({worldMap: worldMap});
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
    if (this.state.cardsHold.normal) {
      obj.attack.mag += this.state.cardsHold.normal;
    }
    if (this.state.cardsHold.fighting) {
      obj.attack.mag += this.state.cardsHold.fighting;
    }
    if (this.state.cardsHold.flying) {
      obj.attack.mag += this.state.cardsHold.flying;
    }
    if (this.state.cardsHold.poison) {
      obj.attack.mag += this.state.cardsHold.poison;
    }
    if (this.state.cardsHold.ground) {
      obj.attack.mag += this.state.cardsHold.ground;
    }
    if (this.state.cardsHold.rock) {
      obj.attack.mag += this.state.cardsHold.rock;
    }
    if (this.state.cardsHold.bug) {
      obj.attack.mag += this.state.cardsHold.bug;
    }
    if (this.state.cardsHold.ghost) {
      obj.attack.mag += this.state.cardsHold.ghost;
    }
    if (this.state.cardsHold.steel) {
      obj.attack.mag += this.state.cardsHold.steel;
    }
    if (this.state.cardsHold.electric) {
      obj.attack.mag += this.state.cardsHold.electric;
    }
    if (this.state.cardsHold.psychic) {
      obj.attack.mag += this.state.cardsHold.psychic;
    }
    if (this.state.cardsHold.ice) {
      obj.attack.mag += this.state.cardsHold.ice;
    }
    if (this.state.cardsHold.dragon) {
      obj.attack.mag += this.state.cardsHold.dragon;
    }
    if (this.state.cardsHold.dark) {
      obj.attack.mag += this.state.cardsHold.dark;
    }
    if (this.state.cardsHold.fairy) {
      obj.attack.mag += this.state.cardsHold.fairy;
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
        let name = window.prompt("name?");
        arr.push({
          name: name,
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
        this.setState({allPokemon: arr, color: arrColor});
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
    this.setState({
      pokemon: obj,
      costHave: costs,
      cardsInHand: cardsInHand,
      cardsLeft: cardsLeft
    });

    for (let i = 0; i < cardsInHand.length; i++) {
      if (cardsInHand[i] === this.state.cardsHold) {
        let cardUsed = cardsInHand.splice(i, 1);
        cardsUsed.push(cardUsed[0]);
        this.setState({
          cardsInHand: cardsInHand,
          cardsUsed: cardsUsed,
          cardsHold: {}
        })
      }
    }
  }

  drag(cardsInHand) {
    this.setState({cardsHold: cardsInHand})
  }

  render() {
    var enemyAttr = this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attribute;
    var myAttr = this.state.pokemon.attribute;
    let currentHealth = this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.health.currentHealth;
    let maxHealth = this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.health.maxHealth;
    let myCurrentHealth = this.state.pokemon.health.currentHealth;
    let myMaxHealth = this.state.pokemon.health.maxHealth
    let colors = ['red', 'orange', 'yellow', 'olive', 'green'];

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

    return (<div className={enemyAttr + '1'}>
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
          <Button className="btn-top" animated='vertical' onClick={() => this.saveFightStatus()}>
            <Button.Content hidden>Quick Save</Button.Content>
            <Button.Content visible>
              <Icon name='save' />
            </Button.Content>
          </Button>
        }
        <Button className="btn-top" animated='vertical' onClick={() => this.setState({showSave: true})}>
          <Button.Content hidden>Save</Button.Content>
          <Button.Content visible>
            <Icon name='save outline' />
          </Button.Content>
        </Button>
        <Button className="btn-top" animated='vertical' onClick={() => this.props.endGame()}>
          <Button.Content hidden>End</Button.Content>
          <Button.Content visible>
            <Icon name='close' />
          </Button.Content>
        </Button>
        <Button className="btn-top" animated='vertical' onClick={() => this.props.goHome()}>
          <Button.Content hidden>Home</Button.Content>
          <Button.Content visible>
            <Icon name='home' />
          </Button.Content>
        </Button>
      </div>

      <div className='fight'>
        <div className="strong" style={{color: 'red'}}><strong>Enemy Information</strong></div>
        <div className="health">
          <Header as='h2'>
            <Icon.Group >
              <Icon name='plus square' />
            </Icon.Group>
            {currentHealth}/{maxHealth}
          </Header>
        </div>
        <div className="imageThree">
          <Header className="images" as='h2'>
            <Icon.Group >
              <Icon name='quidditch' />
            </Icon.Group>
            {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.phy}
          </Header>
          {enemyAttr === "fire" ?
          <Header className="images" as='h2'>
            <Icon.Group >
              <Icon name='gripfire' />
            </Icon.Group>
            {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.mag}
          </Header>
          : enemyAttr === "water" ?
          <Header className="images" as='h2'>
            <Icon.Group >
              <Icon name='theme' />
            </Icon.Group>
            {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.mag}
          </Header>
          : enemyAttr === "grass" ?
          <Header className="images" as='h2'>
            <Icon.Group >
              <Icon name='leaf' />
            </Icon.Group>
            {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.mag}
          </Header>
          : enemyAttr === "normal" ?
          <Header className="images" as='h2'>
            <Icon.Group >
              <Icon name='circle' />
            </Icon.Group>
            {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.mag}
          </Header>
          : enemyAttr === "fighting" ?
          <Header className="images" as='h2'>
            <Icon.Group >
              <Icon name='hand rock' />
            </Icon.Group>
            {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.mag}
          </Header>
          : enemyAttr === "flying" ?
          <Header className="images" as='h2'>
            <Icon.Group >
              <Icon name='earlybirds' />
            </Icon.Group>
            {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.mag}
          </Header>
          : enemyAttr === "poison" ?
          <Header className="images" as='h2'>
            <Icon.Group >
              <Icon name='flask' />
            </Icon.Group>
            {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.mag}
          </Header>
          : enemyAttr === "ground" ?
          <Header className="images" as='h2'>
            <Icon.Group >
              <Icon name='blackberry' />
            </Icon.Group>
            {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.mag}
          </Header>
          : enemyAttr === "rock" ?
          <Header className="images" as='h2'>
            <Icon.Group >
              <Icon name='chart area' />
            </Icon.Group>
            {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.mag}
          </Header>
          : enemyAttr === "bug" ?
          <Header className="images" as='h2'>
            <Icon.Group >
              <Icon name='bug' />
            </Icon.Group>
            {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.mag}
          </Header>
          : enemyAttr === "ghost" ?
          <Header className="images" as='h2'>
            <Icon.Group >
              <Icon name='snapchat ghost' />
            </Icon.Group>
            {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.mag}
          </Header>
          : enemyAttr === "steel" ?
          <Header className="images" as='h2'>
            <Icon.Group >
              <Icon name='settings' />
            </Icon.Group>
            {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.mag}
          </Header>
          : enemyAttr === "electric" ?
          <Header className="images" as='h2'>
            <Icon.Group >
              <Icon name='bolt' />
            </Icon.Group>
            {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.mag}
          </Header>
          : enemyAttr === "psychic" ?
          <Header className="images" as='h2'>
            <Icon.Group >
              <Icon name='unhide' />
            </Icon.Group>
            {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.mag}
          </Header>
          : enemyAttr === "ice" ?
          <Header className="images" as='h2'>
            <Icon.Group >
              <Icon name='snowflake' />
            </Icon.Group>
            {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.mag}
          </Header>
          : enemyAttr === "dragon" ?
          <Header className="images" as='h2'>
            <Icon.Group >
              <Icon name='chess knight' />
            </Icon.Group>
            {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.mag}
          </Header>
          : enemyAttr === "dark" ?
          <Header className="images" as='h2'>
            <Icon.Group >
              <Icon name='low vision' />
            </Icon.Group>
            {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.mag}
          </Header>
          : enemyAttr === "fairy" ?
          <Header className="images" as='h2'>
            <Icon.Group >
              <Icon name='balance scale' />
            </Icon.Group>
            {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.mag}
          </Header>
          : <img alt="" src="#"/>
        }
          <Header className="images" as='h2'>
            <Icon.Group >
              <Icon name='shield' />
            </Icon.Group>
            {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.defence}
          </Header>
        </div>
        <div className="strong" style={{marginTop: "20px"}}><strong>My information</strong></div>
        <div className="health">
          <Header as='h2'>
            <Icon.Group >
              <Icon name='plus square' />
            </Icon.Group>
            {myCurrentHealth}/{myMaxHealth}
          </Header>
        </div>
        <div className="imageThree">
          <Header className="images" as='h2'>
            <Icon.Group >
              <Icon name='quidditch' />
            </Icon.Group>
            {this.state.pokemon.attack.phy}
          </Header>
          {myAttr === "fire" ?
          <Header className="images" as='h2'>
            <Icon.Group >
              <Icon name='gripfire' />
            </Icon.Group>
            {this.state.pokemon.attack.mag}
          </Header>
          : myAttr === "water" ?
          <Header className="images" as='h2'>
            <Icon.Group >
              <Icon name='theme' />
            </Icon.Group>
            {this.state.pokemon.attack.mag}
          </Header>
          : myAttr === "grass" ?
          <Header className="images" as='h2'>
            <Icon.Group >
              <Icon name='leaf' />
            </Icon.Group>
            {this.state.pokemon.attack.mag}
          </Header>
          : myAttr === "normal" ?
          <Header className="images" as='h2'>
            <Icon.Group >
              <Icon name='circle' />
            </Icon.Group>
            {this.state.pokemon.attack.mag}
          </Header>
          : myAttr === "fighting" ?
          <Header className="images" as='h2'>
            <Icon.Group >
              <Icon name='hand rock' />
            </Icon.Group>
            {this.state.pokemon.attack.mag}
          </Header>
          : myAttr === "flying" ?
          <Header className="images" as='h2'>
            <Icon.Group >
              <Icon name='earlybirds' />
            </Icon.Group>
            {this.state.pokemon.attack.mag}
          </Header>
          : myAttr === "poison" ?
          <Header className="images" as='h2'>
            <Icon.Group >
              <Icon name='flask' />
            </Icon.Group>
            {this.state.pokemon.attack.mag}
          </Header>
          : myAttr === "ground" ?
          <Header className="images" as='h2'>
            <Icon.Group >
              <Icon name='blackberry' />
            </Icon.Group>
            {this.state.pokemon.attack.mag}
          </Header>
          : myAttr === "rock" ?
          <Header className="images" as='h2'>
            <Icon.Group >
              <Icon name='chart area' />
            </Icon.Group>
            {this.state.pokemon.attack.mag}
          </Header>
          : myAttr === "bug" ?
          <Header className="images" as='h2'>
            <Icon.Group >
              <Icon name='bug' />
            </Icon.Group>
            {this.state.pokemon.attack.mag}
          </Header>
          : myAttr === "ghost" ?
          <Header className="images" as='h2'>
            <Icon.Group >
              <Icon name='snapchat ghost' />
            </Icon.Group>
            {this.state.pokemon.attack.mag}
          </Header>
          : myAttr === "steel" ?
          <Header className="images" as='h2'>
            <Icon.Group >
              <Icon name='settings' />
            </Icon.Group>
            {this.state.pokemon.attack.mag}
          </Header>
          : myAttr === "electric" ?
          <Header className="images" as='h2'>
            <Icon.Group >
              <Icon name='bolt' />
            </Icon.Group>
            {this.state.pokemon.attack.mag}
          </Header>
          : myAttr === "psychic" ?
          <Header className="images" as='h2'>
            <Icon.Group >
              <Icon name='unhide' />
            </Icon.Group>
            {this.state.pokemon.attack.mag}
          </Header>
          : myAttr === "ice" ?
          <Header className="images" as='h2'>
            <Icon.Group >
              <Icon name='snowflake' />
            </Icon.Group>
            {this.state.pokemon.attack.mag}
          </Header>
          : myAttr === "dragon" ?
          <Header className="images" as='h2'>
            <Icon.Group >
              <Icon name='chess knight' />
            </Icon.Group>
            {this.state.pokemon.attack.mag}
          </Header>
          : myAttr === "dark" ?
          <Header className="images" as='h2'>
            <Icon.Group >
              <Icon name='low vision' />
            </Icon.Group>
            {this.state.pokemon.attack.mag}
          </Header>
          : myAttr === "fairy" ?
          <Header className="images" as='h2'>
            <Icon.Group >
              <Icon name='balance scale' />
            </Icon.Group>
            {this.state.pokemon.attack.mag}
          </Header>
          : <img alt="" src="#"/>
        }
          <Header className="images" as='h2'>
            <Icon.Group >
              <Icon name='shield' />
            </Icon.Group>
            {this.state.pokemon.defence}
          </Header>
        </div>
        <div className="health">
          <Header as='h2'>
            <Icon.Group >
              <Icon name='bolt' />
            </Icon.Group>
            {this.state.costHave}/{this.state.costMax}
          </Header>
        </div>
        <div className="strong" style={{color: 'blue'}}><strong>Cards in hand: </strong></div>
        <div className="cards-in-hand">
          {
            this.state.cardsInHand.map((card, i) => {
              return (<div
                onDrag={() => this.drag(card)}
                onDragEnd={() => this.drop()}
                draggable="true">
                <Cards card={card}/>
              </div>)
            })
          }
        </div>
        <button style={{marginTop: 10}} onClick={() => this.nextRound()}>Next Round</button>
      </div>
      <ReactModal
        className=''
        isOpen={this.state.showSave}
        contentLabel="Saving">
        <div className='text'>
          <h3>Saving...</h3>
          <span>Save your game status in one of the spots below</span>
          <Button inverted color='red' onClick={() => this.setState({savingSpots: 1})}>
            Red
          </Button>
          <Button inverted color='orange' onClick={() => this.setState({savingSpots: 2})}>
            Orange
          </Button>
          <Button inverted color='yellow' onClick={() => this.setState({savingSpots: 3})}>
            Yellow
          </Button>
          <Button inverted color='olive' onClick={() => this.setState({savingSpots: 4})}>
            Olive
          </Button>
          <Button inverted color='green' onClick={() => this.setState({savingSpots: 5})}>
            Green
          </Button>
        </div>
        <button className="choiceA" onClick={() => this.saveFightStatus()}>Save</button>
        <button className="choiceA" onClick={() => this.setState({showSave: false})}>Back</button>
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
        <button className="choiceA" onClick={() => this.loadFight()}>Load</button>
        <button className="choiceA" onClick={() => this.setState({showLoad: false})}>Back</button>
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
        <button className="choiceA" onClick={() => this.loadFight()}>Load</button>
        <button className="choiceA" onClick={() => this.setState({showLoad: false})}>Back</button>
      </ReactModal>
    </div>)
  }
}

export default Fight;
