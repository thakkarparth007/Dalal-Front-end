import React from 'react';
import ReactDOM from 'react-dom';
var CompanyPanel = require('./companyPanel.js');
var MorgagePanel = require('./morgagePanel.js');
// items required from user
// market Events
// net cash
// stock
// wealth

var marketEvents = 1000;
var netCash = 200;
var stock = 10;
var wealth = 10000;

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
	return (
			<marquee className="stocks-list">
			{stocks.map((stock)=>{
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

const TransactionPanel = ({userStocks}) =>{
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
		    {userStocks.map((stock)=>{
		    	console.log(stock);		    
		    	let temp;		    	
		    	stocks.map((x=>{
		    		console.log(x);
		    		if(x.id==stock.stockId){
		    			temp = x;		    			
		    		}
		    	}));

		    	console.log(temp);
		    	if(temp!=0)
		    		return (
		    			<tr>
		    			  <td>{temp.id}</td>
		    			  <td>{temp.fullName}</td>
		    			  <td>{temp.allTimeLow}</td>
		    			  <td>{temp.allTimeHigh}</td>
		    			  <td>{temp.dayLow}</td>
		    			  <td>{temp.dayHigh}</td>
		    			  <td>{stock.price}</td>
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

const DashboardNav = () => {
	let stocksList;

	return (
			    <div>
			       <div className="content-main">			 			  		
					    <div className="banner">					   
							<h2>
							<a href="index.html">Home</a>
							<i className="fa fa-angle-right"></i>
							<span>Dashboard</span>
							</h2>
					    </div>
					</div>

					<div className="content-top">
										
						<StocksList stocks={stocks} />
						<h3 className="dash-head">User Statistics</h3>
						<div className="row">
							<div className="col-md-10 ">
								<div className="content-top-1 col-md-3 col-md-offset-1 top-content box-1 col-xs-6 col-xs-offset-3">
									
									<label>{marketEvents}</label>
									<p>Total</p>
									
																
								 <div className="clearfix"> </div>
								</div>

								<div className="content-top-1 col-md-3 col-md-offset-1 top-content box-2 col-xs-6 col-xs-offset-3">
									
									<label>{netCash}</label>
									<p>Total Cash</p>
									
																
								 <div className="clearfix"> </div>
								</div>

								<div className="content-top-1 col-md-3 col-md-offset-1 top-content box-3 col-xs-6 <col-xs-offset-3></col-xs-offset-3>">
									
									<label>{wealth}</label>
									<p>Wealth</p>
									
																
								 <div className="clearfix"> </div>
								</div>

							</div>
							</div>
					</div>							
					

					

				</div>					    
		);
}

class Dashboard extends React.Component{
	render(){
		return (
			<div>
			<div id="page-wrapper" className="gray-bg dashbard-1">
				<DashboardNav />
				<div className="content-top">
						<TransactionPanel userStocks = {userStocks} />
						<CompanyPanel stocksList={stockTemp} />
						<MorgagePanel />
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
	stocksList: stockTemp
};
exports.stocksList = stockTemp;
