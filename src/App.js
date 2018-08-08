import React, { Component } from 'react';
import Game from './Game.js';
import hash from 'object-hash';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: "login",
      username: "",
      password: "",
      info: null
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
        console.log(resp);
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
        if (resp.token) {
          localStorage.setItem('token', resp.token);
          this.setState({info: resp.info});
          this.goGame()
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
      return <div>
        <h1>Register</h1>
        <div class="username">
          <label for="username">Username: </label>
          <input type="text" id="username" name="username" value={this.state.username} onChange={(e) => this.usernameChange(e)}/>
        </div>
        <div class="password" style={{marginTop: '15px'}}>
          <label for="password">Password: </label>
          <input type="password" id="password" name="password" value={this.state.password} onChange={(e) => this.passwordChange(e)}/>
        </div>
        <div style={{marginTop: '15px'}}>
          <button style={{ marginRight: '10px'}} onClick={() => this.register()}>Register</button>
          <button onClick={() => this.goLogin()}>Go to Login</button>
        </div>
      </div>
    } else if (this.state.currentPage === "login") {
      return <div>
        <h1>Login</h1>
        <div>
          <label htmlFor="username">Username: </label>
          <input type="text" id="username" name="username" value={this.state.username} onChange={(e) => this.usernameChange(e)}/>
        </div>
        <div style={{marginTop: '15px'}}>
          <label htmlFor="password">Password: </label>
          <input type="password" id="password" name="password" value={this.state.password} onChange={(e) => this.passwordChange(e)}/>
        </div>
        <div style={{marginTop: '15px'}}>
          <button style={{ marginRight: '10px'}} onClick={() => this.login(hash(this.state.username), hash(this.state.password))}>Login</button>
          <button onClick={() => this.goRegister()}>Go to Register</button>
        </div>
      </div>
    } else {
      return <Game logout={() => this.logout()} info={this.state.info}/>
    }
  }
}

export default App;
