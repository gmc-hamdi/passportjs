import React, { Component } from "react";
import axios from "axios";
export default class App extends Component {
  state = {
    email: "",
    password: "",
    loginR: "",
    emailR: "",
    passwordR: ""
  };
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  login = () => {
    const { email, password } = this.state;
    axios
      .post("http://localhost:5000/login", { email, password })
      .then(res => {
        console.log(res);
        localStorage.setItem("token", res.data.token);
      })
      .catch(err => console.log(err.response.data));
  };
  register = () => {
    const { loginR, emailR, passwordR } = this.state;
    axios
      .post("http://localhost:5000/register", {
        name: loginR,
        email: emailR,
        password: passwordR
      })
      .then(res => console.log(res))
      .catch(err => console.log(err.response.data));
  };
  logout = () => {
    localStorage.removeItem("token");
  };
  configtoken = () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-type": "application/json"
      }
    };
    if (token) {
      config.headers["Authorization"] = token;
    }
    // const config = { headers: { common: { Authorization: token } } };
    return config;
  };
  componentDidMount() {
    console.log(this.configtoken());
    axios
      .get("http://localhost:5000/current", this.configtoken())
      .then(res => console.log(res.data))
      .catch(err => console.log(err.response.data));
  }
  render() {
    return (
      <div>
        <div>
          <input
            type="text"
            name="email"
            onChange={this.handleChange}
            placeholder="email"
          />
          <input
            type="text"
            name="password"
            onChange={this.handleChange}
            placeholder="password"
          />
          <input type="button" onClick={this.login} value="Login" />
        </div>
        <input
          type="text"
          name="loginR"
          onChange={this.handleChange}
          placeholder="login"
        />
        <input
          type="text"
          name="emailR"
          onChange={this.handleChange}
          placeholder="email"
        />
        <input
          type="text"
          name="passwordR"
          onChange={this.handleChange}
          placeholder="password"
        />
        <input type="button" onClick={this.register} value="Register" />
        <input type="button" onClick={this.logout} value="logout" />
      </div>
    );
  }
}
