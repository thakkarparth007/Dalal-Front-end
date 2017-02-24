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
			currentCompanyNews: '' ,
			currentCompanyStocks: '',
			currentCompanyStatistics: '',
			currentMarketDepth: '',
			stocksList: this.props.stocksList,
			companyProfile: this.props.companyProfile,
			userStocks: this.props.userStocks,
			marketEvents: this.props.marketEvents,			
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

		Object.keys(this.state.marketEvents).map((k)=>{
			let e = (this.state.marketEvents)[k];
			if(e.stockId == stockId || e.isGlobal == 0){
				this.setState({currentCompanyNews: e.text});		
			}
		})
		
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

		marketDepth.map((e)=>{
			if(e.stockId == stockId){
				this.setState({currentMarketDepth: e})
			}	
		})

		if(stockId == -1){
			this.setState({
			currentCompany: this.props.stocksList[Object.keys(props.stocksList)[0]].fullName,
			currentCompanyPrice: this.props.stocksList[Object.keys(props.stocksList)[0]].currentPrice,
			currentCompanyNews: this.props.stocksList[Object.keys(props.stocksList)[0]].description,
			currentCompanyStocks: this.props.stocksList[Object.keys(props.stocksList)[0]].currentPrice,
			currentCompanyStatistics: companyStatistics[Object.keys(props.stocksList)[0]],			
			})
		}
		

	}
	render(){			
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
							<h4>Market Depth:</h4>
							<Chart statistics = {this.state.currentMarketDepth} />
						</div>
					</div>
					<div className="col-md-4 col-md-offset-1 newsContainer">	
						<p className="market-main">Company News</p>						
						<ul>					
							{
								Object.keys(this.state.marketEvents).map(id=>{
									let x = (this.state.marketEvents)[id];
									return (
											<li className="market-list">
													<p className="market-head">{x.headline}</p>
													<p className="market-text">{x.text}</p>
											</li>
										)
								})
							}
						</ul>
					</div>
					
				</div>
				
				
			</div>
			)
	}
}

module.exports = CompanyPanel;