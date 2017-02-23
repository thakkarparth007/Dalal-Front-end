import React from 'react';
import ReactDOM from 'react-dom';

var NetworkService = require('./main.js').NetworkService;

// class TransactionContainer extends React.Component{
// 	constructor(props){
// 		super(props);
// 		this.state = {
// 			history: props.history,
// 			currentPageStart: props.currentPageStart,
// 			currentPageEnd: props.currentPageEnd,
// 			stocks: props.stocks,
// 		}		
// 	}
// 	render(){
		
// 		return 	(
// 		<th>
		
// 		</th>
// 			)		
		
// 	}
// }

class TransactionHistory extends React.Component{
	constructor(props){
		super(props);
		
		this.state = {
			history: this.props.transactionHistory,			
			stocks: this.props.stocksList,
			transType : NetworkService.ProtoRoot.lookup("dalalstreet.socketapi.models.TransactionType").values,
			currentPage: 1,
			currentPageStart: 0,
			currentPageEnd: 10,
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
		let temp = Object.keys(this.state.history).sort((a,b)=>{return b-a;});
		let cpe,cps;
		if((this.state.currentPage == 1)){			
			cps = 0;cpe = 10;
			if(temp.length < this.state.currentPageEnd){
				cpe = temp.length;				
			}
			if((x == -1))
				x = 0;
		}
		else{
			cpe = (this.state.currentPage)*(10);
			cps = cpe - 10;
			if(temp.length < cpe){
				cpe = temp.length;
			}
		}
		// alert(this.state.currentPage+'currentPage'+x+'x'+ 'cpe'+ cpe + 'cps'+ cps);
		console.log(this.state.currentPage,x,cpe,cps,'hey buddy',);
		this.setState({
			currentPage: (this.state.currentPage+x),
			currentPageEnd: cpe,
			currentPageStart: cps,
		});

	}
	render(){		
		let empty = '',currentPageStart,currentPageEnd,transactionList;						

		if(Object.keys(this.state.history).length==0){
			empty = <p className="text-center">You do not have any transactions. </p>;
		}		
		
		let sort = (Object.keys(this.state.history)).sort((a,b) => {
			+a < +b
		});
		console.log(this.state,sort,'sored')
		// alert(sort);
		let sliced = (sort).slice(this.state.currentPageStart ,this.state.currentPageEnd);
		// alert(sliced);
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
								sliced.map(k=>{
									let x = (this.state.history)[k];

									let t,convert,cname;								
									Object.keys(this.state.stocks).map((z)=>{
										let y = (this.state.stocks)[z];
										if(y.id == x.stockId){
											t = y.shortName;										
										}
									})																				

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
									return (
										<tr>
											<td>{x.id}</td>
											<td>{t}</td>
											<td className={cname}>{convert}</td>
											<td>{x.stockQuantity}</td>
											<td>{(x.price==0)?'-':x.price}</td>
											<td>{x.total}</td>
										</tr>
										)
								})			
							}
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