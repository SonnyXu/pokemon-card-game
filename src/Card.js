import React, { Component } from 'react';
import './css/Card.css'

class Card extends Component {

  render() {
    return <div className="Info">
      <div>{this.props.card.name}</div>
      <div>{this.props.card.description}</div>
      <div>Cost: {this.props.card.cost}</div>
    </div>
  }
}

export default Card;
