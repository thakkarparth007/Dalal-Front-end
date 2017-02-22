import React from 'react';
import ReactDOM from 'react-dom';
var LineChart = require("react-chartjs").Line;

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

var companyStatistics = [
	{
		stockId: 1,
		stockPrice: [200,250,232,245,280,195,265],
		createdAt: ['21st','22nd','23rd','24th','25th','26th','27th']
	},
	{
		stockId: 2,
		stockPrice: [500,550,532,545,580,495,465],
		createdAt: ['21st','22nd','23rd','24th','25th','26th','27th']
	}
];

var marketEvents = [
	{
		id: 1,
		stockId: 1,
		text: ['Market Crash', 'lol news is here'],
		emotionScore: 50,
		createdAt: '22-11-3'
	},
	{
		id: 2,
		stockId: 2,
		text: ['Is Market Crashed?', 'lol news is here'],
		emotionScore: 80,
		createdAt: '22-11-3'
	}
];
	


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
			currentCompany: this.props.stocksList[Object.keys(props.stocksList)[0]].fullName,
			currentCompanyPrice: this.props.stocksList[Object.keys(props.stocksList)[0]].currentPrice,
			currentCompanyNews: this.props.stocksList[Object.keys(props.stocksList)[0]].description,
			currentCompanyStocks: this.props.stocksList[Object.keys(props.stocksList)[0]].currentPrice,
			currentCompanyStatistics: companyStatistics[Object.keys(props.stocksList)[0]],
			currentMarketDepth: '',
			stocksList: this.props.stocksList,
			companyProfile: this.props.companyProfile,
		}
		// state.OnLogin(() => {
		// 	NS.Requests.GetCompanyProfile(resp => {

		// 	});
		// });
		console.log(this.state);
		this.handleChange = this.handleChange.bind(this);
	}
	componentWillReceiveProps(nextProps){		
		console.log('nextProps', nextProps.stocksList);
		this.setState({						
			stocksList : nextProps.stocksList,			
			companyProfile: nextProps.companyProfile,
		});
		console.log(this.state, 'hi partha');

		let currentCompanyStats;
		currentCompanyStats = (new Date((nextProps.companyProfile[1])[Object.keys(nextProps.companyProfile[1])[0]].createdAt)).getMinutes();
		console.log(currentCompanyStats,'noobing');
	}	
	handleChange(event){
		this.setState({currentCompany: event.target.value});
		let stockId = -1,events;
		Object.keys(this.state.stocksList).map((x)=>{
			let e = (this.state.stocksList)[x];

			if(e.fullName == event.target.value){
				this.setState({currentCompanyPrice: e.currentPrice, currentCompanyStocks: e.stockQuantity});
				stockId = e.id;
			}
		});
		console.log(event.target.value);

		marketEvents.map((e)=>{
			if(e.stockId == stockId){
				this.setState({currentCompanyNews: e.text});		
			}
		})
		
		companyStatistics.map((e)=>{
			if(e.stockId == stockId){
				this.setState({currentCompanyStatistics: e})
			}
		})

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
						<p>Company News</p>						
						<ul>					
							{this.state.currentCompanyNews}
						</ul>
					</div>
					
				</div>
				
				
			</div>
			)
	}
}

module.exports = CompanyPanel;