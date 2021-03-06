import React from 'react';
import ReactDOM from 'react-dom';

var NetworkService = require('./main.js').NetworkService;
var state = require('./state.js');
console.log(NetworkService,'lolejed');
var key = 0;

/*
 4 inputs:
 	bid/ask?
 	type of order: limit/stoploss/market (proto - enum - ordertype)
 	price (only for limit and stoploss)
 	stck qty
*/

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
	componentWillReceiveProps(nextProps){		
		console.log('nextProps', nextProps.stocksList);
		this.setState({						
			stocksList : nextProps.stocksList,			
		});
		console.log(this.state, 'hi partha');
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
		if((orderPrice % 1 != 0) && (orderStockQuantity % 1 != 0) ){
			$('#alert-modal .modal-dialog .modal-content .modal-body').text('Please enter an intergral value for number of stocks to be purchased.');
			$('#alert-modal').modal('show');
			return false;
		}
		var OrderType = PR.lookup("dalalstreet.socketapi.models.OrderType").values;
		// alert(OrderType[orderType]);
		if((!orderStockQuantity || !orderPrice) && (OrderType[orderType]!=1)){
			$('#fill-modal').modal('show');
		}
		else if((!orderStockQuantity) && (OrderType[orderType]==1)){
			$('#fill-modal').modal('show');
		}
		else{
		if(type=='Buy'){
			NS.Requests.PlaceBidOrder({
				orderType: OrderType[orderType],
				stockQuantity: orderStockQuantity,
				stockId: orderStockId,
				price: orderPrice || 0,
			}, function(response){				
				console.log(response,'plisss');
				if(response.result){
					$('#alert-modal').modal('show');
				}
				else if(response.bidLimitExceededError){
					$('#alert-modal .modal-dialog .modal-content .modal-body').text('You cannot place buy order of more than '+ state.Constants.BID_LIMIT + ' stocks and also cannot place an order of value within the margin of 20% of current price.' );
					$('#alert-modal').modal('show');
				}
				else if(response.notEnoughCashError){
					$('#error-modal').modal('show');
				}
				else if(response.marketClosedError) {
					$('#stock-modal .modal-dialog .modal-content .modal-body').text('Sorry, cannot place order. Market is closed.');
					$('#stock-modal').modal('show');
				}				
				console.log(response.result);
			});
		}
		else if(type='Sell'){
			NS.Requests.PlaceAskOrder({
				orderType: OrderType[orderType],
				stockQuantity: orderStockQuantity,
				stockId: orderStockId,
				price: orderPrice,
			}, function(response){
				console.log(response,'plisss');
				if(response.result){
					$('#alert-modal').modal('show');
				}
				else if(response.askLimitExceededError){
					$('#alert-modal .modal-dialog .modal-content .modal-body').text('You cannot place buy order of more than '+ state.Constants.BID_LIMIT + ' stocks and also cannot place an order of value within the margin of 20% of current price.' );
					$('#alert-modal').modal('show');
				}
				else if(response.notEnoughCashError){
					$('#error-modal').modal('show');
				}
				else if(response.notEnoughStocksError){
					$('#stock-modal .modal-dialog .modal-content .modal-body').text(response.notEnoughStocksError.reason);
					$('#stock-modal').modal('show');
				}
				else if(response.marketClosedError) {
					$('#stock-modal .modal-dialog .modal-content .modal-body').text('Sorry, cannot place order. Market is closed.');
					$('#stock-modal').modal('show');
				}
				console.log(response.result);
			});
		}
		else{
			//some error occured
			console.log('error');
		}
		}
	}
	checkOrderType(e){
		console.log(e);
		console.log(e.target.value);
		if(e.target.value=='MARKET'){
			$('.stockPriceContainer').hide('slow');
		}
		else{
			$('.stockPriceContainer').show('slow');	
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
											<select name="" id="input" className="form-control orderType" required onChange={this.checkOrderType.bind(this)}>												
												<option value="LIMIT">Limit</option>												
												<option value="MARKET">Market</option>
											</select>
										</div>
									</div>

									<div className="row text-center">
										<div className="col-md-8 col-md-offset-2">
											<p className="modal-label">Quantity</p>											
													<input type="number" id="input" className="form-control stockQuantity" required title="" placeholder="Enter stock quantity" min="1" max="999999" step="1" />											
										</div>																		
									</div>

									<div className="row text-center stockPriceContainer">
										<div className="col-md-8 col-md-offset-2">
											<p className="modal-label">Stock Price</p>
											<input type="number" id="input" className="form-control stockPrice" required="true" title="" placeholder="Enter stock price" min="1" max="999999" step="1" />
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
					<div className="table-responsive table-hover col-md-12">
					<table className="table table-striped table-condensed">
						<thead>
							<tr>
								<th>Stock</th>
								<th>All Time Low</th>
								<th>All Time High</th>
								<th>Day Low</th>
								<th>Day High</th>
								<th>Stocks in Market</th>								
								<th>Current Price</th>								
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
										<td>{x.currentPrice}</td>										
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
					<AlertModal id = "alert-modal" message="Order Placed Successfully" />
					<AlertModal id = "error-modal" message="Not Enough Cash Available" />					
					<AlertModal id = "fill-modal" message="Kindly fill all the fields!" />
					<AlertModal id = "stock-modal" message="" />
				</div>
			</div>
			)
	}
}

module.exports = BuyAndSell;