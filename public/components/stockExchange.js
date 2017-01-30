import React from 'react';
import ReactDOM from 'react-dom';

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

class StockExchange extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			stocksList: stocks
		}
	}
	render(){
		return (
			<div className="stock-exchange container">
				<h3>Stock Exchange </h3>
				<table className="table-exchange table table-striped table-hover table-responsive table-condensed" >
					<thead>
						<tr>
							<th>Stock</th>
							<th>Day Low</th>
							<th>Day High</th>
							<th>Current</th>
							<th>Stock In Market</th>
							<th>Stock In Exchange</th>
							<th>Trade Stock</th>
							<th>Trade</th>
						</tr>
					</thead>
					<tbody>
						{(this.state.stocksList).map((x)=>{
							let icon;
							let color;
							if(x.upOrDown){
								icon = <i className="fa fa-sort-asc" aria-hidden="true"></i>;
								color = 'green';
							}
							else{
								icon = <i className="fa fa-sort-desc" aria-hidden="true"></i>;	
								color="red";
							}
							return (
									<tr className="text-center">
										<td>{x.shortName}</td>
										<td>{x.dayLow}</td>
										<td>{x.dayHigh}</td>
										<td className = {color}>
											{icon}
											{x.currentPrice}											
										</td>
										<td>{x.stocksInMarket}</td>
										<td>{x.stocksInExchange}</td>
										<td>
											<input type="number" name="trade-stock" className="form-control"  step="1" required="required" title="trade-stock" min="0" max="99999" />
										</td>
										<td>
											<button type="button" className="btn btn-success">Trade</button>
										</td>
									</tr>
								);
						})}
						
					</tbody>
				</table>
			</div>
			)
	}
}

module.exports = StockExchange;