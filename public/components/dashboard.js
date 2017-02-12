import React from 'react';
import ReactDOM from 'react-dom';
var CompanyPanel = require('./companyPanel.js');
var MortgagePanel = require('./mortgagePanel.js');
// items required from user
// market Events
// net cash
// stock
// wealth

//this is the complete list of stocks present in market.
var stocks = [
		{
			id: 1,
			shortName: 'Pragyan',
			fullName: 'Pragyan',
			currentPrice: 100,
			dayHigh: 109,
			dayLow: 90,
			allTimeHigh: 120,
			allTimeLow: 76,
			stocksInExchange: 10,
			stocksInMarket: 150,
			upOrDown: true,
			createdAt: '11-22-63',
			updatedAt: '13-22-44'
		},
		{
			id: 2,
			shortName: 'Festember',
			fullName: 'Festember',
			currentPrice: 320,
			dayHigh: 339,
			dayLow: 300,
			allTimeHigh: 400,
			allTimeLow: 290,
			stocksInExchange: 50,
			stocksInMarket: 200,
			upOrDown: false,
			createdAt: '11-22-63',
			updatedAt: '13-22-44'
		}
	];
//stock state needs to be changed later

//stocks owned by user,will be required in transaction panel
var userStocks = [
		{
			id: 1,
			userId: 112,
			stockId: 1,
			type: 4,
			stockQuantity: 100,
			price: 300,
			createdAt: '11-22-63',			
		}
	];
var stockTemp = stocks;

//appending userdata to stockTemp
userStocks.map((e)=>{
	console.log('lol');
	console.log(e.stockQuantity);
	for(let i=0;i<stockTemp.length;i++){
		console.log(stockTemp[i].id + '  ' + e.id);
		if(stockTemp[i].id == e.id){
			console.log('llss');
			stockTemp[i].stockQuantity = e.stockQuantity;
			break;
		}
	}
	console.log('ll');
	console.log(stockTemp);
})

const StocksList = ({stocks}) => {
	console.log(stocks,'uououo');
	return (
			<marquee className="stocks-list">
			{	Object.keys(stocks).map((x)=>{
				let stock = stocks[x];

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

const TransactionPanel = ({userStocks,stocksList}) =>{	
	console.log(userStocks['1'],'test');
	let counter = 1;
	userStocks.keys
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
		    {Object.keys(userStocks).map(stockId => {
		    	let stock = userStocks[stockId];		    	
		    	console.log(stock,'yeh hai stock',stocksList);		    
		    	let temp;		    	
		    	Object.keys(stocksList).map(uStockId => {
		    		let x = stocksList[uStockId];

		    		console.log(x,'lolll', stock.id);
		    		if(x.id==stock.id){
		    			temp = x;	  			
		    		}
		    	});

		    	console.log(temp,'yehi hu mai');
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
		    			  <td>{stock.stockQuantity}</td>		    			  
		    			  <td></td>
		    			</tr>
		    			);
		    	else
		    		return(<tr></tr>)
		    })}	
		      
		    </tbody>
		  </table>
		  </div>
		)
}

const DashboardNav = ({AllStocksList,userDetails}) => {
	let stocksList;
	console.log(AllStocksList,'yahi hu ,oa');
	return (
			    <div>
			       <div className="content-main">			 			  		
					    <div className="banner">					   
							<StocksList stocks={AllStocksList} />	
					    </div>
					</div>

					<div className="content-top">
										
						
						<h3 className="dash-head">Your Profile</h3>
						<div className="row">
							<div className="col-md-10 ">
								<div className="content-top-1 col-md-3 col-md-offset-1 top-content box-1 col-xs-6 col-xs-offset-3">
									
									<label>{userDetails.cash}</label>
									<p>Total Cash</p>
									
																
								 <div className="clearfix"> </div>
								</div>

								<div className="content-top-1 col-md-3 col-md-offset-1 top-content box-2 col-xs-6 col-xs-offset-3">
									
									<label>{userDetails.stockWorth}</label>
									<p>Stock Worth</p>
									
																
								 <div className="clearfix"> </div>
								</div>

								<div className="content-top-1 col-md-3 col-md-offset-1 top-content box-3 col-xs-6 <col-xs-offset-3></col-xs-offset-3>">
									
									<label>{userDetails.total}</label>
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
		console.log(props['state']);
		this.state = {
			userStocks : this.props.state.UserStockById,
			stocksList : this.props.state.AllStockById,
			userDetails : this.props.state.User,
		}
		console.log(this.state);
	}
	render(){
		return (
			<div>
			<div id="page-wrapper" className="gray-bg dashbard-1">
				<DashboardNav AllStocksList={this.state.stocksList} userDetails = {this.state.userDetails} />
				<div className="content-top">
						<TransactionPanel userStocks = {this.state.userStocks} stocksList={this.state.stocksList} />
						<CompanyPanel stocksList={this.state.stocksList} />
						<MortgagePanel stocksList={this.state.stocksList} />
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
exports.stocksList = stockTemp;
