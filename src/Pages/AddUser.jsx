import React from "react";

export default class RegisterPage extends React.Component {
  constructor(props) {
    super(props); //Passes the props of this class instanceto the constructor of thesuper class

    this.error = React.createRef();
    this.Name = React.createRef();
    this.Email = React.createRef();
    this.Phone = React.createRef();
    this.Role = React.createRef();
    this.Password = React.createRef();
    this.Cpassword = React.createRef();
  }

  validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  validatePassword = (password) => {
    return password.length > 5;
  };

  onChangeInput = () => {
    this.error.current.textContent = "";
  };

  register = () => {
    let body = {
      Name: this.Name.current.value,
      Email: this.Email.current.value,
      Phone: this.Phone.current.value,
      Role: this.Role.current.value,
      Password: this.Password.current.value,
      //Cpassword : this.Cpassword.current.value
    };

    if (!this.validateEmail(body.Email))
      return (this.error.current.textContent = "Invalid email address!");
    if (!this.validatePassword(body.Password))
      return (this.error.current.textContent = "Invalid password!");

    fetch("/api/auth/register", {
      method: "post",
      body: JSON.stringify(body),
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.message == "User Created successfully") {
          window.location.href = "/login";
        } else {
          window.location.href = "/register";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <div className="register">
        <div className="container">
          <h3>Register a New User</h3>
          <h4 ref={this.error}></h4>
          <input
            ref={this.Name}
            onChange={this.onChangeInput}
            type="text"
            placeholder="Enter Full Name"
          />
          <input
            ref={this.Email}
            onChange={this.onChangeInput}
            type="email"
            placeholder="Enter Email Address"
          />
          <input
            ref={this.Phone}
            onChange={this.onChangeInput}
            type="text"
            placeholder="Enter Mobile Number"
          />
          <input
            ref={this.Role}
            onChange={this.onChangeInput}
            type="text"
            placeholder="Enter Role"
          />
          <input
            ref={this.Password}
            onChange={this.onChangeInput}
            placeholder="Enter Password"
          />
          <input
            ref={this.Cpassword}
            onChange={this.onChangeInput}
            type="password"
            placeholder="Confirm Password"
          />
          <button onClick={this.register}>Register</button>
        </div>
      </div>
    );
  }
}
