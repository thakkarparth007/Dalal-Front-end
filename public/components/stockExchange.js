import React from 'react';
import ReactDOM from 'react-dom';

var NetworkService = require("./main.js")[0];

var key = 0;

class StockExchange extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			stocksList: this.props.stocksList
		}
		console.log(this.state, 'yeh mera hai');
	}
	BuyStocksFromExchange(e){		
		console.log('hey',e);
		console.log(this);		

		var type = $("tr[value="+e+"] td select option:selected").val();
		var stock = {};
		stock.stockId = $("tr[value="+e+"]").attr('data-stockId');
		stock.stockQuantity = $("tr[value="+e+"] td input").val() || 0; 
		
		console.log('stock obj is ', stock);
		NetworkService.BuyStocksFromExchange(stock, function(response){
			console.log("ritul mahan", response);
		})
		
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
						{Object.keys(this.state.stocksList).map((t)=>{
							let x = (this.state.stocksList)[t];

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
									<tr className="text-center" key={key++} value={key} data-stockId={x.id}>
										<td>{x.shortName}</td>
										<td>{x.dayLow}</td>
										<td>{x.dayHigh}</td>
										<td className = {color} data-price={x.currentPrice}>
											{icon}
											{x.currentPrice}											
										</td>
										<td>{x.stocksInMarket}</td>
										<td>{x.stocksInExchange}</td>
										<td>
											<input type="number" name="trade-stock" className="form-control"  step="1" required="required" title="trade-stock" min="0" max="99999" />
										</td>
										<td>
											<button type="button" className="btn btn-success" onClick={this.BuyStocksFromExchange.bind(this, key)}>Trade</button>
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