import React from 'react';
import ReactDOM from 'react-dom';
var NetworkService = require("./main.js").NetworkService;
var state = require("./state.js");

class LoginComponent extends React.Component{
	constructor(props){
		super(props);
	}
	login(e){
		e.preventDefault();
		let user = $('.user').val();
		let pass = $('.pass').val();

		state.OnConnect(() => {
			alert("hi");
			NetworkService.Requests.Login({
				email: user,
				password: pass
			}, function(response){
				alert(response);
				onLoginResponse(response);			
			});
		})
	}
	render(){		
	return(
		<div className="body-login">
		<div className="login-page">
		  <div className="form-login">
		  		<h2>Dalal Street</h2>
		  		<div className="under"></div>
		  		<h3>Login</h3>		    
		    <form className="login-form">
		      <input type="text" placeholder="Username" className="user" />
		      <input type="password" placeholder="password" className="pass"/>
		      <button onClick= {this.login.bind(this)} >login</button>
		      <p className="message">Not registered? <a href="#">Click here</a></p>
		    </form>
		  </div>
		</div>
		</div>
		)
	}
}

module.exports = LoginComponent;