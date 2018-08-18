import React, { Component } from 'react';
import './css/Merchant.css'
import Cards from './Card.js';
import ReactModal from 'react-modal';


class Merchant extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: true
    }
  }
  render () {
    return <div>
      <ReactModal
        className='merchant'
        isOpen={this.state.showModal}
        contentLabel="All cards">
        <button className="Bag-Btn btn2" onClick={() => {this.props.closeModal(); this.setState({showModal: false})}}>Back</button>
        <div className='Sale-Items'>
          <div>
            <img alt="" width='650' height='200' src='https://securionpay.com/wp-content/uploads/2016/03/Online-merchant-%E2%80%93-what-is-it.svg' />
          </div>
          <h3>Items</h3>
          <div>Money You Have: {this.props.money}</div><br/>
          <div >
            <button className='btn' onClick={() => this.props.addBall()}> Pokemon Ball <br/> Price: 5</button>
          </div>
          <div style={{marginTop: 10}}>
            <button className='btn' onClick={() => this.props.addPack()}> Pokemon Healthpack <br/> Price: 10</button>
          </div>
        </div>
        {/* <div className='My-Items'>
          <div className="cardsTitle">Cards</div>
          <div className="cardsInSh"> */}
          <ul>
            {
              this.props.cards.map((cards, i) => {
                return <div className="card"><Cards card={this.props.cards[i]}/></div>
              })
            }
          </ul>
          {/* </div>
        </div> */}
      </ReactModal>
    </div>
  }
}

export default Merchant;
