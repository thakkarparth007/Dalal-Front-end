import React from 'react';
import ReactDOM from 'react-dom';
var NetworkService = require("./main.js").NetworkService;

//make request for mortgaged stocks
var mortgagedStocks = {
	1: {
		companyName: 'Pragyan',
		currentPrice: 100,
		mortgagedStocksQuantity: 50,		 
	}
};

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


class GetMortgageStocksItem extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			stock: this.props.stock,
			stockQuantityToMortgage: 0,
			stockQuantityOwned: this.props.stockQuantityOwned
		}
	}
	componentWillReceiveProps(newProps){
		this.setState ({
			stock: newProps.stock,			
			stockQuantityOwned: newProps.stockQuantityOwned,
		})
	}
	updateStockQuantity(e) {
		this.setState({
			stockQuantityToMortgage: e.target.value
		})
	}
	render() {
		return (
			<tr>
				<td>{this.state.stock.fullName}</td>
				<td>{this.state.stock.currentPrice}</td>
				<td>{this.state.stockQuantityOwned}</td>										
				<td>
					<input type="number" className="form-control" min="0" max={this.state.stockQuantityOwned} onChange={this.updateStockQuantity.bind(this)} />
				</td>
				<td>
					<p>{this.state.stockQuantityToMortgage * this.state.stock.currentPrice}</p>
				</td>
				<td>
					<button type="button" className="btn btn-success">Mortgage</button>
				</td>
			</tr>
		)
	}
}

class GetMortgagedStocks extends React.Component{
	constructor(props){
		super(props);		
		console.log('heyeye lol',props.params,this.state)
		this.state = {
			mortgageStockList: props.params,
			stocksList : props.stocksList,
		}	
		
		// this.manageChange = this.manageChange.bind(this);
	}
	componentWillReceiveProps(newProps){
		this.setState({
				mortgageStockList: newProps.params,
				stocksList : newProps.stocksList,			
		})
		console.log('heyeye joe',newProps.params,newProps.stocksList)
	}
	manageChange(e){
		console.log(e.target);
		this.setState({
			amount: (e.target.dataset.stockprice)*(e.target.value)
		});
	}
	render(){
		return (
			<div>
				<div className="table-responsive table-hover col-md-11">
					<table className="table table-hover">
						<thead>
							<tr>
								<th>Stock Name</th>
								<th>Current Price</th>
								<th>No of Stocks Mortgaged</th>
								<th>No of Stocks to exchange</th>
								<th>Amount to be Paid</th>
								<th>Exchange</th>
							</tr>
						</thead>
						<tbody>
							{								
								Object.keys(this.state.mortgageStockList).map(id=>{
									console.log(this.state.mortgageStockList,'check cechik');
									let mortgageStock = (this.state.mortgageStockList)[id];	
									let stock = this.state.stocksList[mortgageStock.stockId];
									console.log(mortgageStock.stockId,stock,'pliss pliss pliss');
								return (
								 <GetMortgageStocksItem stock={stock} stockQuantityOwned={mortgageStock.numStocksInBank} />
									)
							})
							}											
						</tbody>
					</table>
				</div>
			</div>
			)
	}
}

class PutMortgageStocksItem extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			stock: this.props.stock,
			stockQuantityToMortgage: 0,
			stockQuantityOwned: this.props.stockQuantityOwned
		}		
	}	
	componentWillReceiveProps(newProps){
		this.setState ({
			stock: newProps.stock,			
			stockQuantityOwned: newProps.stockQuantityOwned,
		})
	}
	updateStockQuantity(e) {
		this.setState({
			stockQuantityToMortgage: e.target.value
		})
	}
	putStockInMortgage(){		
		NetworkService.Requests.MortgageStocks({
			stockId: this.state.stock.id,
			stockQuantity: this.state.stockQuantityToMortgage,
		},function(resp){
			console.log(resp,'mortgagedStocks mai bhejne ka response')
			if(resp.transaction){
				$('#alert-modal').modal('show');
			}
			else{
				$('#error-modal').modal('show');
			}
		})
	}
	render() {
		return (
			<tr>
				<td>{this.state.stock.fullName}</td>
				<td>{this.state.stock.currentPrice}</td>
				<td>{this.state.stockQuantityOwned}</td>										
				<td>
					<input type="number" className="form-control" min="0" max={this.state.stockQuantityOwned} onChange={this.updateStockQuantity.bind(this)} />
				</td>
				<td>
					<p>{this.state.stockQuantityToMortgage * this.state.stock.currentPrice}</p>
				</td>
				<td>
					<button type="button" className="btn btn-success" onClick={this.putStockInMortgage.bind(this)}>Mortgage</button>
				</td>
			</tr>
		)
	}
}

class PutMortgageStocks extends React.Component{
	constructor(props){
		super(props);
		console.log(props);		
		this.state = {
			userStockList: props.params,
			stocksList : props.stocksList,
		}	
		// this.manageChange = this.manageChange.bind(this);
	}
	componentWillReceiveProps(newProps){
		this.setState({
				userStockList: newProps.params,
				stocksList : newProps.stocksList,			
		})		
	}
	render(){
		return (
			<div>			
				<div className="table-responsive table-hover col-md-11">
					<table className="table table-hover">
						<thead>
							<tr>
								<th>Company Name</th>
								<th>Current Price</th>
								<th>No of Stocks</th>
								<th>No of Stocks to Mortgage</th>
								<th>Amount Received</th>
								<th>Mortgage</th>
							</tr>
						</thead>
						<tbody>
							{
								Object.keys(this.state.userStockList).map(id=>{
									let userStock = (this.state.userStockList)[id];	
									let stock = this.state.stocksList[id];
									if(userStock>=0)
										return <PutMortgageStocksItem stock={stock} stockQuantityOwned={userStock} />
								})
							}
						</tbody>
					</table>
				</div>
			</div>
			)	
	}
	
}

const MortgageContainer = ({stocksList,params,type}) =>{
	console.log(type,'ki and ka returns',params, stocksList);
	if(type == 'getFromMortgage'){
		return (
			<GetMortgagedStocks stocksList={stocksList} params = {params} />
			)
	}
	else{
		return (
			<PutMortgageStocks stocksList={stocksList} params= {params} />
			)
	}
}


class MortgagePanel extends React.Component{
	constructor(props){
		super(props);
		console.log(props, "yayayaya");		

		// NetworkService.Requests.GetMortgageDetails(mortgagedStocks, function(response){
		// 		console.log("ritul mahan", response);
		// 		mortgagedStocks = response.result;
		// });

		this.state = {
			mortgagedStocks: this.props.mortgagedStocks,
			stocksList: this.props.stocksList,
			userStocks: this.props.userStocks,
			params : this.props.mortgagedStocks,
			type: 'getFromMortgage'
		}
		//change params later

		console.log(this.state,'chamiya',mortgagedStocks,props.userStocks);
		this.changeState = this.changeState.bind(this);
	}
	componentWillReceiveProps(nextProps){		
		console.log('nextProps', nextProps.state);
		this.setState({			
			mortgagedStocks: nextProps.mortgagedStocks,
			stocksList: nextProps.stocksList,
			userStocks: nextProps.userStocks,
			params : nextProps.mortgagedStocks,
			type: 'getFromMortgage'		
		});

		

		console.log(this.state, 'hi partho');
	}	
	changeState(p){
		console.log('p hu mai..', p, this.state.mortgagedStocks,this.state);
		if(p==1){
			this.setState({
				params: this.state.mortgagedStocks,
				type: 'getFromMortgage',
			})			
		}
		else if(p==2){
			this.setState({
				params: this.state.userStocks,
				type: 'putInMortgage',
			})	
		}
	}
	render(){
		console.log('hey');
		console.log((this.state.stocksList).length);		
		return (
			<div className = "container mortgagePanel">
				<h3 className="dash-head">Morgage Panel</h3>
				<div className="row">
					<div id="button-1" className="btn-1 active-btn col-md-2 col-md-offset-3" onClick={()=>this.changeState(1)}>
						Your Mortgaged Stocks 
					</div>
					<div id="button-1" className="col-md-2 btn-2 passive-btn" onClick={()=>this.changeState(2)}>
						Mortgage Stocks
					</div>
				</div>
				<div className="row">
					<MortgageContainer stocksList={this.state.stocksList} params={this.state.params} type={this.state.type} />
				</div>

				<AlertModal id = "alert-modal" message="Order Placed Successfully" />
				<AlertModal id = "error-modal" message="Not Enough Stocks Available" />
				<AlertModal id = "exceed-modal" message="Max Order Quota Exceeded" />
			</div>
			)
	}
}

module.exports = MortgagePanel;