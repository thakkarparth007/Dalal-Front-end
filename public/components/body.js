import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route} from 'react-router';
import { hashHistory } from 'react-router';

var state = require('./state.js');
var Navbar = require('./navbar.js');
var LeaderBoard = require('./leaderboard.js');
var StockExchange = require('./stockExchange.js');
var Dashboard = require('./dashboard.js').dashboard;
var DashboardNav = require('./dashboard.js').dashboardNav;
var CompanyPanel = require('./dashboard.js').companyPanel;
var TransactionHistory = require('./transactionHistory.js');
var BuyAndSell = require('./buyAndSell.js');
var News = require('./news.js');
var Mortgage = require('./mortgagePanel.js');
var MyOrders = require('./myOrders.js');

import {observer} from 'mobx-react';

// var currentView = <Dashboard />;
console.log(state,'wtf is happening?	');


// @observer
// class Home extends React.Component{	
// 	render(){			
// 		var componentState = {
// 					User: state.User,
// 					UserStockById: state.UserStockById,					
// 					Transactions: state.Transactions,
// 					AllStockById : {}
// 				}							
// 		Object.keys(state.AllStockById).map((x)=>{
// 			let y = (state.AllStockById)[x];
// 			(componentState.AllStockById[x] = y);			
// 		});		
// 		return (
// 			<div>				
// 				<Dashboard state={state} />				
// 			</div>
// 			)
		
// 	}
// }

class Home extends React.Component{	
	constructor(props){
		super(props);
		this.state = state;
		state.Listen(this.setState.bind(this));
		console.log(this.state,'kya problme hai?')
	}
	render(){					
		return (
			<div>				
				<Dashboard state={this.state} />				
			</div>
			)
		
	}
}

class LeaderBoardContainer extends React.Component{
	constructor(props){
		super(props);
		this.state = state;
		state.Listen(this.setState.bind(this));
		console.log(this.state,'yeh tune kya kiya!');
	}
	render(){	
		return (
			<div>
				
				<div id="page-wrapper" className="gray-bg dashbard-1">				
					<LeaderBoard leaderboardDetails = {this.state.Leaderboard} userDetails = {this.state.User} />
				</div>								
			</div>
			)
		
	}
}

class CompanyProfileContainer extends React.Component{
	constructor(props){
		super(props);
		this.state = state;
		state.Listen(this.setState.bind(this));
	}
	render(){		
		return (
			<div>				
				<div id="page-wrapper" className="gray-bg dashbard-1">				
					<DashboardNav AllStocksList={this.state.AllStockById} userDetails = {this.state.User} />
					<CompanyPanel stocksList={this.state.AllStockById} />														
				</div>								
			</div>
			)
		
	}
}

class StockExchangeContainer extends React.Component{
	constructor(props){
		super(props);
		this.state = state;
		state.Listen(this.setState.bind(this));
	}
	render(){	
		return (
			<div>			
				<div id="page-wrapper" className="gray-bg dashbard-1">				
					<DashboardNav AllStocksList={this.state.AllStockById} userDetails = {this.state.User} />
					<StockExchange stocksList = {this.state.AllStockById} />														
				</div>								
			</div>
			)
		
	}
}

class NewsContainer extends React.Component{
	constructor(props){
		super(props);
		this.state = state;
		state.Listen(this.setState.bind(this));
	}
	render(){			
		return (
			<div>
				
				<div id="page-wrapper" className="gray-bg dashbard-1">									
					<News stocksList={this.state.AllStockById} />														
				</div>								
			</div>
			)
		
	}
}

class BuyAndSellContainer extends React.Component{
	constructor(props){
		super(props);
		this.state = state;
		state.Listen(this.setState.bind(this));
	}
	render(){			
		return (
			<div>
				
				<div id="page-wrapper" className="gray-bg dashbard-1">				
					<DashboardNav AllStocksList={this.state.AllStockById} userDetails = {this.state.User} />
					<BuyAndSell stocksList={this.state.AllStockById} />														
				</div>								
			</div>
			)
		
	}
}

class MyOrdersContainer extends React.Component{
	constructor(props){
		super(props);
		this.state = state;
		state.Listen(this.setState.bind(this));
	}
	render(){			
		return (
			<div>
				
				<div id="page-wrapper" className="gray-bg dashbard-1">				
					<DashboardNav AllStocksList={this.state.AllStockById} userDetails = {this.state.User} />
					<MyOrders orders={this.state.MyOrders} />														
				</div>								
			</div>
			)
		
	}
}

class MortgageContainer extends React.Component{
	constructor(props){
		super(props);
		this.state = state;
		state.Listen(this.setState.bind(this));
		console.log(this.state,'pelam banda')
	}
	render(){	
		return (
			<div>				
				<div id="page-wrapper" className="gray-bg dashbard-1">				
					<DashboardNav AllStocksList={this.state.AllStockById} userDetails = {this.state.User} />
					<Mortgage stocksList={this.state.AllStockById} userStocks={this.state.UserStockById} mortgagedStocks = {this.state.MortgagedStocks} />														
				</div>								
			</div>
			)
		
	}
}

class TransactionsContainer extends React.Component{
	constructor(props){
		super(props);
		this.state = state;
		state.Listen(this.setState.bind(this));
	}
	render(){	
		return (
			<div>				
				<div id="page-wrapper" className="gray-bg dashbard-1">				
					<DashboardNav AllStocksList={this.state.AllStockById} userDetails = {this.state.User} />
					<TransactionHistory stocksList={this.state.AllStockById} transactionHistory = {this.state.Transactions} />														
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

class NavbarContainer extends React.Component{
	constructor(props){
		super(props);
		this.state = state;
		state.Listen(this.setState.bind(this));
	}
	render(){
		return (
			<Navbar notifications = {this.state.Notifications} userDetails = {this.state.User} />
			)
	}
}

ReactDOM.render(<NavbarContainer />, document.getElementById('wrapper'));

var mainComponent = <Router history={hashHistory}>	
        <Route path="/" component={Home}  />
        <Route path="/stockExchange" component={StockExchangeContainer}/>
        <Route path="/companyProfile" component={CompanyProfileContainer}/>
        <Route path="/news" component={NewsContainer}/>
        <Route path="/buyAndSell" component={BuyAndSellContainer}/>
        <Route path="/mortgage" component={MortgageContainer}/>        
        <Route path="/transactions" component={TransactionsContainer}/>
        <Route path="/myOrders" component={MyOrdersContainer}/>
        <Route path="/leaderboard" component={LeaderBoardContainer}/>
</Router>;

module.exports = ReactDOM.render(
	mainComponent
	,document.getElementById('inner-content'));

window.Home = Home;
window.mainComponent = mainComponent
module.exports = mainComponent;