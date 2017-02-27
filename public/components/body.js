import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route} from 'react-router';
import { hashHistory } from 'react-router';
import { ThreeBounce } from 'better-react-spinkit'
// var Spinner = require('react-spinkit');

var state = require('./state.js');
var Navbar = require('./navbar.js');
var LeaderBoard = require('./leaderboard.js');
var StockExchange = require('./stockExchange.js').StockExchange;
var Dashboard = require('./dashboard.js').dashboard;
var DashboardNav = require('./dashboard.js').dashboardNav;
var CompanyPanel = require('./dashboard.js').companyPanel;
var TransactionHistory = require('./transactionHistory.js');
var BuyAndSell = require('./buyAndSell.js');
var News = require('./news.js');
var Mortgage = require('./mortgagePanel.js');
var MyOrders = require('./myOrders.js');
var LoginComponent = require('./login.js');
var NetworkService = require('./main.js').NetworkService;

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
			if(!this.state.IsConnected && !this.state.IsLoggedIn){
					return (
							<div className="home-preloader">
								      <ThreeBounce size={15} color='blue' />	
							</div>
						)
			}	
			else			
				return (
						<div>		
							<Navbar notifications = {this.state.Notifications} userDetails = {this.state.User} />							
							<Dashboard state={this.state} />				
						</div>		
					)
		}	
		
}

class LoginComponentContainer extends React.Component{
	constructor(props){		
		super(props);
		this.state = state;
		state.Listen(state => {			
			this.setState(state);
		});
	}
	render(){
		if(!this.state.IsConnected && !this.state.IsLoggedIn) {
				return (
						<div className="home-preloader">
							      <ThreeBounce size={15} color='blue' />	
						</div>
					)
			}	
			else{
				return (
					<LoginComponent />
					)
			}
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
		if(!this.state.IsConnected && !this.state.IsLoggedIn){
					return (
							<div className="home-preloader">
								      <ThreeBounce size={15} color='blue' />	
							</div>
						)
			}	
			else			
				return (
						<div>
							<Navbar notifications = {this.state.Notifications} userDetails = {this.state.User} />							
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
		if(!this.state.IsConnected && !this.state.IsLoggedIn){
					return (
							<div className="home-preloader">
								      <ThreeBounce size={15} color='blue' />	
							</div>
						)
			}	
			else					
				return (
					<div>		
						<Navbar notifications = {this.state.Notifications} userDetails = {this.state.User} />									
						<div id="page-wrapper" className="gray-bg dashbard-1">				
							<DashboardNav AllStocksList={this.state.AllStockById} userDetails = {this.state.User} marketStatus = {this.state.MarketOpen} />
							<CompanyPanel stocksList={this.state.AllStockById} companyProfile = {this.state.CompanyProfile} userStocks = {this.state.UserStockById} marketEvents = {this.state.MarketEvents} marketDepth = {this.state.MarketDepth} />														
						</div>								
					</div>
					)
				
	}
}

								// React.cloneElement(tockExchange, {
								// 	stocksList: state.AllStocksList,
								// 	status: state.ExchangeUnderProcess,
								// 	userStocks: state.UserStockById,


class StockExchangeContainer extends React.Component{
	constructor(props){
		super(props);
		this.state = state;
		state.Listen(this.setState.bind(this));
	}
	render(){			
		if(!this.state.IsConnected && !this.state.IsLoggedIn){
					return (
							<div className="home-preloader">
								      <ThreeBounce size={15} color='blue' />	
							</div>
						)
			}	
			else			
				return (
					<div>			
						<Navbar notifications = {this.state.Notifications} userDetails = {this.state.User} />							
						<div id="page-wrapper" className="gray-bg dashbard-1">				
							<DashboardNav AllStocksList={this.state.AllStockById} userDetails = {this.state.User} marketStatus = {this.state.MarketOpen} />
														<StockExchange stocksList = {this.state.AllStockById} status = {this.state.Status.ExchangeUnderProcess} userStocks = {this.state.UserStockById}/>																					
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
		if(!this.state.IsConnected && !this.state.IsLoggedIn){
					return (
							<div className="home-preloader">
								      <ThreeBounce size={15} color='blue' />	
							</div>
						)
			}	
			else						
				return (
					<div>
						<Navbar notifications = {this.state.Notifications} userDetails = {this.state.User} />							
						<div id="page-wrapper" className="gray-bg dashbard-1">									
							<News marketEvents={this.state.MarketEvents} />														
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
		if(!this.state.IsConnected && !this.state.IsLoggedIn){
					return (
							<div className="home-preloader">
								      <ThreeBounce size={15} color='blue' />	
							</div>
						)
			}	
			else						
				return (
					<div>
						<Navbar notifications = {this.state.Notifications} userDetails = {this.state.User} />							
						<div id="page-wrapper" className="gray-bg dashbard-1">				
							<DashboardNav AllStocksList={this.state.AllStockById} userDetails = {this.state.User} marketStatus = {this.state.MarketOpen} />
							<BuyAndSell stocksList={this.state.AllStockById} status = {this.state.Status.BidOrAskUnderProcess} />														
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
		if(!this.state.IsConnected && !this.state.IsLoggedIn){
					return (
							<div className="home-preloader">									
								      <ThreeBounce size={15} color='blue' />	
							</div>
						)
			}	
			else			
				return (
					<div>
						<Navbar notifications = {this.state.Notifications} userDetails = {this.state.User} />											
						<div id="page-wrapper" className="gray-bg dashbard-1">				
							<DashboardNav AllStocksList={this.state.AllStockById} userDetails = {this.state.User} marketStatus = {this.state.MarketOpen} />
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
		if(!this.state.IsConnected && !this.state.IsLoggedIn){
					return (
							<div className="home-preloader">
								      <ThreeBounce size={15} color='blue' />	
							</div>
						)
			}	
		else				
			return (
				<div>		
					<Navbar notifications = {this.state.Notifications} userDetails = {this.state.User} />									
					<div id="page-wrapper" className="gray-bg dashbard-1">				
						<DashboardNav AllStocksList={this.state.AllStockById} userDetails = {this.state.User} marketStatus = {this.state.MarketOpen} />
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
		if(!this.state.IsConnected && !this.state.IsLoggedIn){
					return (
							<div className="home-preloader">
								      <ThreeBounce size={15} color='blue' />	
							</div>
						)
			}	
			else			
				return (
					<div>	
						<Navbar notifications = {this.state.Notifications} userDetails = {this.state.User} />										
						<div id="page-wrapper" className="gray-bg dashbard-1">				
							<DashboardNav AllStocksList={this.state.AllStockById} userDetails = {this.state.User} marketStatus = {this.state.MarketOpen} />
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

// class NavbarContainer extends React.Component{
// 	constructor(props){
// 		super(props);
// 		this.state = state;
// 		state.Listen(this.setState.bind(this));
// 	}
// 	render(){

// 		return (
// 			<Navbar notifications = {this.state.Notifications} userDetails = {this.state.User} />
// 			)
// 	}
// }

function requireAuth(nextState, replace) {
	if(state.IsConnected && !state.IsLoggedIn) {
		replace({
			pathname: "/login"
		})
	}
}

var mainComponent = <Router history={hashHistory}>	
    <Route path="/login" component={LoginComponentContainer}></Route>
    <Route path="/" onEnter={requireAuth} component={Home} />
    <Route path="/stockExchange" onEnter={requireAuth} component={StockExchangeContainer}/>
    <Route path="/companyProfile" onEnter={requireAuth} component={CompanyProfileContainer}/>
    <Route path="/news" onEnter={requireAuth} component={NewsContainer}/>
    <Route path="/buyAndSell" onEnter={requireAuth} component={BuyAndSellContainer}/>
    <Route path="/mortgage" onEnter={requireAuth} component={MortgageContainer}/>            
    <Route path="/myOrders" onEnter={requireAuth} component={MyOrdersContainer}/>
    <Route path="/transactions" onEnter={requireAuth} component={TransactionsContainer}/>
    <Route path="/leaderboard" onEnter={requireAuth} component={LeaderBoardContainer}/>    
</Router>



// ReactDOM.render(<NavbarContainer />, document.getElementById('wrapper'));
ReactDOM.render(
			mainComponent
			,document.getElementById('inner-content'))

/*if(state.IsLoggedIn)
	{ReactDOM.render(<NavbarContainer />, document.getElementById('wrapper'));
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
	
		ReactDOM.render(
			mainComponent
			,document.getElementById('inner-content'));}
else
	{ReactDOM.render(
			<LoginComponentContainer />,
			document.getElementById('inner-content')
			);
	}
*/

window.Home = Home;
window.mainComponent = mainComponent
module.exports = mainComponent;