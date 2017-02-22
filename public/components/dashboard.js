import React from 'react';
import ReactDOM from 'react-dom';
import {observer} from 'mobx-react';
import {observable} from 'mobx';

var CompanyPanel = require('./companyPanel.js');
var MortgagePanel = require('./mortgagePanel.js');
var state = require('./state.js');
// items required from user
// market Events
// net cash
// stock
// wealth

//this is the complete list of stocks present in market.

//stock state needs to be changed later

class StocksList extends React.Component{
	constructor(props){
		super(props);		
		this.state = {
			stocks: this.props.stocks
		}
	}	
	render(){	
	return (
			<marquee className="stocks-list">
			{	Object.keys(this.state.stocks).map((x)=>{
				let stock = (this.state.stocks)[x];

				let icon;
				if(stock.upOrDown){
					icon = <i className="fa fa-sort-asc" aria-hidden="true"></i>;
				}
				else{
					icon = <i className="fa fa-sort-desc" aria-hidden="true"></i>;	
				}
				return (
					<span className="stock-item"> 
						<a className="stock-name">
							{stock.shortName}
						</a>
						<a className="stock-state">
							{icon}
							{stock.dayHigh}							
						</a>
						<a className="stock-cost">
							Rs.{stock.currentPrice}
						</a>
					</span>
					)
			})}
			</marquee>		
		);
	}
}

const TransactionPanel = ({userStocks,stocksList}) =>{		
	let counter = 1;
	console.log(userStocks,stocksList,'hi dude');
	return (	
		<div className="table-responsive">          
		  <table className="table table-hover">
		    <thead>
		      <tr>
		        <th>ID</th>
		        <th>Stock</th>
		        <th>All-Time Low</th>
		        <th>All-Time High</th>
		        <th>Today's Low</th>
		        <th>Today's High</th>
		        <th>Price</th>
		        <th>Stocks In Market</th>
		        <th>Stocks Brought</th>
		        <th>Total Stock Price</th>
		      </tr>
		    </thead>
		    <tbody>
		    
		    {
		    		    	Object.keys(userStocks).map(stockId => {
		    		    	console.log(stockId,stocksList,stocksList[stockId],'sab tera')
		    		    	let stock = userStocks[stockId];		    	
		    		    	// console.log(stock,'yeh hai stock bhaiya',stocksList,userStocks,stockId);		    
		    		    	let temp ;		    	
		    		    	// console.log(Object.keys(stocksList),stocksList, "bhai kyun");
		    		    	Object.keys(stocksList).map(uStockId => {
		    		    		let x = stocksList[uStockId];
		    		    		// console.log('helloworld')		    		
		    		    		if(x.id==stockId){
		    		    			temp = x;	  			
		    		    		}
		    		    	});

		    		    	// console.log(temp,'yehi hu mai final valla');
		    		    	if(temp!=0)
		    		    		return (
		    		    			<tr>
		    		    			  <td>{temp.id}</td>
		    		    			  <td>{temp.fullName}</td>
		    		    			  <td>{temp.allTimeLow}</td>
		    		    			  <td>{temp.allTimeHigh}</td>
		    		    			  <td>{temp.dayLow}</td>
		    		    			  <td>{temp.dayHigh}</td>
		    		    			  <td>{temp.currentPrice}</td>
		    		    			  <td>{temp.stocksInMarket}</td>
		    		    			  <td>{userStocks[stockId]}</td>		    			  
		    		    			  <td> {temp.currentPrice*userStocks[stockId]} </td>
		    		    			</tr>
		    		    			);
		    		    	else
		    		    		return(<tr></tr>)
		    		    })		    
		    		}		
		      
		    </tbody>
		  </table>
		  </div>
		)
}

const DashboardNav = ({AllStocksList,userDetails}) => {
	let stocksList;
	console.log( AllStocksList,'yahi hu ,oa');
	console.log( userDetails.cash ,'diufodiodji');
	return (
			    <div className="dash-nav">
			       <div className="content-main">			 			  		
					    <div className="banner">					   
							<StocksList stocks={AllStocksList} />	
					    </div>
					</div>

					<div className="content-top">
										
						
						<h3 className="dash-head">Your Profile</h3>
						<div className="row">
							<div className="col-md-10 ">
								<div className="content-top-1 col-md-3 col-md-offset-1 top-content box-2 col-xs-6 col-xs-offset-3">
									
									<label><i class="fa fa-inr" aria-hidden="true"></i>{userDetails.cash}</label>
									<p>Total Cash</p>
									
																
								 <div className="clearfix"> </div>
								</div>

								<div className="content-top-1 col-md-3 col-md-offset-1 top-content box-3 col-xs-6 col-xs-offset-3">
									
									<label><i class="fa fa-inr" aria-hidden="true"></i>{userDetails.stockWorth}</label>
									<p>Stock Worth</p>
									
																
								 <div className="clearfix"> </div>
								</div>

								<div className="content-top-1 col-md-3 col-md-offset-1 top-content box-1 col-xs-6 col-xs-offset-3">
									
									<label><i class="fa fa-inr" aria-hidden="true"></i>{userDetails.total}</label>
									<p>Net Worth</p>
									
																
								 <div className="clearfix"> </div>
								</div>

							</div>
							</div>
					</div>							
					

					

				</div>					    
		);
}


class Dashboard extends React.Component{
	constructor(props){
		super(props);		
		this.state = {
			userStocks : state.UserStockById,
			stocksList : state.AllStockById,
			userDetails : state.User,
			mortgagedStocks: state.MortgagedStocks,			
		}
		console.log(this.state,'pelam banda',props);
	}	
	componentWillReceiveProps(newProps){
		console.log(newProps)
		this.setState({
			mortgagedStocks : newProps.state.MortgagedStocks,
		});

		console.log(newProps.state.MortgagedStocks,'checking')
	}
	render(){
		return (
			<div className="dash-main">
			{this.state.userDetails.cash}
			<div id="page-wrapper" className="gray-bg dashbard-1">				
				<DashboardNav AllStocksList={this.state.stocksList} userDetails = {this.state.userDetails} />
				<div className="content-top">
						<TransactionPanel userStocks = {this.state.userStocks} stocksList={this.state.stocksList} />
						<CompanyPanel stocksList={this.state.stocksList} />
						<MortgagePanel stocksList={this.state.stocksList} userStocks={this.state.userStocks} mortgagedStocks = {this.state.mortgagedStocks} />
				</div>
			</div>
			</div>
			)
	}
}

module.exports = {
	dashboardNav: DashboardNav,	
	dashboard:Dashboard,
	companyPanel: CompanyPanel,	
};

