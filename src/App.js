import React, { Component } from 'react';
import Game from './Game.js';
import hash from 'object-hash';

import { Button, Container, Input, Message } from 'semantic-ui-react';
import './css/App.css'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: "login",
      username: "",
      password: "",
      err: "",
      info: null,
      fightInfo: null
    }
  }

  componentDidMount () {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:1337/checktoken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authentication' : 'bearer ' + token
        }
      })
      .then(res => res.json())
      .then(resp => {
        if (resp && resp.username) {
          this.login(resp.username, resp.password);
        }
      })
    }
  }

  usernameChange(e) {
    this.setState({
      username: e.target.value
    });
  }

  passwordChange(e) {
    this.setState({
      password: e.target.value
    });
  }

  goLogin() {
    this.setState({
      err: "",
      username: "",
      password: "",
      currentPage: "login"
    });
  }

  goRegister() {
    this.setState({
      err: "",
      username: "",
      password: "",
      currentPage: "register"
    });
  }

  goGame() {
    this.setState({
      username: "",
      password: "",
      currentPage: "game"
    });
  }

  goMenu() {
    this.setState({
      err: "",
      username: "",
      password: "",
      currentPage: "menu"
    })
  }

  register() {
    if (this.state.password.length < 6) {
      this.setState({err: "register password"});
      return;
    }
    const username = hash(this.state.username);
    const password = hash(this.state.password);
    if (username && password) {
      fetch('http://localhost:1337/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        })
      })
      .then(res => res.json())
      .then((resp) => {
        if (resp.username) {
          this.setState({err: ""});
          this.goLogin()
        } else if (resp.err === "repetitve username") {
          this.setState({err: "register username"})
        }
      })
      .catch((err) => {
        // network error
        console.log('error', err)
      })
    }
  }

  login(username, password) {
    if (username && password) {
      fetch('http://localhost:1337/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      })
      .then((res) => res.json())
      .then((resp) => {
        if (resp.status && resp.token) {
          localStorage.setItem('token', resp.token);
          this.setState({err: ""});
          this.goMenu()
        } else {
          this.setState({err: "login incorrect"})
        }
      })
      .catch((err) => {
        // network error
        console.log('error', err)
      })
    }
  }

  logout() {
    localStorage.setItem('token', JSON.stringify(null));
    this.setState({
      currentPage: "login"
    })
  }


  render() {
    if (this.state.currentPage === "register") {
      return (
        <div className="register">
        <Container>
          <h1 className="head">Register</h1>
          <div className="app">
            <label for="username" style={{marginRight: '20px'}}><strong>Username </strong></label>
            <Input type="text" id="username" name="username" value={this.state.username} onChange={(e) => this.usernameChange(e)}/>
          </div>
          <div className="app">
            <label for="password" style={{marginRight: '20px'}}><strong>Password </strong></label>
            <Input type="password" id="password" name="password" value={this.state.password} onChange={(e) => this.passwordChange(e)}/>
          </div>
          <div className="app-btn">
            <div className="app">
              <Button style={{width: '150px'}} content='Register' primary onClick={() => this.register()} />
            </div>
            <div className="app">
              <Button style={{width: '150px'}} content='Login' secondary onClick={() => this.goLogin()} />
            </div>
            {this.state.err.length > 0 ?
              <Message className="message" negative>
                <Message.Header style={{opacity: 1}}>Error</Message.Header>
                {this.state.err === "register password" ? <p style={{opacity: 1}}>Your password must be 6 characters or more</p> : <p style={{opacity: 1}}>Username already existed!</p>}
              </Message> :
              <div></div>
            }
          </div>
        </Container>
      </div>)
      } else if (this.state.currentPage === "login") {
        return (
          <div className="login">
          <Container>
            <h1 className="head">Login</h1>
            <div className="app">
              <label htmlFor="username" style={{marginRight: '20px'}}><strong>Username </strong></label>
              <Input type="text" id="username" name="username" value={this.state.username} onChange={(e) => this.usernameChange(e)}/>
            </div>
            <div className="app">
              <label htmlFor="password" style={{marginRight: '20px'}}><strong>Password </strong></label>
              <Input type="password" id="password" name="password" value={this.state.password} onChange={(e) => this.passwordChange(e)}/>
            </div>
            <div className="app-btn">
              <div className="app">
                <Button style={{width: '150px'}} content='Login' primary onClick={() => this.login(hash(this.state.username), hash(this.state.password))} />
              </div>
              <div className="app">
                <Button style={{width: '150px'}} content='Register' secondary onClick={() => this.goRegister()} />
              </div>
              {this.state.err.length > 0 ?
                <Message className="message" negative>
                  <Message.Header style={{opacity: 1}}>Error</Message.Header>
                  <p style={{opacity: 1}}>Invalid username or password!</p>
                </Message> :
                <div></div>
              }
            </div>
          </Container>
        </div>)
        } else {
          return <Game logout={() => this.logout()}/>
        }
      }
    }

    export default App;
