import React, { Component } from 'react';
import { Card, Icon, Image } from 'semantic-ui-react'
import './css/Card.css'

class Cards extends Component {

  render() {
    // return <div className="Info">
    //   <div>{this.props.card.name}</div>
    //   <div>{this.props.card.description}</div>
    //   <div>Cost: {this.props.card.cost}</div>
    // </div>
    return (
      <Card>
    <Image src='#' />
    <Card.Content>
      <Card.Header>{this.props.card.name}</Card.Header>
      <Card.Meta>
        <span>Cost: {this.props.card.cost}</span>
      </Card.Meta>
      <Card.Description>{this.props.card.description}</Card.Description>
    </Card.Content>
    {/* <Card.Content extra>
      <a>
        <Icon name='user' />
        22 Friends
      </a>
    </Card.Content> */}
  </Card>
  )}
}

export default Cards;
