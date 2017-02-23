import React from 'react';
import ReactDOM from 'react-dom';
var NetworkService = require("./main.js").NetworkService;
var onLoginResponse = require("./main.js").onLoginResponse;
var state = require("./state.js");
var AlertModal = require('./stockExchange.js').AlertModal;
import { ThreeBounce } from 'better-react-spinkit';


class LoginComponent extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			loaded: true
		}
	}
	login(e){
		e.preventDefault();
		let user = $('.user').val();
		let pass = $('.pass').val();
		let atpos = user.indexOf("@");
	    var dotpos = user.lastIndexOf(".");
	    if (atpos<1 || dotpos<atpos+2 || dotpos+2>=user.length) {
	        $('#email-modal').modal('show');
	        return false;
	    }
		if(user == '' || pass == ''){
			$('#fill-modal').modal('show');
			return false;
		}
		else{
			this.setState({
				loaded: false
			})
			state.OnConnect(() => {			
				NetworkService.Requests.Login({
					email: user,
					password: pass
				},(response)=>{									
					this.setState({
						loaded:true
					});

					if(response.invalidCredentialsError){
						$('#invalid-modal').modal('show');
					}
					else if(response.badRequestError){
						$('#bad-modal').modal('show');
					}
					else if(response.internalServerError){
						$('#internal-modal').modal('show');
					}
					else
						onLoginResponse(response);							
				});
			})
		}
	}
	render(){		
		let invalid = <span> Please enter your Pragyan credentials. If not registered click <a target="_blank" href="https://www.pragyan.org" >Here</a> </span>;
	if(this.state.loaded){		
		return(
			<div className="body-login">
			<div className="login-page">
			  <div className="form-login">
			  		<h2>Dalal Street</h2>
			  		<div className="under"></div>
			  		<h3>Login</h3>		    
			    <form className="login-form"  onsubmit = ' return false;'>
			      <input type="email" placeholder="Username" className="user" />
			      <input type="password" placeholder="password" className="pass"/>
			      <button onClick = {this.login.bind(this)}>login</button>
			      <p className="message">Not registered? <a href="https://www.pragyan.org" target="_blank">Click here</a></p>
			    </form>
			  </div>
			</div>
			<AlertModal id = "invalid-modal" message={invalid}	/>
			<AlertModal id = "bad-modal" message="Bad Request Error. Please try again later." />
			<AlertModal id = "internal-modal" message="Internal Server Error. Please try again later." />
			<AlertModal id = "fill-modal" message="Kindly fill all the fields!" />
			<AlertModal id = "email-modal" message="Enter correct Email address!" />
			</div>
			)
		}
	else{
		return (
			<div className="body-login">
			<div className="login-page">
				<div className="login-preloader">
					     <ThreeBounce size={15} color='white' />	
				</div>
			</div>
			</div>
			)
	}
	}
}

module.exports = LoginComponent;