import React, { Component } from 'react';
import './css/Card.css'

class Card extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    /*
      var returned
      this.props.card.description.length + this.props.card.name.length <= 26 ?
       returned = <div className="Info">{this.props.card.name}: {this.props.card.description}</div> :
       returned = <div className="Info">
                  <div>{this.props.card.name}:</div>
                  <div>{this.props.card.description}</div>
                </div>
                */

      return <div className="Info">
                 <div>{this.props.card.name}</div>
                 <div>{this.props.card.description}</div>
                 <div>Cost: {this.props.card.cost}</div>
               </div>
    }
  }

export default Card;
