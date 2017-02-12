import React from 'react';
import ReactDOM from 'react-dom';

var NetworkService = require('./main.js');

class TransactionHistory extends React.Component{
	constructor(props){
		super(props);
		
		this.state = {
			history: this.props.transactionHistory,			
			stocks: this.props.stocksList,
			transType : NetworkService.ProtoRoot.lookup("dalalstreet.socketapi.models.TransactionType").values,
		}
	}
	render(){
		return (
			<div className="container transaction-container">
				<h3>Transactions History</h3>
				<div className="row">
					<table className="table table-hover table-responsive">
						<thead>
							<tr>
								<th>Stock Id</th>
								<th>Stock Name</th>
								<th>Transaction Type</th>
								<th>No. of Stocks</th>
								<th>Price of Stock</th>
								<th>Timestamp</th>
							</tr>
						</thead>
						<tbody>
							{Object.keys(this.state.history).map((temp)=>{
								let x = (this.state.history)[temp];

								let t,convert,cname;								
								Object.keys(this.state.stocks).map((z)=>{
									let y = (this.state.stocks)[z];
									if(y.id == x.id){
										t = y.shortName;										
									}
								})																
								console.log(this.state.transType,'wowow');

								if(this.state.transType[x.type]=='ORDER_FILL_TRANSACTION'){
									convert = 'Order Fill';
									cname = 'orange';
								}
								else if(this.state.transType[x.type]=='FROM_EXCHANGE_TRANSACTION'){
									convert = 'Buy From Exchange';
									cname = 'green';
								}
								else if(this.state.transType[x.type]=='MORTGAGE_TRANSACTION'){
									convert = 'Mortgage';
								}
								else if(this.state.transType[x.type]=='DIVIDEND_TRANSACTION'){
									convert = 'Dividend';
									cname = "blue";
								}
								return(
									<tr>
										<td>{x.id}</td>
										<td>{t}</td>
										<td className={cname}>{convert}</td>
										<td>{x.stockQuantity}</td>
										<td>{x.price}</td>
										<td>{x.createdAt}</td>
									</tr>
									)
							})}
							
						</tbody>
					</table>
				</div>
			</div>
			)
	}
}

module.exports = TransactionHistory;