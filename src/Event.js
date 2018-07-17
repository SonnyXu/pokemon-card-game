import React, { Component } from 'react';
import './css/Event.css'
import Card from './Card.js';
import ReactModal from 'react-modal';


class Event extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showModal: true,
            cards: this.props.cards,
            money: this.props.money,
            pokemon: this.props.pokemon,
            cardsCanBeUsed: this.props.cardsCanBeUsed,
            allPokemon: this.props.allPokemon
        }
    }
    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    choice1A() {
      var obj = this.state.pokemon;
      obj.health.currentHealth += 5;
      if (obj.health.currentHealth > obj.health.maxHealth) {
        obj.health.currentHealth = obj.health.maxHealth
      }
      this.setState({pokemon: obj, showModal: false});
      this.props.closeModal()
      window.alert("Get 5 HP")
    }

    choice1B() {
      var obj = this.state.pokemon;
      obj.health.currentHealth += 10;
      if (obj.health.currentHealth > obj.health.maxHealth) {
        obj.health.currentHealth = obj.health.maxHealth
      }
      this.setState({pokemon: obj, showModal: false});
      this.props.closeModal()
      window.alert("Get 10 HP")
    }

    choice1C() {
      var arr1 = this.state.cards;
      var arr2 = this.state.cardsCanBeUsed;
      arr1.push({name: "defence", defence: 5, cost: 1, description: "5 armor"});
      arr2.phy.push({name: "defence", defence: 5, cost: 1, description: "5 armor"});
      this.setState({cards: arr1, cardsCanBeUsed: arr2, showModal: false});
      this.props.closeModal()
      window.alert("Get 1 card")
    }

    choice2A() {
      /*
      var money = this.state.money;
      console.log(money);
      money += 10;
      console.log(money);
      this.setState({money: this.state.money += 10, showModal: false});
      console.log(this.state.money);
      */
      this.setState({showModal: false});
      this.props.choice2A1();
      this.props.closeModal()
      window.alert("Get 10 money")
    }

    choice2B() {
      var obj = this.state.pokemon;
      obj.health.currentHealth += 10;
      if (obj.health.currentHealth > obj.health.maxHealth) {
        obj.health.currentHealth = obj.health.maxHealth
      }
      this.setState({pokemon: obj, showModal: false});
      this.props.closeModal()
      window.alert("Get 10 HP")
    }

    choice2C() {
      this.props.closeModal()
      this.setState({showModal: false});
    }

    choice3A() {
      this.setState({showModal: false});
      this.props.choice3A1();
      this.props.closeModal()
      window.alert("Get 15 money")
    }

    choice3B() {
      var arr1 = this.state.cards;
      var arr2 = this.state.cardsCanBeUsed;
      arr1.push({name: "get two cards", getCards: 2, cost: 1, description: "get 2 cards"});
      arr2.phy.push({name: "get two cards", getCards: 2, cost: 1, description: "get 2 cards"});
      this.setState({cards: arr1, cardsCanBeUsed: arr2, showModal: false});
      this.props.closeModal()
      window.alert("Get 1 card")
    }

    choice3C() {
      this.props.closeModal()
      this.setState({showModal: false});
    }
    choice4A() {
      var arr1 = this.state.cards;
      var arr2 = this.state.cardsCanBeUsed;
      arr1.push({name: "healing", healing: 3, cost: 1, description: "get 3 health"});
      arr2.phy.push({name: "healing", healing: 3, cost: 1, description: "get 3 health"});
      this.setState({cards: arr1, cardsCanBeUsed: arr2, showModal: false});
      this.props.choice4A1();
      this.props.closeModal()
      window.alert("You spent 5 money and buy a card")
    }

    choice4B() {
      var arr1 = this.state.cards;
      var arr2 = this.state.cardsCanBeUsed;
      arr1.push({name: "healing", healing: 3, cost: 1, description: "get 3 health"},{name: "healing", healing: 3, cost: 1, description: "get 3 health"});
      arr2.phy.push({name: "healing", healing: 3, cost: 1, description: "get 3 health"},{name: "healing", healing: 3, cost: 1, description: "get 3 health"});
      this.setState({cards: arr1, cardsCanBeUsed: arr2, showModal: false});
      this.props.choice4B1();
      this.props.closeModal()
      window.alert("You spent 8 money and buy two cards")
    }

    choice4C() {
      this.props.closeModal()
      this.setState({showModal: false});
    }
    choice5A() {
      this.setState({showModal: false});
      window.alert("You win directly! Congratulations!")
      this.props.closeModal()
      this.props.endGame();
    }

    choice5B() {
      this.props.closeModal()
      this.setState({showModal: false});
    }


    choice6A() {
      this.setState({showModal: false});
      this.props.choice6A1();
      this.props.closeModal()
      window.alert("Lose all money")
    }

    choice6B() {
      var allPokemon = this.state.allPokemon;
      allPokemon.splice(allPokemon.length - 1);
      if (allPokemon.length === 0) {
        this.props.endGame()
      }
      this.setState({allPokemon: allPokemon, showModal: false});
      this.props.closeModal()
      window.alert("Lose one pokemon")
    }

    choice6C() {
      this.setState({showModal: false});
      window.alert("You lose! Try Again!")
      this.props.closeModal()
      this.props.endGame();
    }

    render () {
        var index = this.getRandomInt(6)
        return <div>{ index === 0 ?
        <ReactModal
        className='event'
         isOpen={this.state.showModal}
         contentLabel="Event A">
        <div className='align'>
        <img className='image' height='175px' width='250px' src='https://vignette.wikia.nocookie.net/slay-the-spire/images/e/ea/Event_-_Big_Fish.jpg/revision/latest/scale-to-width-down/220?cb=20171204232609' />
        <div className='text'>You have to make a choice now. <br/> Which one would you take?</div>
        <button className='choiceA' onClick={() => this.choice1A()}>Banana</button>
        <button className='choiceB' onClick={() => this.choice1B()}>Donut</button>
        <button className='choiceD' onClick={() => this.choice1C()}>Box</button>
        </div>
      </ReactModal> : index === 1 ?
        <ReactModal
            className='event'
            isOpen={this.state.showModal}
            contentLabel="Event B">
            <div className='align'>
            <img className='image' height='175px' width='250px' src='https://vignette.wikia.nocookie.net/slay-the-spire/images/1/1c/Event_-_The_Cleric.jpg/revision/latest/scale-to-width-down/220?cb=20171204230636' />
            <div className='text'>Greetings my friend, I am a priest. <br/> Please receive my blessings!</div>
            <button className='choiceA' onClick={() => this.choice2A()}>Gold</button>
            <button className='choiceB' onClick={() => this.choice2B()}>HP</button>
            <button className='choiceD' onClick={() => this.choice2C()}>Refuse his blessings</button>
            </div>
            </ReactModal>
        : index === 2 ?
        <ReactModal
            className='event'
            isOpen={this.state.showModal}
            contentLabel="Event B">
            <div className='align'>
            <img className='image' height='175px' width='250px' src='https://vignette.wikia.nocookie.net/slay-the-spire/images/5/5a/Event_-_Golden_Idol.jpg/revision/latest/scale-to-width-down/220?cb=20171204235226' />
            <div className='text'>You have found a golden idol! <br/> What do you want to do next?</div>
            <button className='choiceA' onClick={() => this.choice3A()}>Take it and leave</button>
            <button className='choiceB' onClick={() => this.choice3B()}>Pray</button>
            <button className='choiceD' onClick={() => this.choice3C()}>Pretend nothing happens</button>
            </div>
            </ReactModal>
        : index === 3 ?
        <ReactModal
            className='event'
            isOpen={this.state.showModal}
            contentLabel="Event B">
            <div className='align'>
            <img className='image' height='175px' width='250px' src='https://vignette.wikia.nocookie.net/slay-the-spire/images/8/83/Event_-_Drug_Dealer.jpg/revision/latest/scale-to-width-down/220?cb=20171205001026' />
            <div className='text'>I am a drug dealer. <br/> Do you want to buy my secret potion?</div>
            <button className='choiceA' onClick={() => this.choice4A()}>Buy</button>
            <button className='choiceB' onClick={() => this.choice4B()}>Negotiate</button>
            <button className='choiceD' onClick={() => this.choice4C()}>Leave</button>
            </div>
            </ReactModal>
        : index === 4 ?
        <ReactModal
            className='event'
            isOpen={this.state.showModal}
            contentLabel="Event B">
            <div className='align'>
            <img className='image' height='175px' width='250px' src='https://www.blogcdn.com/www.joystiq.com/media/2011/03/portals.031411-530px.jpg' />
            <div className='text'>Before you is a sight that seems out of place in the alien landscape around you. <br/> Strangely placed into one of the living walls of the Beyond is <br/> an enclosed stone entrance filled with a swirling magical portal.</div>
            <button className='choiceA' onClick={() => this.choice5A()}>Enter the portal</button>
            <button className='choiceB' onClick={() => this.choice5B()}>Leave</button>
            </div>
            </ReactModal>

        : index === 5 ?
        <ReactModal
            className='event'
            isOpen={this.state.showModal}
            contentLabel="Event B">
            <div className='align'>
            <img className='image' height='175px' width='250px' src='https://vignette.wikia.nocookie.net/slay-the-spire/images/4/4c/Event_-_World_of_Goop.jpg/revision/latest/scale-to-width-down/220?cb=20171207165301' />
            <div className='text'>You have now entered the world of goop.</div>
            <button className='choiceA' onClick={() => this.choice6A()}>Lose all your money</button>
            <button className='choiceB' onClick={() => this.choice6B()}>Lose your last pokemon</button>
            <button className='choiceD' onClick={() => this.choice6C()}>Give up</button>
            </div>
            </ReactModal>
        : ''

        }</div>



}
}

export default Event;
