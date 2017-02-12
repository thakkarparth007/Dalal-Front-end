import React from 'react';
import ReactDOM from 'react-dom';

var NetworkService = require('./main.js');
console.log(NetworkService,'lolejed');
var key = 0;

/*
 4 inputs:
 	bid/ask?
 	type of order: limit/stoploss/market (proto - enum - ordertype)
 	price (only for limit and stoploss)
 	stck qty
*/

class BuyAndSell extends React.Component{
	constructor(props){
		super(props);
		console.log(props.stocksList);
		this.state = {
			stocks : this.props.stocksList,	
			key : 0					
		}
		
		this.orderParams = this.orderParams.bind(this);
		this.placeOrder = this.placeOrder.bind(this);		
		this.checkOrderType = this.checkOrderType.bind(this);		
	}	
	placeOrder(e){	
		e.preventDefault();
		
		
		var type = $('.section-container .activeSection').html();			
		console.log(this.state.key,'keyed');

		var NS = NetworkService;
		var PR = NS.ProtoRoot;
		
		var orderType = $('.orderType').find(":selected").val();
		console.log(orderType,'mera type mahan');
		var orderStockQuantity = $('.stockQuantity').val();
		var orderStockId = $("tr[value="+this.state.key+"]").attr('data-stockId');
		var orderPrice = $(".stockPrice").val();

		if(orderType=='MARKET'){

		}

		var OrderType = PR.lookup("dalalstreet.socketapi.models.OrderType").values;
		
		if(type=='Buy'){
			NS.Requests.PlaceBidOrder({
				orderType: OrderType[orderType],
				stockQuantity: orderStockQuantity,
				stockId: orderStockId,
				price: orderPrice,
			}, function(response){
				console.log(response);
			});
		}
		else if(type='Sell'){
			NetworkService.Requests.PlaceAskOrder({
				orderType: OrderType[orderType],
				stockQuantity: orderStockQuantity,
				stockId: orderStockId,
				price: orderPrice,
			}, function(response){
				console.log(response);
			});
		}
		else{
			//some error occured
			console.log('error');
		}
	}
	checkOrderType(e){
		console.log(e);
		console.log(e.target.value);
		if(e.target.value=='MARKET'){
			$('.stockPriceContainer').hide('slow');
		}
	}
	orderParams(e){
		console.log('hey',e);
		console.log(this);				
		this.setState({key: e});
		
		// this.setState({		
				// orderStockId: $("tr[value="+e+"]").attr('data-stockId'),
				// orderPrice : $("tr[value="+e+"] .price").attr('data-price'),					
		// });		
	}
	render(){				
		return(
			<div className="container buy-sell-container">
				<h3>Buy and Sell</h3>				
				<div className="modal fade" id="modal-id">
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
								<h4 className="modal-title">Order Box</h4>
							</div>
							<div className="modal-body">
								<div className="container-fluid">
									<div className="row section-container">
										<div className="col-md-6 buySection activeSection">
											Buy
										</div>
										<div className="col-md-6 sellSection passiveSection">
											Sell
										</div>

									</div>
									<div className="row text-center">										
										<div className="col-md-8 col-md-offset-2">
											<p className="modal-label">Type of Order</p>
											<select name="" id="input" className="form-control orderType" required="required" onChange={this.checkOrderType.bind(this)}>												
												<option value="LIMIT">Limit</option>
												<option value="STOPLOSS">Stoploss</option>
												<option value="MARKET">Market</option>
											</select>
										</div>
									</div>

									<div className="row text-center">
										<div className="col-md-8 col-md-offset-2">
											<p className="modal-label">Quantity</p>
											<input type="number" id="input" className="form-control stockQuantity" required="required" title="" min="0" max="999999" />
										</div>																		
									</div>

									<div className="row text-center stockPriceContainer">
										<div className="col-md-8 col-md-offset-2">
											<p className="modal-label">Stock Price</p>
											<input type="number" id="input" className="form-control stockPrice" required="required" title="" min="0" max="999999" />
										</div>																		
									</div>
								</div>
							</div>
							<div className="modal-footer text-center">								
								<button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.placeOrder.bind(this)} >Place Order</button>
							</div>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-md-11">
					<table className="table table-striped table-hover table-responsive table-condensed">
						<thead>
							<tr>
								<th>Stock</th>
								<th>All Time Low</th>
								<th>All Time High</th>
								<th>Day Low</th>
								<th>Day High</th>
								<th>Stocks in Market</th>								
								<th>Place order</th>
							</tr>
						</thead>
						<tbody>
							{Object.keys(this.state.stocks).map((t)=>{
								let x = (this.state.stocks)[t];								
								console.log(x); 								
								return (

									<tr key={x.id} value={x.id} data-stockId={x.id}>										
										<td>{x.shortName}</td>
										<td>{x.allTimeLow}</td>
										<td>{x.allTimeHigh}</td>
										<td>{x.dayLow}</td>
										<td>{x.dayHigh}</td>										
										<td>{x.stocksInMarket}</td>										
										<td>
											<a className="btn btn-success" href="#modal-id" data-toggle="modal" onClick={this.orderParams.bind(this, x.id)}>Order</a>											
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