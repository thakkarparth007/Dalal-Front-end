import React from 'react';
import ReactDOM from 'react-dom';

var stockTransactions = [
	{
		id: 1,
		userId: 112,
		stockId: 1,
		type: 'orderFill',
		stockQuantity: 100,
		price: 230,
		createdAt: '23rd'
	},
	{
		id: 1,
		userId: 112,
		stockId: 1,
		type: 'buyFromExchange',
		stockQuantity: 50,
		price: 210,
		createdAt: '23rd'
	},
	{
		id: 2,
		userId: 112,
		stockId: 2,
		type: 'mortgage',
		stockQuantity: 200,
		price: 430,
		createdAt: '24rd'
	}
];

class TransactionHistory extends React.Component{
	constructor(props){
		super(props);
		console.log('trans');
		console.log(props.stocksList);
		this.state = {
			history: stockTransactions,			
			stocks: props.stocksList
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
							{(this.state.history).map((x)=>{
								let t,convert,cname;								
								(this.state.stocks).map((y)=>{
									if(y.id == x.id){
										t = y.shortName;										
									}
								})
								if(x.type=='orderFill'){
									convert = 'Order Fill';
									cname = 'orange';
								}
								else if(x.type=='buyFromExchange'){
									convert = 'Buy From Exchange';
									cname = 'green';
								}
								else if(x.type=='mortgage'){
									convert = 'Mortgage';
								}
								else if(x.type=='dividend'){
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