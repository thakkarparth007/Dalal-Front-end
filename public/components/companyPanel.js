import React from 'react';
import ReactDOM from 'react-dom';
var LineChart = require("react-chartjs").Line;

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
]
	
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
	    		temp = <LineChart data={chartData} options={chartOptions} width="1000%" height="200%"/>;
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
		this.state = {
			currentCompany: '-',
			currentCompanyPrice: '-',
			currentCompanyNews: '-',
			currentCompanyStocks: '-',
			currentCompanyStatistics: '',
			stocksList: this.props
		}
		this.handleChange = this.handleChange.bind(this);
	}
	handleChange(event){
		this.setState({currentCompany: event.target.value});
		let stockId = -1,events;
		(this.state.stocksList['stocksList']).map((e)=>{
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

		if(stockId == -1){
			this.setState({
				currentCompany: '-',
			currentCompanyPrice: '-',
			currentCompanyNews: '-',
			currentCompanyStocks: '-',
			currentCompanyStatistics: ''
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
									<option value="select">Select Company Name</option>
									{(this.state.stocksList['stocksList']).map((stock)=>{				
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

							<div className="col-md-12 chart">
								
							</div>
						</div>
					</div>
					<div className="col-md-4 col-md-offset-1 newsContainer">	
						<p>Company News</p>						
						<ul>					
							{this.state.currentCompanyNews}
						</ul>
					</div>
					
				</div>
				<Chart statistics = {this.state.currentCompanyStatistics} />
			</div>
			)
	}
}

module.exports = CompanyPanel;