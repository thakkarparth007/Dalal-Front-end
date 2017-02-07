import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route} from 'react-router';
import { browserHistory } from 'react-router';

var testing = require('./main.js');
var Navbar = require('./navbar.js');
var LeaderBoard = require('./leaderboard.js');
var StockExchange = require('./stockExchange.js');
var Dashboard = require('./dashboard.js').dashboard;
var DashboardNav = require('./dashboard.js').dashboardNav;
var CompanyPanel = require('./dashboard.js').companyPanel;
var stocksList = require('./dashboard.js').stocksList;
var TransactionHistory = require('./transactionHistory.js');
var BuyAndSell = require('./buyAndSell.js');
var News = require('./news.js');

console.log(testing, "bhai bhai");
// var currentView = <Dashboard />;

class Home extends React.Component{
	constructor(props){
		super(props);
	}
	handleData(data){
		let result = JSON.parse(data);
		//get the result from websocket		

	}
	render(){		
		return (
			<div>				
				<Dashboard />				
			</div>
			)
		
	}
}

class LeaderBoardContainer extends React.Component{
	render(){	
		return (
			<div>
				
				<div id="page-wrapper" className="gray-bg dashbard-1">				
													<LeaderBoard />
											</div>								
				</div>
			)
		
	}
}

class CompanyProfileContainer extends React.Component{
	render(){	
		return (
			<div>
				
				<div id="page-wrapper" className="gray-bg dashbard-1">				
					<DashboardNav />
					<CompanyPanel stocksList={stocksList} />														
				</div>								
			</div>
			)
		
	}
}

class StockExchangeContainer extends React.Component{
	render(){	
		return (
			<div>
				
				<div id="page-wrapper" className="gray-bg dashbard-1">				
					<DashboardNav />
					<StockExchange />														
				</div>								
			</div>
			)
		
	}
}

class NewsContainer extends React.Component{
	render(){	
		return (
			<div>
				
				<div id="page-wrapper" className="gray-bg dashbard-1">									
					<News stocksList={stocksList} />														
				</div>								
			</div>
			)
		
	}
}

class BuyAndSellContainer extends React.Component{
	render(){	
		return (
			<div>
				
				<div id="page-wrapper" className="gray-bg dashbard-1">				
					<DashboardNav />
					<BuyAndSell stocksList={stocksList} />														
				</div>								
			</div>
			)
		
	}
}

class MortgageContainer extends React.Component{
	render(){	
		return (
			<div>
				
				<div id="page-wrapper" className="gray-bg dashbard-1">				
					<DashboardNav />
					<Mortgage stocksList={stocksList} />														
				</div>								
			</div>
			)
		
	}
}

class OrdersContainer extends React.Component{
	render(){	
		return (
			<div>
				
				<div id="page-wrapper" className="gray-bg dashbard-1">				
					<DashboardNav />
					<MyOrders />														
				</div>								
			</div>
			)
		
	}
}

class TransactionsContainer extends React.Component{
	render(){	
		return (
			<div>
				
				<div id="page-wrapper" className="gray-bg dashbard-1">				
					<DashboardNav />
					<TransactionHistory stocksList={stocksList} />														
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

ReactDOM.render(<Navbar />, document.getElementById('wrapper'));

ReactDOM.render(
	<Router  history={browserHistory}>	
	        <Route path="/" component={Home}  />
	        <Route path="/stockExchange" component={StockExchangeContainer}/>
	        <Route path="/companyProfile" component={CompanyProfileContainer}/>
	        <Route path="/news" component={NewsContainer}/>
	        <Route path="/buyAndSell" component={BuyAndSellContainer}/>
	        <Route path="/mortgage" component={MortgageContainer}/>
	        <Route path="/myOrders" component={OrdersContainer}/>
	        <Route path="/transactions" component={TransactionsContainer}/>
	        <Route path="/leaderboard" component={LeaderBoardContainer}/>
	</Router>
	,document.getElementById('inner-content'));