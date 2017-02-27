import React from 'react';
import ReactDOM from 'react-dom';
var NetworkService = require("./main.js").NetworkService;
var state = require("./state.js");
var AlertModal = require('./stockExchange.js').AlertModal;

//make request for mortgaged stocks

class MainContainerItem extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			item: this.props.item,
			type: this.props.type,
		}
	}
	componentWillReceiveProps(newProps){
		this.setState({
			item: newProps.item,
			type: newProps.type,	
		});
	}
	cancelOrder(type){
		console.log(this.state.item);
		let cancel = {};
		cancel.stockId = this.state.item.stockId;
		
		if(type == 'openAsk'){
			cancel.askId = this.state.item.id;
			NetworkService.Requests.CancelAskOrder(cancel,function(resp){
				if(resp.marketClosedError){
					$('#alert-modal .modal-dialog .modal-content .modal-body').text('Cannot cancel order, Market is closed.' );
					$('#alert-modal').modal('show');
				}
				else if(resp.internalServerError){
					$('#alert-modal .modal-dialog .modal-content .modal-body').text('Internal Server Error.' );
					$('#alert-modal').modal('show');
				}
				else if(resp.result){
					$('#alert-modal .modal-dialog .modal-content .modal-body').text('Order cancelled successfully.' );
					$('#alert-modal').modal('show');	
				}
			});
		}
		else{
			cancel.bidId = this.state.item.id;	
			NetworkService.Requests.CancelBidOrder(cancel,function(resp){
				if(resp.marketClosedError){
					$('#alert-modal .modal-dialog .modal-content .modal-body').text('Cannot cancel order, Market is closed.' );
					$('#alert-modal').modal('show');
				}
				else if(resp.internalServerError){
					$('#alert-modal .modal-dialog .modal-content .modal-body').text('Internal Server Error.' );
					$('#alert-modal').modal('show');
				}
				else if(resp.result){
					$('#alert-modal .modal-dialog .modal-content .modal-body').text('Order cancelled successfully.' );
					$('#alert-modal').modal('show');	
				}
			});
		}
	}
	render(){		
		let temp;
		if(this.state.item.orderType == 0){
			temp = 'Limit';
		}
		else if(this.state.item.orderType == 2){
			temp = 'Stoploss';
		}
		else if(this.state.item.orderType == 1){
			temp = 'Market';
		}
		else{
			temp = 'Stoploss (Active)'
		}	
		let cancelButton = '';	
		if((this.state.type == 'openAsk') || (this.state.type == 'openBid')){
			cancelButton = <button type="button" className="btn btn-danger" onClick= {()=>this.cancelOrder(this.state.type)} >Cancel</button>;			
		}
		return (
			<tr>
				<td>{this.state.item.id}</td>
				<td>{state.AllStockById[(this.state.item.stockId)].fullName}</td>
				<td>{this.state.item.price}</td>
				<td>{this.state.item.stockQuantity}</td>
				<td>{this.state.item.stockQuantityFulfilled}</td>
				<td>{temp}</td>
				<td>{cancelButton}</td>
			</tr>
			)
	}
}

class MainContainer extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			type : props.type,
			params: props.params,
			bidOrAsk: props.bidOrAsk,
		}
	}
	componentWillReceiveProps(nextProps){				
		this.setState({						
			type : nextProps.type,			
			params : nextProps.params,
		});
		console.log(this.state, 'hi partha');
	}
	render(){
		console.log('hey boss',this.state.params,'dekh mujhe yeh aaya');
		
		let temp = this.state.params;
		// if(this.state.type=='openBid'){
		// 	temp = this.state.params.BidOrders.Open;
		// }
		// else if(this.state.type == 'closedBid'){
		// 	temp = this.state.params.BidOrders.Closed;
		// }
		// else if(this.state.type == 'openAsk'){
		// 	temp = this.state.params.Open;
		// }
		// else if(this.state.type == 'closedAsk'){
		// 	temp = this.state.params.Closed;	
		// }
		
		let cancelAction = '';
		if((this.state.type == 'openAsk') || (this.state.type == 'openBid')){			
			cancelAction = 'Cancel Order';
		}

		
		let empty = '';
		if(Object.keys(temp).length==0){
			empty = <p className="text-center">You do not have any orders. </p>;
		}
		return (
			<div>
				<div className="table-responsive table-hover col-md-11">
					<table className="table table-hover">
						<thead>
							<tr>
								<th>{this.state.bidOrAsk} Id</th>
								<th>Stock Name</th>
								<th>Price</th>
								<th>Stock Quantity</th>
								<th>Stock Quantity Fullfilled</th>
								<th>Type of Order</th>
								<th>{cancelAction}</th>
							</tr>
						</thead>
						<tbody>
								{
									(Object.keys(temp)).sort((a,b)=> b-a).map(id=>{
										let object = (temp)[id];
										return (
											<MainContainerItem item = {object} type = {this.state.type} />
											)
									})
								}									
						</tbody>
					</table>
					{empty}
				</div>
			</div>			
			)
	}
}

class MyAskOrders extends React.Component{
	constructor(props){
		super(props);			
		this.state = {
			AskOrders: props.AskOrders,			
			params: props.AskOrders.Open,
			type: 'openAsk',			
		}		
		this.changeState = this.changeState.bind(this);
		console.log(this.state,'mere initial ask orders')		
	}
	componentWillReceiveProps(nextProps){
		this.setState({
			AskOrders: nextProps.AskOrders,
			params: nextProps.AskOrders.Open,
		});
		console.log('updated props');
	}
	changeState(p){
		console.log('p hu mai..', p, this.state.mortgagedStocks,this.state);
		if(p==1){
			this.setState({
				params: this.state.AskOrders.Open,
				type: 'openAsk',
			})			
		}
		else if(p==2){
			this.setState({
				params: this.state.AskOrders.Closed,
				type: 'closedAsk',
			})	
		}
	}
	render(){
		console.log('hey');		
		return (
			<div className = "container mortgagePanel">
				<h4 className="dash-head">My Ask Orders</h4>
				<div className="row">
					<div id="button-1" className="ask-1 askOrderActive col-md-2 col-md-offset-3" onClick={()=>this.changeState(1)}>
						Open Ask Orders 
					</div>
					<div id="button-1" className="ask-2 askOrderPassive col-md-2" onClick={()=>this.changeState(2)}>
						Closed Ask Orders
					</div>
				</div>
				<div className="row">	
					<MainContainer type = {this.state.type} params = {this.state.params} bidOrAsk="Ask" />
				</div>
			</div>
			)
	}
}


class MyBidOrders extends React.Component{
	constructor(props){
		super(props);			
		console.log('bid order props',props);
		this.state = {
			BidOrders: props.BidOrders,			
			params: props.BidOrders.Open,
			type: 'openBid',			
		}		
		console.log(this.state,'child state',props);
		this.changeState = this.changeState.bind(this);		
	}
	componentWillReceiveProps(nextProps){
		this.setState({
			BidOrders: nextProps.BidOrders,
			params: nextProps.BidOrders.Open,
		});
		console.log('updated props');
	}
	changeState(p){		
		if(p==1){
			// alert('1nd clicked',this.state.BidOrders.Open)
			this.setState({
				params: this.state.BidOrders.Open,
				type: 'openBid',
			})					
		}
		else if(p==2){
			// alert('2nd clicked',this.state.BidOrders.Closed)
			this.setState({
				params: this.state.BidOrders.Closed,
				type: 'closedBid',
			})				
		}
	}
	render(){
		console.log('hey');		
		return (
			<div className = "container mortgagePanel">
				<h4 className="dash-head">My Bid Orders</h4>
				<div className="row">
					<div id="button-1" className="bid-1 bidOrderActive col-md-2 col-md-offset-3" onClick={()=>this.changeState(1)}>
						 Open Bid Orders 
					</div>
					<div id="button-1" className="bid-2 bidOrderPassive col-md-2 " onClick={()=>this.changeState(2)}>
						 Closed Bid Orders
					</div>
				</div>
				<div className="row">						
					<MainContainer type = {this.state.type} params = {this.state.params} bidOrAsk="Bid" />
				</div>
			</div>
			)
	}
}

class MyOrders extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			BidOrders: props.orders.Bids,
			AskOrders: props.orders.Asks,
		}
		console.log(props.orders,'main props',this.state);
	}
	render(){
		return (
			<div className = "container orderPanel">
				<h3 className="dash-head">My Orders</h3>
				<div className="row">
					<MyBidOrders BidOrders = {this.state.BidOrders} />
				</div>
				<div className="row">
					<MyAskOrders AskOrders = {this.state.AskOrders} />
				</div>
				<AlertModal id = "alert-modal" message="Order Placed Successfully" />
			</div>
			)
	}
}

module.exports = MyOrders;
