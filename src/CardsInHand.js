import React, { Component } from 'react';

class CardsInHand extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <li>{this.props.cardsInHand.name}: {this.props.cardsInHand.description}</li>
  }
}

export default CardsInHand;
