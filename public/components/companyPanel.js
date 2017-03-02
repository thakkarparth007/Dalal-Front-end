import React from 'react';
import ReactDOM from 'react-dom';
var LineChart = require("react-chartjs").Line;
var NetworkService = require('./main.js').NetworkService;
var state = require('./state.js');
var marketDepth = [
	{
		stockId: 1,
		quantity: [120,10,200,240,100,50,90],
		stockPrice: [200,250,232,245,280,195,265]
	},
	{
		stockId: 2,
		quantity: [20,110,500,240,200,50,10],
		stockPrice: [200,250,232,245,280,195,265],
	}
];

// var companyStatistics = [
// 	{
// 		stockId: 1,
// 		stockPrice: [200,250,232,245,280,195,265],
// 		createdAt: ['21st','22nd','23rd','24th','25th','26th','27th']
// 	},
// 	{
// 		stockId: 2,
// 		stockPrice: [500,550,532,545,580,495,465],
// 		createdAt: ['21st','22nd','23rd','24th','25th','26th','27th']
// 	}
// ];


// var MarketEvents = {
// 1: {
//     id : 1;
//     stockId : 2;
//     headline : 'Aaj tak';
//     text : 'news hai';
//     emotion_score : 5;
//     isGlobal : 7;
//     createdAt : 6;
// 	}
// }

	


const Chart = ({statistics}) =>{
	console.log(statistics.createdAt);
	var temp = '';
	var chartData = {
	        labels: statistics.createdAt,
	        datasets: [{
	            label: 'Stock Price',
	            data: statistics.stockPrice,	            
	            fillColor: "rgba(220,220,220,0.2)",
	            strokeColor: "rgba(220,220,220,1)",
	            pointColor: "rgba(220,220,220,1)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(220,220,220,1)",         
	        }]
	    };
	    var chartOptions = {
	        scales: {
	            yAxes: [{
	                ticks: {
	                    beginAtZero:true
	                }
	            }]
	        }
	    };

	    	if(statistics.createdAt){
	    		temp = <LineChart data={chartData} options={chartOptions} width="500%" height="200%"/>;
	    	}
	    	else{
	    		temp = <h4 className="text-center statisticsHead">- Select Company -</h4>;
	    	}
	    

	return (

		<div>			
			  {temp}  
		</div>
		)
}


class CompanyPanel extends React.Component{
	constructor(props){
		super(props);			
		console.log(props,'company props');
		this.state = {
			currentCompany: '',
			currentCompanyPrice: '',
			currentCompanyNews: '-' ,
			currentCompanyStocks: '',
			currentCompanyStatistics: '',
			currentMarketDepth: {},
			stocksList: this.props.stocksList,
			companyProfile: this.props.companyProfile,
			userStocks: this.props.userStocks,
			marketEvents: this.props.marketEvents,
			marketDepth: this.props.marketDepth,
		}
		// state.OnLogin(() => {
		// 	NS.Requests.GetCompanyProfile(resp => {
		// 	});
		// });
		
		//alert("yo " + firstStockId);
		state.Listen((state) => {
			if(!Object.keys(this.props.stocksList).length)
				return;
			
			let firstStockId = Object.keys(this.props.stocksList).sort()[0];
			NetworkService.Requests.GetCompanyProfile({
				stockId: firstStockId,
			}, resp => {
				console.log(resp,'company ka details');
				if(resp.result){
					state.CompanyProfile[firstStockId] = resp.result.stockHistoryMap;
					this.updateStockHistory(firstStockId);
				}
				else{

				}
			})
		})

		this.handleChange = this.handleChange.bind(this);
	}
	componentWillReceiveProps(nextProps){		
		console.log('nextProps', nextProps.stocksList);
		this.setState({
			companyProfile: nextProps.companyProfile,
		});
		console.log(this.state, 'hi partha 101');
		// alert(JSON.stringify(this.state));

		//console.log(this.state,'company ka state',Object.keys(this.state.stocksList).length,Object.keys(this.state.companyProfile).length,this.state.companyProfile);
		if((Object.keys(this.state.stocksList).length > 0) && (Object.keys(this.state.companyProfile).length > 0)){
			let id;
			Object.keys(this.state.companyProfile).map(k1=>{
				Object.keys(this.state.stocksList).map(k2=>{
					if(k1 == k2){
						id = k1;
					}
				})
			});			
			let currentStats = {};
			currentStats.stockId = id;
			currentStats.stockPrice = [];
			currentStats.createdAt = [];
			console.log(this.state.companyProfile[id], 'current comp');
			/*let keysArray = Object.keys(this.state.companyProfile[id])
									.sort((a,b) => new Date(b) < new Date(a));
			// alert(keysArray);
			let temp = keysArray.slice(- 15, -1);
			
			temp.map(key=>{		
				(currentStats.stockPrice).push(this.state.companyProfile[id][key].stockPrice);
				(currentStats.createdAt).push(this.state.companyProfile[id][key].createdAt);
			});

			console.log(currentStats, 'peheli vaali ka stats');*/

			this.updateStockHistory(id);

			this.setState({
				currentCompanyStats: currentStats,
				currentCompany: this.state.stocksList[id].fullName,
				currentCompanyPrice: this.state.stocksList[id].currentPrice,
				currentCompanyStocks: this.state.userStocks[id],
				currentCompanyNews: this.state.stocksList[id].description,
			})
		}

		// Object.keys(this.state.companyProfile[Object.keys(this.state.companyProfile)[0]]).map(id=>{
		// 	currentCompanyPrices.push((this.state.companyProfile[id]).stockPrice);
		// 	createdAt.push((this.state.companyProfile[id]).createdAt);
		// })
		// alert('yo')
		// console.log(currentCompanyPrices,createdAt,'statos');

		// currentCompanyStats = (new Date((nextProps.companyProfile[1])[Object.keys(nextProps.companyProfile[1])[0]].createdAt)).getHours();
		// alert(currentCompanyStats,'noobing');
	}	

	updateStockHistory(stockId) {
		let currentStats = {};
		currentStats.stockId = stockId;
		currentStats.stockPrice = [];
		currentStats.createdAt = [];	
		let keysArray = Object.keys(this.state.companyProfile[stockId])
									.sort((a,b) => new Date(a) - new Date(b));
		let temp = keysArray.slice(- 15, -1);
		
		temp.map(key=>{
			(currentStats.stockPrice).push(this.state.companyProfile[stockId][key].stockPrice);
			let time = new Date(this.state.companyProfile[stockId][key].createdAt);
			let hours = time.getHours();
			let minutes = time.getMinutes();
			time = hours + ':' + minutes;
			(currentStats.createdAt).push(time);
		});
		this.setState({currentCompanyStatistics: currentStats})
	}
	updateMarketDepth(stockId,update){
		alert("ye kya hua " + JSON.stringify(state.MarketDepth))
		state.MarketDepth[stockId] = state.MarketDepth[stockId] || {};
		let currentDepth = state.MarketDepth[stockId];

		alert("noob u 2")
		alert("ye kya hua 2 " + JSON.stringify(state.MarketDepth));
		currentDepth.askDepth = Object.assign(currentDepth.askDepth || {}, update.askDepth);
		currentDepth.bidDepth = Object.assign(currentDepth.bidDepth || {}, update.bidDepth);
		currentDepth.latestTrades = (update.latestTrades || []);
		
		update.bidDepthDiff = update.bidDepthDiff || {};
		update.askDepthDiff = update.askDepthDiff || {};

		var newAskDepth = JSON.parse(JSON.stringify(currentDepth.askDepth));
		alert("Copy of ask: " + JSON.stringify(newAskDepth));
		Object.keys(update.askDepthDiff).map(price=>{
			if(!newAskDepth[price]) {
				newAskDepth[price] = 0;
			}
			newAskDepth[price] += update.askDepthDiff[price];
			if (newAskDepth[price] == 0) {
				delete newAskDepth[price];
			}
		});
		alert("Copy of ask2: " + JSON.stringify(newAskDepth));
		currentDepth.askDepth = newAskDepth;

		var newLatestTrades = currentDepth.latestTrades;
		(update.latestTradesDiff).map(id=>{
			(newLatestTrades).push(update.latestTradesDiff[id]);
		})
		currentDepth.latestTrades = newLatestTrades;

		var newBidDepth = JSON.parse(JSON.stringify(currentDepth.bidDepth));
		alert("Copy of bid: " + JSON.stringify(newBidDepth));
		Object.keys(update.bidDepthDiff).map(price=>{
			if(!newBidDepth[price]) {
				newBidDepth[price] = 0;
			}
			newBidDepth[price] += update.bidDepthDiff[price];
			if (newBidDepth[price] == 0) {
				delete newBidDepth[price];
			}
		});
		alert("Copy of bid: " + JSON.stringify(newBidDepth));
		currentDepth.bidDepth = newBidDepth;

		if((currentDepth.latestTrades).length > 10){
			(currentDepth.latestTrades).slice(-10, -1);
		}
		if(Object.keys(currentDepth.askDepth).length > 10){
			currentDepth.askDepth = (Object.keys(currentDepth.askDepth).sort((a,b)=>a-b)).slice(-10,-1);
		}
		if(Object.keys(currentDepth.bidDepth).length > 10){
			currentDepth.bidDepth = (Object.keys(currentDepth.bidDepth).sort((a,b)=>b-a)).slice(-10,-1);
		}

		alert(JSON.stringify(state.MarketDepth) + 'lol yoed' + JSON.stringify(currentDepth)+'update yaha se chalu'+JSON.stringify(update));
		console.log(state.MarketDepth[stockId],'pehla vaala 1')
		console.log(state.MarketDepth[stockId],'pehla vaala 2')
		alert(JSON.stringify(state.MarketDepth));
		this.setState({
			currentMarketDepth: state.MarketDepth[stockId],			
		});
		state.NotifyUpdate();

		// let keysArray = Object.keys(this.state.currentDepth[stockId])
		// 							.sort((a,b) => new Date(a) - new Date(b));
		// let temp = keysArray.slice(- 15, -1);
		
		// temp.map(key=>{
		// 	(currentDepth.stockPrice).push(this.state.currentDepth[stockId][key].stockPrice);
		// 	let time = new Date(this.state.currentDepth[stockId][key].createdAt);
		// 	let hours = time.getHours();
		// 	let minutes = time.getMinutes();
		// 	time = hours + ':' + minutes;
		// 	(currentDepth.createdAt).push(time);
		// });
		// this.setState({currentCompanyDepth: currentDepth})	
	}
	handleChange(event){
		event.persist();
		this.setState({currentCompany: event.target.value});
		let stockId = -1,events;
		Object.keys(this.state.stocksList).map((x)=>{
			let e = (this.state.stocksList)[x];

			if(e.fullName == event.target.value){
				this.setState({currentCompanyPrice: e.currentPrice, currentCompanyStocks: this.state.userStocks[x]});
				stockId = e.id;
			}
		});
		console.log(event.target.value);
		// alert(this.state.userStocks[stockId].description);
		this.setState({currentCompanyNews: this.state.stocksList[stockId].description});		
		
		if(this.state.companyProfile[stockId]) {
			this.updateStockHistory(stockId);
		} else {
			NetworkService.Requests.GetCompanyProfile({
				stockId: stockId,
			},(resp)=>{
				console.log(resp,'company ka details',stockId,this.state);				
				if(resp.result){
					state.CompanyProfile[stockId] = resp.result.stockHistoryMap;
					if(this.state.stocksList[stockId].fullName == event.target.value)
						this.updateStockHistory(stockId);
				}
				else{
					// error
				}
			});
		}


		if(this.state.marketDepth[stockId]){
			//exists
			alert(JSON.stringify(this.state.marketDepth[stockId])+'aa gye :P')
			this.setState({
				currentMarketDepth: this.state.marketDepth[stockId],			
			});
		}
		else{
			NetworkService.DataStreams.MarketDepth.Subscribe(stockId ,(resp)=> {
				console.log(resp, "subscription status of marketDepth");
			}, (update)=>{
				console.log('market depth update response', update);
				if(this.state.stocksList[stockId].fullName == event.target.value){
					console.log('market depth update response pella', update);
					this.updateMarketDepth(stockId, update);
				}
			});			
		}

		if(stockId == -1){
			this.setState({
			currentCompany: this.props.stocksList[Object.keys(props.stocksList)[0]].fullName,
			currentCompanyPrice: this.props.stocksList[Object.keys(props.stocksList)[0]].currentPrice,
			currentCompanyNews: '-',
			currentCompanyStocks: this.props.stocksList[Object.keys(props.stocksList)[0]].currentPrice,
			currentCompanyStatistics: companyStatistics[Object.keys(props.stocksList)[0]],			
			})
		}
		

	}
	render(){	
		console.log(this.state.currentMarketDepth,'lol pliss')
		return (
			<div className="container companyPanel">
				<h3 className="dash-head">Company Panel</h3>
				<div className="row company-details">
					<div className="col-md-6">
						<div className="row detail-1">
							<div className="col-md-6">	
								<label>Select Company Name: </label>							
								<select name="companyName" id="input-company" className="form-control" onChange = {this.handleChange}>									
									{Object.keys(this.state.stocksList).map(x=>{										
										let stock = (this.state.stocksList)[x];	
										
										return (
											<option value={stock['fullName']}>{stock['fullName']}</option>
											);
									})}						
								</select>									
							</div>

							<div className="col-md-6">
								<label className="price">Company Stock Price: <span>{this.state.currentCompanyPrice}</span> </label>								
							</div>
						</div>
						<div className="row text-center detail-2">
							<div className="col-md-10 col-md-offset-1">
								<label>Stocks owned in Company : <span>{this.state.currentCompanyStocks}</span></label>
							</div>							
						</div>

						<div className="col-md-12 chart">
							<Chart statistics = {this.state.currentCompanyStatistics} />
						</div>

						<div className="col-md-12 marketDepth" >
							<h4 className="marketdepth-head">Market Depth:</h4>
							<div className="container">
								<div className="row">
									<div className="col-md-3">
										<h5 className="text-center">Ask Depth</h5>
										<table className="table table-striped table-hover">
											<thead>
												<tr>
													<th>No of Stocks</th>
													<th>Price</th>
												</tr>
											</thead>
											<tbody>
												{
											Object.keys(this.state.currentMarketDepth.askDepth || {}).sort((a,b)=>a-b).map(price=>{

												return (
														<tr>
															<td>{this.state.currentMarketDepth.askDepth[price]}</td>
															<td>{price}</td>
														</tr>
													);
											})
												}
												<tr><td>More..</td></tr>									
											</tbody>
										</table>
									</div>
									<div className="col-md-3">
										<h5 className="text-center">Bid Depth</h5>
										<table className="table table-striped table-hover">
											<thead>
												<tr>
													<th>No of Stocks</th>
													<th>Price</th>
												</tr>
											</thead>
											<tbody>
												{
											Object.keys(this.state.currentMarketDepth.bidDepth || {}).sort((a,b)=>b-a).map(price=>{

												return (
														<tr>
															<td>{this.state.currentMarketDepth.bidDepth[price]}</td>
															<td>{price}</td>
														</tr>
													);
											})
												}
												<tr><td>More..</td></tr>																		
											</tbody>
										</table>
									</div>

									<div className="col-md-4 col-md-offset-1">
										<h5 className="text-center">Last 10 Trades</h5>
										<table className="table table-striped table-hover">
											<thead>
												<tr>
													<th>Trade Price</th>
													<th>Quantity</th>
													<th>Timestamp</th>
												</tr>
											</thead>
											<tbody>
												{
											(this.state.currentMarketDepth.latestTrades || []).map(trade=>{

												return (
														<tr>
															<td>{trade.tradePrice}</td>
															<td>{trade.tradeQuantity}</td>
															<td>{trade.tradeTime}</td>															
														</tr>
													);
											})
												}	

											</tbody>
										</table>
									</div>

								</div>
							</div>
							
							{
								
							}
						</div>
					</div>
					<div className="col-md-4 col-md-offset-1 newsContainer">	
						<p className="market-main">Company Description</p>						
						<ul>
								<p className="market-head">{this.state.currentCompanyNews}</p>							
						</ul>
					</div>
					
				</div>
				
				
			</div>
			)
	}
}

module.exports = CompanyPanel;