import React, { Component } from 'react';
import Game from './Game.js';
import hash from 'object-hash';

import {Button, Container, Input} from 'semantic-ui-react';
import './css/App.css'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: "login",
      username: "",
      password: "",
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
      username: "",
      password: "",
      currentPage: "login"
    });
  }

  goRegister() {
    this.setState({
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
      username: "",
      password: "",
      currentPage: "menu"
    })
  }

  register() {
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
          this.goLogin()
        } else if (resp.err === "repetitve username") {
          window.alert("Username already exist. Pick a different one.");
        }
      })
      .catch((err) => {
        // network error
        console.log('error', err)
      })
    } else {
      alert('Username and password must not be empty!')
      this.goRegister()
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
        if (resp.status) {
          localStorage.setItem('token', resp.token);
          this.goMenu()
        } else {
          window.alert("Incorrect username or password");
          this.goLogin();
        }
      })
      .catch((err) => {
        // network error
        console.log('error', err)
      })
    } else {
      alert('Username and password must not be empty!')
      this.goLogin()
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
       <Container style={{ margin: '100px'}}>
        <h1 className="head">Register</h1>
        <div className="app">
          <label for="username" style={{marginRight: '20px'}}>Username </label>
          <Input type="text" id="username" name="username" value={this.state.username} onChange={(e) => this.usernameChange(e)}/>
        </div>
        <div className="app">
          <label for="password" style={{marginRight: '20px'}}>Password </label>
          <Input type="password" id="password" name="password" value={this.state.password} onChange={(e) => this.passwordChange(e)}/>
        </div>
        <div className="app-btn">
          <div className="app">
            <Button style={{width: '150px'}} content='Register' primary onClick={() => this.register()} />
          </div>
          <div className="app">
            <Button style={{width: '150px'}} content='Go to Login' secondary onClick={() => this.goLogin()} />
          </div>
        </div>
      </Container>)
    } else if (this.state.currentPage === "login") {
      return (
        <Container style={{ margin: '100px'}}>
        <h1 className="head">Login</h1>
        <div className="app">
          <label htmlFor="username" style={{marginRight: '20px'}}>Username </label>
          <Input type="text" id="username" name="username" value={this.state.username} onChange={(e) => this.usernameChange(e)}/>
        </div>
        <div className="app">
          <label htmlFor="password" style={{marginRight: '20px'}}>Password </label>
          <Input type="password" id="password" name="password" value={this.state.password} onChange={(e) => this.passwordChange(e)}/>
        </div>
        <div className="app-btn">
          <div className="app">
            <Button style={{width: '150px'}} content='Login' primary onClick={() => this.login(hash(this.state.username), hash(this.state.password))} />
          </div>
          <div className="app">
            <Button style={{width: '150px'}} content='Go to Register' secondary onClick={() => this.goRegister()} />
          </div>
        </div>
      </Container>)
    } else {
      return <Game logout={() => this.logout()}/>
    }
  }
}

export default App;
