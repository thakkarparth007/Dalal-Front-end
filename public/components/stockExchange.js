import React from 'react';
import ReactDOM from 'react-dom';

var NetworkService = require("./main.js").NetworkService;
console.log(NetworkService, 'are you there?');
var key = 0;

const AlertModal = ({id,message}) =>{
	return (		
		<div className="modal fade" id={id}>
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
						<button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<h4 className="modal-title">Alert</h4>
					</div>
					<div className="modal-body">
						{message}
					</div>
					<div className="modal-footer">
						<button type="button" className="btn btn-default" data-dismiss="modal">Close</button>						
					</div>
				</div>
			</div>
		</div>
	)
}

class StockExchangeItem extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			color: props.color,
			icon: props.icon,
			stock: props.stock,
		}
	}
	componentWillReceiveProps(nextProps){
		this.setState({						
			stock : nextProps.stock,			
		});
	}
	BuyStocksFromExchange(e){		
		console.log('hey',e);
		console.log(this);	

		var type = $("tr[value="+e+"] td select option:selected").val();
		var stock = {};
		stock.stockId = $("tr[value="+e+"]").attr('data-stockId');
		stock.stockQuantity = $("tr[value="+e+"] td input").val() || 0; 
		
		console.log('stock obj is ', stock);		
		NetworkService.Requests.BuyStocksFromExchange(stock, function(response){
			console.log("ritul mahan", response);
			console.log(AlertModal("message"));
			if(!response.notEnoughStocksError)	
				$('#alert-modal').modal('show');
			else
				$('#error-modal').modal('show');
			//will get trading price as the response			
			
		})
		
	}
	render(){
		return (
				<tr className="text-center" key={key++} value={key} data-stockId={this.state.stock.id}>
					<td>{this.state.stock.shortName}</td>
					<td>{this.state.stock.dayLow}</td>
					<td>{this.state.stock.dayHigh}</td>
					<td className = {this.state.color} data-price={this.state.stock.currentPrice}>										
						<sub>{Math.abs(this.state.stock.previousDayClose - this.state.stock.currentPrice)}</sub>											
						{this.state.icon}					
						{this.state.stock.currentPrice}
					</td>
					<td>{this.state.stock.stocksInMarket}</td>
					<td>{this.state.stock.stocksInExchange}</td>
					<td>
						<input type="number" name="trade-stock" className="form-control"  step="1" required="required" title="trade-stock" min="0" max="99999" />
					</td>
					<td>
						<button type="button" className="btn btn-success" onClick={this.BuyStocksFromExchange.bind(this, key)}>Trade</button>
					</td>
				</tr>
			);
	}
}

class StockExchange extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			stocksList: this.props.stocksList,
			message: 'You Order has been placed!',
		}
		console.log(this.state, 'yeh mera hai');
	}
	componentWillReceiveProps(nextProps){		
		console.log('nextProps', nextProps.stocksList);
		this.setState({						
			stocksList : nextProps.stocksList,			
		});
		console.log(this.state, 'hi partha');
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
							if(x.currentPrice >= x.previousDayClose){
								icon = <i className="fa fa-sort-asc" aria-hidden="true"></i>;
								color = 'green';								
							}
							else{
								icon = <i className="fa fa-sort-desc" aria-hidden="true"></i>;	
								color="red";
							}
							return (
								<StockExchangeItem stock = {x} icon = {icon} color = {color} />
							)
						})}
						
					</tbody>
				</table>
				<AlertModal id = "alert-modal" message="Order Placed Successfully" />
				<AlertModal id = "error-modal" message="Not Enough Stocks Available" />
				<AlertModal id = "exceed-modal" message="Max Order Quota Exceeded" />
			</div>
			)
	}
}

module.exports = StockExchange;