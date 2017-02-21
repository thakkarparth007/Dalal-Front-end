var NetworkService = require('./main.js');
var state = require('./state.js');
//subscribe request for Transactions
NetworkService.Requests.GetTransactions({},function(response){
	if(response.result){
		state.Transactions = response.result.transactionMap;	
	}
	else if(response.errors.badRequestError){
		console.log('Bad Request error');
	}
	else {
		console.log('Internal Server Error');
	}
});

let Streams = NetworkService.ProtoRoot.lookup("dalalstreet.socketapi.models.DataStreamType").values;

NetworkService.DataStreams.Transactions.Subscribe(Streams.TRANSACTIONS,function(response){
	state.Transactions[response.Transaction.id] = response.Transaction;

	//handling cash
	state.User['total'] += response.Transaction.total;

	//handling stocks
	if(Transaction.stockQuantity > 0){
		// we need to add stock
		state.UserStockById[Transaction.stockId] = state.UserStockById[Transaction.stockId] || {
			stockId: Transaction.stockId,
			stockQuantity: 0,
		};
		state.UserStockById[Transaction.stockId].stockQuantity += Transaction.stockQuantity; 
	}
	else{
		// we need to remove stock
		state.UserStockById[Transaction.stockId].stockQuantity += Transaction.stockQuantity; 
		if(state.UserStockById[Transaction.stockId].stockQuantity == 0){
			delete state.UserStockById[Transaction.stockId];
		}
	}
});