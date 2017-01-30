import React from 'react';
import ReactDOM from 'react-dom';

class BuyAndSell extends React.Component{
	constructor(props){
		super(props);
		console.log(props.stocksList);
		this.state = {
			stocks : props.stocksList
		}
	}
	render(){
		return(
			<div className="container buy-sell-container">
				<h3>Buy and Sell</h3>
				<div className="row">
					<div className="col-md-11">
					<table className="table table-hover table-responsive table-condensed">
						<thead>
							<tr>
								<th>Stock</th>
								<th>All Time Low</th>
								<th>All Time High</th>
								<th>Day Low</th>
								<th>Day High</th>
								<th>Current</th>
								<th>Stocks in Market</th>
								<th>Type of order</th>
								<th>Quantity</th>
								<th>Place order</th>
							</tr>
						</thead>
						<tbody>
							{(this.state.stocks).map((x)=>{
								return (
									<tr>
										<td>{x.shortName}</td>
										<td>{x.allTimeLow}</td>
										<td>{x.allTimeHigh}</td>
										<td>{x.dayLow}</td>
										<td>{x.dayHigh}</td>
										<td>{x.currentPrice}</td>
										<td>{x.stocksInMarket}</td>
										<td>
											<select name="" id="input" className="form-control" required="required">
												<option value="buy">Buy</option>
												<option value="sell">Sell</option>
											</select>
										</td>
										<td>
											<input type="number" id="input" className="form-control" required="required" title="" min="0" max="999999" />
										</td>
										<td>
											<button type="button" className="btn btn-success">Order</button>
										</td>
									</tr>		
									)
							})}
							
						</tbody>
					</table>
					</div>
				</div>
			</div>
			)
	}
}

module.exports = BuyAndSell;