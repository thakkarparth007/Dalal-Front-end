import React from 'react';
import ReactDOM from 'react-dom';
var NetworkService = require("./main.js").NetworkService;

//make request for mortgaged stocks
// var mortgagedStocks = [
// 	{
// 		companyName: 'Pragyan',
// 		currentPrice: 100,
// 		mortgagedStocksQuantity: 50,		 
// 	}
// ];

$('.active-btn').click(function(){
	alert('hry');
});

const MortgageContainer = (stocksList,mortgageStocks,state) =>{	
	let text = '';
	if(state = 'myStocks')
	{
		if((mortgageStocks).length == 0){
			text = <p className="mortgageText"><i>-No mortgaged stocks-</i></p>;
		}
		else{
			let temp = '';
			for(let i=0;i<mortgageStocks.length;i++){
				temp = temp + (<tr><td>Hello </td> </tr>);
			}

			text = <div className="table-responsive table-hover col-md-11">
				<table className="table table-hover">
					<thead>
						<tr>
							<th>Company Name</th>
							<th>Current Price</th>
							<th>No of Stocks Mortgaged</th>
							<th>No of Stocks to exchange</th>
							<th>Exchange</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td></td>
						</tr>
					</tbody>
				</table>
			</div>;
		}
	}

	return (
		<div>
			{text}
		</div>
		)
}


class MortgagePanel extends React.Component{
	constructor(props){
		super(props);
		console.log(props.stocksList);
		let mortgagedStocks = {};

		// NetworkService.Requests.GetMortgageDetails(mortgagedStocks, function(response){
		// 		console.log("ritul mahan", response);
				
		// });

		this.state = {
			mortgageStocks: mortgagedStocks,
			stocksList: this.props.stocksList
		}
	}
	render(){
		console.log('hey');
		console.log((this.state.stocksList).length);
		let text;
				
		return (
			<div className = "container mortgagePanel">
				<h3 className="dash-head">Morgage Panel</h3>
				<div className="row">
					<div className="btn-1 active-btn col-md-2 col-md-offset-3" onClick={() =>{									
									MortgageContainer((this.state.stocksList),(this.state.mortgageStocks),'myStocks')
									}
								}>
						Your Mortgaged Stocks 
					</div>
					<div className="col-md-2 btn-2 passive-btn" onClick={() =>MortgageContainer((this.state.mortgagedStocks))}>
						Mortgage Stocks
					</div>
				</div>
				<div className="row">
					<MortgageContainer />
				</div>
			</div>
			)
	}
}

module.exports = MortgagePanel;