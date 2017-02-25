import React from 'react';
import ReactDOM from 'react-dom';
var SideBar  = require('./sidebar.js');
var NS = require('./main.js').NetworkService;
var AlertModal = require('./stockExchange.js').AlertModal;

var NotificationList = [
	{
		title: 'Hello world',
		time: '2hrs '
	},
	{
		title: 'Lol',
		time: '12hrs '
	},
];

const NavbarHeader = () => {
	return (
		       <div className="navbar-header">
		          <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
		              <span className="sr-only">Toggle navigation</span>
		              <span className="icon-bar"></span>
		              <span className="icon-bar"></span>
		              <span className="icon-bar"></span>
		          </button>
		         <h1> <a className="navbar-brand" href="index.html">Dalal</a></h1>         		         
		   </div>			         
		)
}

const Notification = ({id,title}) =>{
	return (
			<li className="notif-item"><a href="#">			
			  <div className="user-new">
			  <p className="notif-title">{title}</p>
			  <span>{id}</span>
			  </div>
			  <div className="user-new-left">
			
			  <i className="fa fa-user-plus"></i>
			  </div>
			  <div className="clearfix"> </div>
			  </a>
			  </li>
		);
}

class NotificationContainer extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			notifications: props.notifications,
			userDetails: props.userDetails,
		}				
		console.log(this.state,'lo da');
	}
	logout(){
		NS.Requests.Logout({}, function(resp){
			console.log('resp logout',resp);
			if(resp.result){
				$('#logout-success').modal('show');
				window.location = window.location.toString().replace(/#\/.*$/, "#/login");
				location.reload();
			}
			else if(resp.badRequestError){
				$('#error-modal').modal('show');
			}
			else if(resp.internalServerError){
				$('#internal-modal').modal('show');
			}
		})
	}
	render(){
		return (			
			 <div className=" border-bottom">
			    <div className="full-left">
			      <section className="full-top">
			  <button id="toggle"><i className="fa fa-arrows-alt"></i></button> 			  
			</section>			
			      <div className="clearfix"> </div>

			     </div>			   


			  <div className="drop-men" >
			      <ul className=" nav_1">			         
			      <li className="dropdown at-drop">
			            <a href="#" className="dropdown-toggle dropdown-at " data-toggle="dropdown"><i className="fa fa-globe"></i> 
			            <span className="number">{Object.keys(this.state.notifications).length}</span></a>
			            <ul className="dropdown-menu menu1 notificationsList" role="menu">			              
			              {Object.keys(this.state.notifications).sort((a,b)=>(+b) - (+a)).map((id)=>{
			              		console.log(id);
			              		return (
			              				<Notification id={id} title={this.state.notifications[id].text} />
			              			)
			              			
			              	})
			              }			              			             
			            </ul>
			          </li>
			    <li className="dropdown">
			            <a href="#" className="dropdown-toggle dropdown-at" data-toggle="dropdown"><span className=" name-caret">{this.state.userDetails.name}<i className="caret"></i></span><img width="60px" height="60px" src="public/images/wo.png" /></a>
			            <ul className="dropdown-menu " role="menu">
			              <li><a href="#" onClick={this.logout.bind(this)}><i className="fa fa-user"></i>Logout</a></li>			              
			            </ul>
			          </li>
			         
			      </ul>
			   </div>
			<div className="clearfix">
			</div>

			<SideBar />
			
		</div>
			)
	}
}

class Navbar extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			notificationsList : props.notifications,
			userDetails: props.userDetails,
		}
		console.log(this.state, props, 'notifications');
	}
	render(){
		return (
			<div>
			<nav className="navbar-default navbar-fixed-top hidden-xs" role="navigation">
				<NavbarHeader />
				<NotificationContainer notifications = {this.state.notificationsList}  userDetails = {this.state.userDetails} />

			</nav>
		
			<nav className="navbar-default 	navbar-static-top visible-xs" role="navigation">
				<NavbarHeader />
				<NotificationContainer notifications = {this.state.notificationsList}  userDetails = {this.state.userDetails} />
			</nav>
			<AlertModal id = "logout-success" message="Logout Successfully" />
			<AlertModal id = "error-modal" message="Bad Request Error" />
			<AlertModal id = "internal-modal" message="Internal Server Error" />						
			</div>
			)
	}
}

module.exports = Navbar;