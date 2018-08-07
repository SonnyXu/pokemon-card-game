import React, { Component } from 'react';
import './css/WorldMap.css';
import Area from './Area.js';

class WorldMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      worldMap: this.props.worldMap,
      position: this.props.position
    }
  }

  render() {
    if (!this.props.start) return;
    return <div className="Pokemon-World">
      {this.state.worldMap.map((row, i) => {
        return (<div>
          {row.map((col, j) => {
            return <Area area={this.state.worldMap[i][j]}
              position={i === this.state.position[0] && j === this.state.position[1]}
              move={() => this.props.move(i,j)}
              keyMove={(e) => this.checkDirection(e)}
            />
          })}
        </div>)
      })}
    </div>
  }
}

export default WorldMap;
