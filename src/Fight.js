import React, { Component } from 'react';
import ReactModal from 'react-modal';

import { Card, Button, Icon, Loader, Header } from 'semantic-ui-react'
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

  // componentDidMount() {
  //   this.setState({savingStatus: false});
  // }

  async saveFightStatus() {
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
      if (enemyInformation.attack.mag > 2*pokemon.attack.mag) {
        pokemon.health.currentHealth -= enemyInformation.attack.mag - 2*pokemon.attack.mag;
      } else {
        enemyInformation.health.currentHealth -= 2*pokemon.attack.mag - enemyInformation.attack.mag
      }
    } else if (this.compareMag(enemyAttr, myAttr) < 0) {
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

    return (<div>
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
            <Icon name='power' />
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
        <div style={{color: 'red'}}><strong>Enemy Information</strong></div>
        <div className="health">
          <Header as='h2'>
            <Icon.Group size='big'>
              <Icon name='plus square' />
            </Icon.Group>
            {currentHealth}/{maxHealth}
          </Header>
        </div>
        <div className="imageThree">
          <Header className="images" as='h2'>
            <Icon.Group size='big'>
              <Icon name='quidditch' />
            </Icon.Group>
            {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.phy}
          </Header>
          {enemyAttr === "fire" ?
          <Header className="images" as='h2'>
            <Icon.Group size='big'>
              <Icon name='gripfire' />
            </Icon.Group>
            {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.mag}
          </Header>
          : enemyAttr === "water" ?
          <Header className="images" as='h2'>
            <Icon.Group size='big'>
              <Icon name='theme' />
            </Icon.Group>
            {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.mag}
          </Header>
          : enemyAttr === "grass" ?
          <Header className="images" as='h2'>
            <Icon.Group size='big'>
              <Icon name='tree' />
            </Icon.Group>
            {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.attack.mag}
          </Header>
          : <img alt="" src="#"/>}
          <Header className="images" as='h2'>
            <Icon.Group size='big'>
              <Icon name='shield' />
            </Icon.Group>
            {this.state.worldMap[this.state.position[0]][this.state.position[1]].attribute.defence}
          </Header>
        </div>
        <br/>
        <div><strong>My information</strong></div>
        <div className="health">
          <Header as='h2'>
            <Icon.Group size='big'>
              <Icon name='plus square' />
            </Icon.Group>
            {myCurrentHealth}/{myMaxHealth}
          </Header>
        </div>
        <div className="imageThree">
          <Header className="images" as='h2'>
            <Icon.Group size='big'>
              <Icon name='quidditch' />
            </Icon.Group>
            {this.state.pokemon.attack.phy}
          </Header>
          {myAttr === "fire" ?
          <Header className="images" as='h2'>
            <Icon.Group size='big'>
              <Icon name='gripfire' />
            </Icon.Group>
            {this.state.pokemon.attack.mag}
          </Header>
          : myAttr === "water" ?
          <Header className="images" as='h2'>
            <Icon.Group size='big'>
              <Icon name='theme' />
            </Icon.Group>
            {this.state.pokemon.attack.mag}
          </Header>
          : myAttr === "grass" ?
          <Header className="images" as='h2'>
            <Icon.Group size='big'>
              <Icon name='tree' />
            </Icon.Group>
            {this.state.pokemon.attack.mag}
          </Header>
          : <img alt="" src="#"/>}
          <Header className="images" as='h2'>
            <Icon.Group size='big'>
              <Icon name='shield' />
            </Icon.Group>
            {this.state.pokemon.defence}
          </Header>
        </div>
        <div className="health">
          <Header as='h2'>
            <Icon.Group size='big'>
              <Icon name='bolt' />
            </Icon.Group>
            {this.state.costHave}/{this.state.costMax}
          </Header>
        </div>
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
    </div>
  )
}
}

export default Fight;
