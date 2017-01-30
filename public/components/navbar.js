import React from 'react';
import ReactDOM from 'react-dom';
var SideBar  = require('./sidebar.js');

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

const Notification = ({title,time}) =>{
	return (
			<li><a href="#">			
			  <div className="user-new">
			  <p>{title}</p>
			  <span>{time}</span>
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
			notifications: NotificationList
		}				
	}
	render(){
		return (			
			 <div className=" border-bottom">
			    <div className="full-left">
			      <section className="full-top">
			  <button id="toggle"><i className="fa fa-arrows-alt"></i></button> 
			</section>
			<form className=" navbar-left-right">
			        <input type="text"  placeholder="Search..."  />
			        <input type="submit" value="" className="fa fa-search" />
			      </form>
			      <div className="clearfix"> </div>
			     </div>			   


			  <div className="drop-men" >
			      <ul className=" nav_1">			         
			      <li className="dropdown at-drop">
			            <a href="#" className="dropdown-toggle dropdown-at " data-toggle="dropdown"><i className="fa fa-globe"></i> <span className="number">{NotificationList.length}</span></a>
			            <ul className="dropdown-menu menu1 " role="menu">			              
			              {(this.state.notifications).map((notifications)=>{
			              		console.log(notifications.title	);
			              		return (
			              				<Notification time={notifications.time} title={notifications.title} />
			              			)
			              			
			              	})
			              }
			              
			              <li><a href="#" className="view">View all messages</a></li>
			            </ul>
			          </li>
			    <li className="dropdown">
			            <a href="#" className="dropdown-toggle dropdown-at" data-toggle="dropdown"><span className=" name-caret">-UserName-<i className="caret"></i></span><img width="60px" height="60px" src="public/images/wo.png" /></a>
			            <ul className="dropdown-menu " role="menu">
			              <li><a href="profile.html"><i className="fa fa-user"></i>Edit Profile</a></li>
			              <li><a href="inbox.html"><i className="fa fa-envelope"></i>Inbox</a></li>
			              <li><a href="calendar.html"><i className="fa fa-calendar"></i>Calender</a></li>
			              <li><a href="inbox.html"><i className="fa fa-clipboard"></i>Tasks</a></li>
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
	render(){
		return (
			<nav className="navbar-default navbar-static-top" role="navigation">
				<NavbarHeader />
				<NotificationContainer />
			</nav>
			)
	}
}

module.exports = Navbar;