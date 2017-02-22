import React from 'react';
import ReactDOM from 'react-dom';

var NetworkService = require('./main.js').NetworkService;

class TransactionHistory extends React.Component{
	constructor(props){
		super(props);
		
		this.state = {
			history: this.props.transactionHistory,			
			stocks: this.props.stocksList,
			transType : NetworkService.ProtoRoot.lookup("dalalstreet.socketapi.models.TransactionType").values,
		}
		console.log(this.state,'history 1',props,props.transactionHistory);
		this.lazyScroll();
	}
	componentWillReceiveProps(nextProps){		
		console.log('nextProps', nextProps.stocksList);
		this.setState({						
			history: nextProps.transactionHistory,									
		});
		console.log(nextProps,'history 2');
		
	}
	lazyScroll(){
		var win = $(window);
		var doc = $(doc);
		
		console.log(win,doc,'vim');
		console.log(win.scroll)
		win.scroll(function(){
		    if(doc.height() - win.height() == win.scrollTop()){
		        console.log('end pahucha');	
		    }
		})
	}
	render(){
		return (
			<div className="container transaction-container">
				<h3>Transactions History</h3>
				<div className="row col-md-10">
				<div className="table-responsive table-hover col-md-11">
					<table className="table">
						<thead>
							<tr>
								<th>Transaction Id</th>
								<th>Stock Name</th>
								<th>Transaction Type</th>
								<th>No. of Stocks</th>								
								<th>Price of Stock</th>
								<th>Total</th>								
							</tr>
						</thead>
						<tbody>
							{Object.keys(this.state.history).sort((a,b)=> b-a).map((temp)=>{
								let x = (this.state.history)[temp];

								let t,convert,cname;								
								Object.keys(this.state.stocks).map((z)=>{
									let y = (this.state.stocks)[z];
									if(y.id == x.stockId){
										t = y.shortName;										
									}
								})																
								console.log(this.state.transType,'wowow');

								if(this.state.transType[x.type]=='ORDER_FILL_TRANSACTION'){
									convert = 'Order Fill';									
								}
								else if(this.state.transType[x.type]=='FROM_EXCHANGE_TRANSACTION'){
									convert = 'Buy From Exchange';									
								}
								else if(this.state.transType[x.type]=='MORTGAGE_TRANSACTION'){
									convert = 'Mortgage';
								}
								else if(this.state.transType[x.type]=='DIVIDEND_TRANSACTION'){
									convert = 'Dividend';									
								}

								if(x.total >= 0){
									cname = "green";
								}
								else{
									cname = "red";
								}
								return(
									<tr>
										<td>{x.id}</td>
										<td>{t}</td>
										<td className={cname}>{convert}</td>
										<td>{x.stockQuantity}</td>
										<td>{(x.price==0)?'-':x.price}</td>
										<td>{x.total}</td>
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

module.exports = TransactionHistory;