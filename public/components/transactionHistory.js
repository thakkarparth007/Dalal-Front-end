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
			currentPage: 1,
		}
		console.log(this.state,'history 1',props,props.transactionHistory);
		this.updatePageNumber = this.updatePageNumber.bind(this);
		
	}
	componentWillReceiveProps(nextProps){		
		console.log('nextProps', nextProps.stocksList);
		this.setState({						
			history: nextProps.transactionHistory,									
		});
		console.log(nextProps,'history 2');
		
	}	
	updatePageNumber(x){
		if((this.state.currentPage == 1) && (x == -1)){
			x = 0;
		}
		this.setState({
			currentPage: (currentPage+x),
		});
	}
	render(){		
		let empty = '',currentPageStart,currentPageEnd,transactionList;

		let temp = Object.keys(this.state.history).sort((a,b)=>{return b-a;});
		
		if(this.state.currentPage==1){
			currentPageStart = 0;
			currentPageEnd = 10;
		}
		else{			
			currentPageEnd = 10*(this.state.currentPage);
			currentPageStart = currentPageEnd - 10;
			if(currentPageEnd>temp.length){
				currentPageEnd = temp.length;
			}
			
		}

		if(temp.length>10){
			transactionList = temp.slice(currentPageStart,currentPageEnd);
		}
		else{
			transactionList = temp;
		}

		if(Object.keys(this.state.history).length==0){
			empty = <p className="text-center">You do not have any transactions. </p>;
		}
		return (
			<div className="container transaction-container">
				<h3>Transactions History</h3>
				<div className="row col-md-12">
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
							{								
								transactionList.map((temp)=>{
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
					{empty}
					</div>
				</div>
				<div className="col-md-12">
					<ul className="pagination">
						<li><a onClick={()=>this.updatePageNumber(-1)}>&laquo;</a></li>					
						<li><a onClick={()=>this.updatePageNumber(1)}>&raquo;</a></li>
					</ul>
				</div>
			</div>
			)
	}
}

module.exports = TransactionHistory;