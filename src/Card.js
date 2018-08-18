import React, { Component } from 'react';
import { Card, Icon, Image } from 'semantic-ui-react'
import './css/Card.css'

class Cards extends Component {
  render() {
    if (this.props.card.name === "attack") {
      return (<Card className="card">
        <Image src='https://cdn1.iconfinder.com/data/icons/unigrid-military/60/002_military_battle_attack_swords-512.png' />
        <Card.Content>
          <Card.Header>{this.props.card.name}</Card.Header>
          <Card.Meta>
            <span><Icon name="bolt" /> {this.props.card.cost}</span>
          </Card.Meta>
          <Card.Description>{this.props.card.description}</Card.Description>
        </Card.Content>
      </Card>);
    } else if (this.props.card.name === "defence"){
      return (<Card className="card">
        <Image src="https://www.fortinet.com/content/dam/fortinet/images/icons/benefits-extra/icon-benefits-defense.svg" />
        <Card.Content>
          <Card.Header>{this.props.card.name}</Card.Header>
          <Card.Meta>
            <span><Icon name="bolt" /> {this.props.card.cost}</span>
          </Card.Meta>
          <Card.Description>{this.props.card.description}</Card.Description>
        </Card.Content>
      </Card>);
    } else if (this.props.card.name === "healing"){
      return (<Card className="card">
        <Image src="http://www.chakras.info/wp-content/uploads/Heart-Chakra-Healing-1.jpg" />
        <Card.Content>
          <Card.Header>{this.props.card.name}</Card.Header>
          <Card.Meta>
            <span><Icon name="bolt" /> {this.props.card.cost}</span>
          </Card.Meta>
          <Card.Description>{this.props.card.description}</Card.Description>
        </Card.Content>
      </Card>);
    } else if (this.props.card.name === "get two cards"){
      return (<Card className="card">
        <Image src="https://img.grouponcdn.com/deal/ZdBeaYQAdAupkT9cbydfRLtqqHY/Zd-700x420/v1/c700x420.jpg" />
        <Card.Content>
          <Card.Header>{this.props.card.name}</Card.Header>
          <Card.Meta>
            <span><Icon name="bolt" /> {this.props.card.cost}</span>
          </Card.Meta>
          <Card.Description>{this.props.card.description}</Card.Description>
        </Card.Content>
      </Card>);
    } else if (this.props.card.name === "fire"){
      return (<Card className="card">
        <Image src="https://poketouch.files.wordpress.com/2017/03/fire_mouse_pokemon_cyndaquil.png" />
        <Card.Content>
          <Card.Header>{this.props.card.name}</Card.Header>
          <Card.Meta>
            <span><Icon name="bolt" /> {this.props.card.cost}</span>
          </Card.Meta>
          <Card.Description>{this.props.card.description}</Card.Description>
        </Card.Content>
      </Card>);
    } else if (this.props.card.name === "grass"){
      return (<Card className="card">
        <Image src="https://sites.google.com/site/imlovingpokemon/_/rsrc/1468755432195/types-of-pokemon/grass-type/poek%201.gif" />
        <Card.Content>
          <Card.Header>{this.props.card.name}</Card.Header>
          <Card.Meta>
            <span><Icon name="bolt" /> {this.props.card.cost}</span>
          </Card.Meta>
          <Card.Description>{this.props.card.description}</Card.Description>
        </Card.Content>
      </Card>);
    } else if (this.props.card.name === "water"){
      return (<Card className="card">
        <Image src="https://qph.fs.quoracdn.net/main-qimg-be213c42dcef92911819d18278bcd184.webp" />
        <Card.Content>
          <Card.Header>{this.props.card.name}</Card.Header>
          <Card.Meta>
            <span><Icon name="bolt" /> {this.props.card.cost}</span>
          </Card.Meta>
          <Card.Description>{this.props.card.description}</Card.Description>
        </Card.Content>
      </Card>);
    } else if (this.props.card.name === "electric"){
      return (<Card className="card">
        <Image src="http://pokemonfireredrom.net/wp-content/uploads/2017/01/electric-type-pokemon-300x267.png" />
        <Card.Content>
          <Card.Header>{this.props.card.name}</Card.Header>
          <Card.Meta>
            <span><Icon name="bolt" /> {this.props.card.cost}</span>
          </Card.Meta>
          <Card.Description>{this.props.card.description}</Card.Description>
        </Card.Content>
      </Card>);
    } else if (this.props.card.name === "bug"){
      return (<Card className="card">
        <Image src="https://pokeweakness.com/images/1892300-048venonat.png" />
        <Card.Content>
          <Card.Header>{this.props.card.name}</Card.Header>
          <Card.Meta>
            <span><Icon name="bolt" /> {this.props.card.cost}</span>
          </Card.Meta>
          <Card.Description>{this.props.card.description}</Card.Description>
        </Card.Content>
      </Card>);
    } else if (this.props.card.name === "dark"){
      return (<Card className="card">
        <Image src="https://honeysanime.com/wp-content/uploads/2016/08/Pokemon-Weavile.png" />
        <Card.Content>
          <Card.Header>{this.props.card.name}</Card.Header>
          <Card.Meta>
            <span><Icon name="bolt" /> {this.props.card.cost}</span>
          </Card.Meta>
          <Card.Description>{this.props.card.description}</Card.Description>
        </Card.Content>
      </Card>);
    } else if (this.props.card.name === "dragon"){
      return (<Card className="card">
        <Image src="https://rankedboost.com/wp-content/plugins/ice/pokemon/Gabite-Pokemon-Go.png" />
        <Card.Content>
          <Card.Header>{this.props.card.name}</Card.Header>
          <Card.Meta>
            <span><Icon name="bolt" /> {this.props.card.cost}</span>
          </Card.Meta>
          <Card.Description>{this.props.card.description}</Card.Description>
        </Card.Content>
      </Card>);
    } else if (this.props.card.name === "fairy"){
      return (<Card className="card">
        <Image src="https://pokeweakness.com/images/1891680-040wigglytuff.png" />
        <Card.Content>
          <Card.Header>{this.props.card.name}</Card.Header>
          <Card.Meta>
            <span><Icon name="bolt" /> {this.props.card.cost}</span>
          </Card.Meta>
          <Card.Description>{this.props.card.description}</Card.Description>
        </Card.Content>
      </Card>);
    } else if (this.props.card.name === "fighting"){
      return (<Card className="card">
        <Image src="https://pokeweakness.com/images/1892055-057primeape.png" />
        <Card.Content>
          <Card.Header>{this.props.card.name}</Card.Header>
          <Card.Meta>
            <span><Icon name="bolt" /> {this.props.card.cost}</span>
          </Card.Meta>
          <Card.Description>{this.props.card.description}</Card.Description>
        </Card.Content>
      </Card>);
    } else if (this.props.card.name === "flying"){
      return (<Card className="card">
        <Image src="http://cdn.smosh.com/wp-content/uploads/ftpuploads/bloguploads/1013/warp-new-pokemon-talon.jpg" />
        <Card.Content>
          <Card.Header>{this.props.card.name}</Card.Header>
          <Card.Meta>
            <span><Icon name="bolt" /> {this.props.card.cost}</span>
          </Card.Meta>
          <Card.Description>{this.props.card.description}</Card.Description>
        </Card.Content>
      </Card>);
    } else if (this.props.card.name === "ghost"){
      return (<Card className="card">
        <Image src="https://1d31c772ec21a65b0a71-0707aae3004193da193e1ad4a942592d.ssl.cf2.rackcdn.com/36351/200px-093haunter__medium.png" />
        <Card.Content>
          <Card.Header>{this.props.card.name}</Card.Header>
          <Card.Meta>
            <span><Icon name="bolt" /> {this.props.card.cost}</span>
          </Card.Meta>
          <Card.Description>{this.props.card.description}</Card.Description>
        </Card.Content>
      </Card>);
    } else if (this.props.card.name === "ground"){
      return (<Card className="card">
        <Image src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/104.png" />
        <Card.Content>
          <Card.Header>{this.props.card.name}</Card.Header>
          <Card.Meta>
            <span><Icon name="bolt" /> {this.props.card.cost}</span>
          </Card.Meta>
          <Card.Description>{this.props.card.description}</Card.Description>
        </Card.Content>
      </Card>);
    } else if (this.props.card.name === "ice"){
      return (<Card className="card">
        <Image src="http://pm1.narvii.com/6177/903b3f7a37b6afe3260ee27353183f12bb6be785_00.jpg" />
        <Card.Content>
          <Card.Header>{this.props.card.name}</Card.Header>
          <Card.Meta>
            <span><Icon name="bolt" /> {this.props.card.cost}</span>
          </Card.Meta>
          <Card.Description>{this.props.card.description}</Card.Description>
        </Card.Content>
      </Card>);
    } else if (this.props.card.name === "normal"){
      return (<Card className="card">
        <Image src="https://www.pokegoking.com/wp-content/uploads/Meowth-300x300.png" />
        <Card.Content>
          <Card.Header>{this.props.card.name}</Card.Header>
          <Card.Meta>
            <span><Icon name="bolt" /> {this.props.card.cost}</span>
          </Card.Meta>
          <Card.Description>{this.props.card.description}</Card.Description>
        </Card.Content>
      </Card>);
    } else if (this.props.card.name === "poison"){
      return (<Card className="card">
        <Image src="http://bogleech.com/pokemon/koffing.png" />
        <Card.Content>
          <Card.Header>{this.props.card.name}</Card.Header>
          <Card.Meta>
            <span><Icon name="bolt" /> {this.props.card.cost}</span>
          </Card.Meta>
          <Card.Description>{this.props.card.description}</Card.Description>
        </Card.Content>
      </Card>);
    } else if (this.props.card.name === "psychic"){
      return (<Card className="card">
        <Image src="https://honeysanime.com/wp-content/uploads/2015/10/Psychic-pokemon.jpg" />
        <Card.Content>
          <Card.Header>{this.props.card.name}</Card.Header>
          <Card.Meta>
            <span><Icon name="bolt" /> {this.props.card.cost}</span>
          </Card.Meta>
          <Card.Description>{this.props.card.description}</Card.Description>
        </Card.Content>
      </Card>);
    } else if (this.props.card.name === "rock"){
      return (<Card className="card">
        <Image src="https://pokeweakness.com/images/1892308-076golem.png" />
        <Card.Content>
          <Card.Header>{this.props.card.name}</Card.Header>
          <Card.Meta>
            <span><Icon name="bolt" /> {this.props.card.cost}</span>
          </Card.Meta>
          <Card.Description>{this.props.card.description}</Card.Description>
        </Card.Content>
      </Card>);
    } else if (this.props.card.name === "steel") {
      return (<Card className="card">
        <Image src="http://pokemongopokedex.site/static/img/pkk/steelix.png" />
        <Card.Content>
          <Card.Header>{this.props.card.name}</Card.Header>
          <Card.Meta>
            <span><Icon name="bolt" /> {this.props.card.cost}</span>
          </Card.Meta>
          <Card.Description>{this.props.card.description}</Card.Description>
        </Card.Content>
      </Card>);
    } else if (this.props.card.name === "Pokemon Ball") {
      return (<Card className="card">
        <Image src="https://images-na.ssl-images-amazon.com/images/I/510JE1W%2BdlL._SX385_.jpg" />
        <Card.Content>
          <Card.Header>{this.props.card.name}</Card.Header>
          <Card.Meta>
            <span><Icon name="bolt" /> {this.props.card.cost}</span>
          </Card.Meta>
          <Card.Description>{this.props.card.description}</Card.Description>
        </Card.Content>
      </Card>);
    } else if (this.props.card.name === "Pokemon Healthpack") {
      return (<Card className="card">
        <Image src="http://www.teamliquid.net/staff/shiroiusagi/overwatch/2016/article/0504_absolutebasics/healthpack01.png" />
        <Card.Content>
          <Card.Header>{this.props.card.name}</Card.Header>
          <Card.Meta>
            <span><Icon name="bolt" /> {this.props.card.cost}</span>
          </Card.Meta>
          <Card.Description>{this.props.card.description}</Card.Description>
        </Card.Content>
      </Card>);
    } else {
      return <div></div>
    }
  }
}

export default Cards;
