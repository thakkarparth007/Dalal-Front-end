import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route} from 'react-router';
import { browserHistory } from 'react-router';

var Navbar = require('./navbar.js');
var LeaderBoard = require('./leaderboard.js');
var StockExchange = require('./stockExchange.js');
var Dashboard = require('./dashboard.js').dashboard;
var DashboardNav = require('./dashboard.js').dashboardNav;
var CompanyPanel = require('./dashboard.js').companyPanel;
var stocksList = require('./dashboard.js').stocksList;
var TransactionHistory = require('./transactionHistory.js');
var BuyAndSell = require('./buyAndSell.js');

// var currentView = <Dashboard />;
var currentView = <DashboardNav />;

class MainBody extends React.Component{
	render(){
		console.log('heyss');
		console.log(Navbar);
		return (
			<div>
				<Navbar />
				<Dashboard />
			</div>
			)
		
	}
}

class Lol extends React.Component{
	render(){
		console.log('heyss');
		console.log(Navbar);
		return (
			<div>
				<Navbar />
				<div id="page-wrapper" className="gray-bg dashbard-1">
										
													<LeaderBoard />
												</div>
								
			</div>
			)
		
	}
}

/*

*/
// bids and asks = my current orders
// transaction history = type 4 = orderFill, buy from exchange, mortgage , dividend

//for company profile
/*
marketdepth histogram
buy sell stock option
<div id="page-wrapper" className="gray-bg dashbard-1">
	{currentView}
	<CompanyPanel stocksList={stocksList} />
</div>
*/



ReactDOM.render(
	<Router  history={browserHistory}>	
	        <Route path="/" component={MainBody}  />
	        <Route path="/cars" component={Lol}/>
	    </Router>
	,document.getElementById('wrapper'));