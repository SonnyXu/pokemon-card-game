import React, { Component } from 'react';
import './css/Area.css'

class Area extends Component {

  render() {
    if (!this.props.area.discovered) {
      return <button className="Area-Btn-Undiscovered"></button>
    } else {
      if (this.props.position) {
        return <button className="Area-Btn-Position">
          <img alt="" src='http://img0.imgtn.bdimg.com/it/u=780249377,1485589615&fm=27&gp=0.jpg'/>
        </button>
      } else if (this.props.area.attribute.name === "end") {
        return <button className="Area-Btn-StartEnd" onClick={() => this.props.move()}>
          <img alt="" src='https://visitlead.com/images/blog/exit-intent2.jpg' />
        </button>
      } else if (this.props.area.attribute.name === "rock") {
        return <button className="Area-Btn-Rock">
          <img alt="" src='https://vignette.wikia.nocookie.net/grand-dad/images/5/50/Wiki-background/revision/latest?cb=20160322163134'/>
        </button>
      } else if (this.props.area.attribute.name === "pokemon") {
        return <button className="Area-Btn-Pokemon" onClick={() => this.props.move()}>
          <img alt="" src='https://art.pixilart.com/e31381479f0aa74.png' />
        </button>
      } else if (this.props.area.attribute.name === 'merchant') {
        return <button className="Area-Btn-Merchant" onClick={() => this.props.move()}>
          <img alt="" src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTys2-U1cAWnC2yFXS0ZDfdD_4cMWcKjv6OYbTflxe2TIxFlWAo' />
        </button>
      } else if (this.props.area.attribute.name === 'event') {
        return <button className='Area-Btn-Random' onClick={() => this.props.move()}>
          <img alt="" src='https://cdn.dribbble.com/users/1037956/screenshots/4456763/800x600_1x.png'/>
        </button>
      } else {
        return <button className="Area-Btn" onClick={() => this.props.move()}></button>
      }
    }
  }
}

export default Area;
