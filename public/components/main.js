import React from 'react';
import ReactDOM from 'react-dom';
const protobuf = require("protobufjs");
const protobufjson = require("../all_protos.json");
const root = protobuf.Root.fromJSON(protobufjson);
const DalalMessage = root.lookup("dalalstreet.socketapi.DalalMessage");
const RequestWrapper = root.lookup("dalalstreet.socketapi.RequestWrapper");
const SubscribeRequest = root.lookup("dalalstreet.socketapi.actions.SubscribeRequest");
const DataStreamType = root.lookup("dalalstreet.socketapi.datastreams.DataStreamType").values;
let state = require('./state.js');
import {observable, extendObservable} from 'mobx';
let MainComponent = require('./body.js');

let nextConnectAttemptIn = 1;
let reconnectingIntervalId = null;
let ws = null;
let originalUrl = window.location;
// let wsWaitingForPong = false
window.ws = ws;
window.estate = state;
// const ws = new WebSocket("ws://10.1.94.134:3000/ws");
// const ws = new WebSocket("ws://192.168.43.79:3000/ws");
// const ws = new WebSocket("ws://10.1.12.143:3000/ws");
// const ws = new WebSocket("ws://192.168.0.48:3000/ws");
$('.connecting').hide();
let NetworkService;
const callbacks = {
	actions: {},
	datastreams: {},
};

const requestQueue = [];

let loggedIn = false;
let lastRequestId = 0;

function onOpen(event) {
			//9788240115
	nextConnectAttemptIn = 1;
	clearInterval(reconnectingIntervalId);

	console.log("Connected!");
	console.log(NetworkService);

	// var email = prompt("Enter email");
	// var password = prompt("Enter password");

	NetworkService.Requests.Login({
		email: '',
		password: ''
	}, function(response) {
		$('.connecting').hide('slow');
		console.log('response ns',response)
		state.IsConnected = true;
		state.NotifyUpdate();

		onLoginResponse(response);
	});

	// let id = setInterval(function() {
	// 	if(wsWaitingForPong) {
	// 		ws.close();
	// 		clearInterval(id);
	// 	}
	// 	ws.send("ping");
	// 	wsWaitingForPong = true;
	// }, 10000);
}

function connect(){
	console.log("In connect()");
	ws = new WebSocket("ws://192.168.0.5:3000/ws");
	window.ws = ws;
	ws.onopen = onOpen;
	ws.onclose = onClose;
	ws.onmessage = onMessage;
}

connect();

function onClose() {
	console.log("Closed");
	state.IsConnected = false;
	state.NotifyUpdate();

	var counter = nextConnectAttemptIn;
	
	reconnectingIntervalId = setInterval(function() {
		counter--;
		$('.connecting').show('slow');
		$('.connecting').text("Reconnecting in " + counter + " seconds");
		if(counter==0){
			$('.connecting').text("Reconnecting now ...");
		}
		else{
			$('.connecting').text("Reconnecting in " + counter + " seconds");
		}
		console.log("Connecting in " + counter + " seconds");
		if(counter <= 0) {
			clearInterval(reconnectingIntervalId);
			connect();
			nextConnectAttemptIn *= 2;
		}
	}, 1000)
}

function onMessage(event) {
	console.log("Got message", event);
	console.log(event.data);

	// if(typeof event.data === "string") {
	// 	wsWaitingForPong = false;
	// 	return;
	// }
	// console.log('pong nahi hai');
	// alert("pong nai hai");

	let arrayBuffer;
	let temp,DM,data;
	let fileReader = new FileReader();
	fileReader.onload = function() {		
	    data = new Uint8Array(this.result);
	    DM = DalalMessage.decode(data);
	    console.log(DM);

	    if(DM.responseWrapper) {
	    	console.log(DM.responseWrapper,'mai aa gaya hu');
	    	let cb = callbacks.actions[DM.responseWrapper.requestId];
	    	delete callbacks.actions[DM.responseWrapper.requestId];
	    	// check if no callback - either server sent wrong reqId, or client didn't register a callback
	    	console.log('Meheram');
	    	console.log(callbacks);
	    	cb(DM.responseWrapper);
	    } else if (DM.dataStreamUpdateWrapper) {
	    	let updateWrapper = DM.dataStreamUpdateWrapper;
	    	let updateCbId = getUpdateCbName(updateWrapper.dataStreamType, updateWrapper.dataStreamId);
	    	console.log(updateWrapper,updateCbId,'maahi maar ra hai',callbacks.datastreams);
	    	let cb = callbacks.datastreams[updateCbId];
	    	// same as above. But don't remove the callback entry.
	    	cb(updateWrapper);
	    } else {
	    	console.log("Error. Impossible.")
	    }
	    console.log(DM);
	};
	fileReader.readAsArrayBuffer(event.data);

	console.log("Yeh mera hai!",temp);
}

function wrapRWAndSend(reqWrap, cb, dsUpdateCb) {
	let DalalMessage = root.lookup("dalalstreet.socketapi.DalalMessage");
	
	let DM = DalalMessage.create();
	DM.requestWrapper = reqWrap;
	DM.requestWrapper.requestId = (++lastRequestId).toString();

	// handle subscribe/unsubscribe specially
	if (DM.requestWrapper.subscribeRequest) {
		let req = DM.requestWrapper.subscribeRequest;
		let original_callback = cb;
		cb = function(responseWrapper) {
			if(responseWrapper.subscribeResponse.result) {
				addSubscribeCb(req.dataStreamType, req.dataStreamId, dsUpdateCb)
			}
			original_callback(responseWrapper);
		}
	} else if (DM.requestWrapper.UnsubscribeRequest) {
		let req = DM.requestWrapper.unsubscribeRequest;
		removeSubscribeCb(req.dataStreamType, req.dataStreamId);
	}
	
	callbacks.actions[DM.requestWrapper.requestId.toString()] = cb;

	let buff = DalalMessage.encode(DM).finish();
	console.log(buff);
	ws.send(buff);
}

function onLoginResponse(response){
	if(!response.result) {
		console.log("Not logged in.")
		let s = window.location.toString().match(/#\/(.*)$/)[1];
		window.location = window.location.toString().replace(/#\/(.*)$/, "#/login");
		return;
	}
	//adding subscribe
	//let Streams = NetworkService.ProtoRoot.lookup("dalalstreet.socketapi.models.DataStreamType").values;

	console.log(response.result,'mera result mahaan');		
	Object.assign(state.User, response.result.user);
	Object.assign(state.AllStockById, response.result.stockList);
	Object.assign(state.UserStockById, response.result.stocksOwned);		
	Object.assign(state.Constants, response.result.constants);		
	state.IsLoggedIn = true;
	state.marketIsClosedHackyNotif = response.result.marketIsClosedHackyNotif;
	state.marketIsOpenHackyNotif = response.result.marketIsOpenHackyNotif;
	state.MarketOpen = response.result.isMarketOpen;
	// state.MarketOpen = response.result.isMarketOpen;

	// Object.assign(state.MortgagedStocks, response.result.mortgagedStocks);
	console.log("kaun hai tu", state);
	// extendObservable(state.UserStockById, response.result.UserStockById);
	state.NotifyUpdate();	
	let stockWorth = 0;
	Object.keys(state.UserStockById).map(id=>{
		stockWorth += state.UserStockById[id]*(state.AllStockById[id].currentPrice);
	})

	state.User.stockWorth = stockWorth;
	state.User.total = state.User.cash + state.User.stockWorth;

	NetworkService.Requests.GetMarketEvents({},function(resp){
		console.log(resp.result.marketEvents,'mera market events!!');
		Object.keys(resp.result.marketEvents).map(id=>{
			let n = (resp.result.marketEvents)[id];
			state.MarketEvents[id] = n;
		});
		state.NotifyUpdate();
	})		

	NetworkService.Requests.GetNotifications({},function(resp){
		console.log(resp.result.notifications,'mera notification!!');
		Object.keys(resp.result.notifications).map(id=>{
			let n = (resp.result.notifications)[id];
			state.Notifications[id] = n;			
			
		})
		state.NotifyUpdate();
	})

	NetworkService.Requests.GetMyBids({},function(resp){
		console.log(resp,'mere get my bids aa gaye!!')
		state.MyOrders.Bids.Open = {};
		state.MyOrders.Bids.Closed = {};

		Object.keys(resp.result.openBidOrders).map(id=>{
			state.MyOrders.Bids.Open[id] = 	resp.result.openBidOrders[id];
		})	

		Object.keys(resp.result.closedBidOrders).map(id=>{
			state.MyOrders.Bids.Closed[id] = 	resp.result.closedBidOrders[id];
		});

		state.NotifyUpdate();
	});

	NetworkService.Requests.GetMyAsks({},function(resp){
		console.log(resp,'mere get my asks aa gaye!!')

		state.MyOrders.Asks.Open = {};
		state.MyOrders.Asks.Closed = {};

		Object.keys(resp.result.openAskOrders).map(id=>{
			state.MyOrders.Asks.Open[id] = 	resp.result.openAskOrders[id];
		})	

		Object.keys(resp.result.closedAskOrders).map(id=>{
			state.MyOrders.Asks.Closed[id] = 	resp.result.closedAskOrders[id];
		});
						
		state.NotifyUpdate();
	});				
	

	

	NetworkService.Requests.GetMortgageDetails({},function(resp){
		console.log(resp.result.mortgageMap,'mere mortgagedStocks aa gaye!!');
		state.MortgagedStocks = {};
		Object.keys(resp.result.mortgageMap).map(id=>{
			state.MortgagedStocks[id] = resp.result.mortgageMap[id];
		})
		console.log(state,'mortgage daala');			
		state.NotifyUpdate();
	})
	
	/*Object.keys(state.AllStockById).sort()[0]

	.map(id=>{
			

		// let s = window.location.toString().match(/#\/(.+)$/)[1];
		
	})*/
		

	NetworkService.Requests.GetTransactions({},function(resp){
		console.log(resp.result.transactionsMap,'mere get my transaction aa gaye!!')
		state.Transactions = {};
		Object.keys(resp.result.transactionsMap).map(id=>{
			state.Transactions[id] = resp.result.transactionsMap[id];
		})
		state.NotifyUpdate();
	})		

	console.log(state,'mera state aa gaya');

	// stock exchange subscribe
	NetworkService.DataStreams.StockExchange.Subscribe(function(resp) {
		console.log(resp, "subscription status");
	}, function(update){
		Object.keys(update.stocksInExchange).map(id=>{
			state.AllStockById[id].currentPrice = update.stocksInExchange[id].price;
			state.AllStockById[id].stocksInExchange = update.stocksInExchange[id].stocksInExchange;
			state.AllStockById[id].stocksInMarket = update.stocksInExchange[id].stocksInMarket;
		})
		state.NotifyUpdate();
	});				

	NetworkService.DataStreams.MyOrders.Subscribe(function(resp) {
		console.log(resp, "subscription myOrders status");
	}, function(update){
		
		if(update.isAsk){
			let ask = state.MyOrders.Asks.Open[update.id];
			if((update.isClosed)){
				state.MyOrders.Asks.Closed[ask.id] = ask;
				delete state.MyOrders.Asks.Open[ask.id];

				ask.isClosed = true;
				if(update.tradeQuantity) {
					ask.stockQuantityFulfilled += update.tradeQuantity;
				}
			}
			else{
				ask.stockQuantityFulfilled += update.tradeQuantity;
			}
		}
		else{
			let bid = state.MyOrders.Bids.Open[update.id];
			if((update.isClosed)){
				state.MyOrders.Bids.Closed[bid.id] = bid;
				delete state.MyOrders.Bids.Open[bid.id];

				bid.isClosed = true;
				if(update.tradeQuantity) {
					bid.stockQuantityFulfilled += update.tradeQuantity;
				}
			}
			else{
				bid.stockQuantityFulfilled += update.tradeQuantity;
			}
		}
		
		state.NotifyUpdate();
	});				

	//subscribe transaction
	//test krna hai ek baar
	NetworkService.DataStreams.Transactions.Subscribe(function(resp) {
		console.log(resp, "subscription status of transactions");
	}, function(update){			
		console.log('transaction update response', update, state.Transactions[update.transaction.id]);		
		if(!state.Transactions[update.transaction.id]){
			state.Transactions[update.transaction.id] = update.transaction;
			// state.Transactions[update.transaction.id] = {};
			// state.Transactions[update.transaction.id].id = update.transaction.id;
			// state.Transactions[update.transaction.id].price = update.transaction.price;
			// state.Transactions[update.transaction.id].stockId = update.transaction.stockId;
			// state.Transactions[update.transaction.id].stockQuantity = update.transaction.stockQuantity;
			// state.Transactions[update.transaction.id].total = update.transaction.total;
			// state.Transactions[update.transaction.id].userId = update.transaction.userId;

			state.User.cash += update.transaction.total;
			state.UserStockById[update.transaction.stockId] += update.transaction.stockQuantity;
			state.NotifyUpdate();
		}

	});				

	//stock prices subscribe
	NetworkService.DataStreams.StockPrices.Subscribe(function(resp) {
		console.log(resp, "subscription status of stock prices");
	}, function(update){
		console.log('stock prices update response', update);
			Object.keys(update.prices).map(id=>{
				state.AllStockById[id].currentPrice = update.prices[id];	
				var newStockWorth = 0;
				Object.keys(state.UserStockById).forEach(stkId => {
					let stkQty = state.UserStockById[stkId];
					newStockWorth += stkQty * state.AllStockById[stkId].currentPrice;
				})
				state.User.stockWorth = newStockWorth;
				state.User.total = state.User.cash + state.User.stockWorth;
			});
			state.NotifyUpdate();			
	});				

	//market events subscribe
	NetworkService.DataStreams.MarketEvents.Subscribe(function(resp) {
		console.log(resp, "subscription status of market events");
	}, function(update){
		state.MarketEvents[update.marketEvent.id] = update.marketEvent;
		state.NotifyUpdate();
	});				


	//notifications subscribe
	NetworkService.DataStreams.Notifications.Subscribe(function(resp) {
		console.log(resp, "subscription status of Notifications");
	}, function(update){
		console.log(update,'yololol');
		// update.id,update.text;
		if(update.notification.text == state.marketIsClosedHackyNotif){
			console.log(update.notification.text,state.marketIsClosedHackyNotif,'checker')
			
			state.MarketOpen = false;
		}
		else if(update.notification.text == state.marketIsOpenHackyNotif){
			state.MarketOpen = true;
		}
		else{
			state.Notifications[update.notification.id] = {
				text: update.notification.text,
			}
			new PNotify({
			    title: state.Notifications[update.notification.id].id,
			    text: state.Notifications[update.notification.id].text,			    
			    icon: 'fa fa-envelope-o',
			    addclass: 'custom-notify',
		        buttons: {
			        closer: false,
			        sticker: false
			    },
			}).get().click(function() {
    				this.remove();
			});;
			// new PNotify({
			    
			//     addclass: 'custom-notify',
			// });
		}
		state.NotifyUpdate();			
	});				
	//MainComponent.setState({
	//	new_state: state
	//});
	// state.User.sessionId = response.result.sessionId;		
	// state.User.total = response.result.user.total;
	// state.User.name = response.result.user.name;
	// state.User.UserStockById = response.result.user.UserStockById;
	// state.User.Transactions = response.result.user.Transactions;

	// Object.keys(response.result.stockList).map((x)=>{
	// 	let y = (response.result.stockList)[x];
	// 	state.AllStockById[x] = y;
	// 	console.log(y,'hi da');			
	// })
	
	requestQueue.forEach(ws.send.bind(ws));
	console.log(state);

	//let s = window.location.toString().match(/#\/(.+)$/)[1];
	if(/#\/login/.test(originalUrl)) {
		originalUrl = window.location.toString().replace(/#.*$/, "#/");
	}
	window.location = originalUrl;
}

function getUpdateCbName(dataStreamType, dataStreamId) {
	let dsId = dataStreamId || "0";
	let updateCbId = dataStreamType + "_" + dsId;
	return updateCbId;
}

function addSubscribeCb(dataStreamType, dataStreamId, updateCb) {
	let updateCbId = getUpdateCbName(dataStreamType, dataStreamId);
	callbacks.datastreams[updateCbId] = updateCb;
}

function removeSubscribeCb(dataStreamType, dataStreamId) {
	let updateCbId = getUpdateCbName(dataStreamType, dataStreamId);
	delete callbacks.datastreams[updateCbId];
}

NetworkService = {
	ProtoRoot: root,
	Requests: {
		BuyStocksFromExchange: function(req, cb) {
			let buyStocksFromExchangeReqWrap = RequestWrapper.create();
			buyStocksFromExchangeReqWrap.buyStocksFromExchangeRequest = req;
			wrapRWAndSend(buyStocksFromExchangeReqWrap, function(respWrap) {
				var resp = respWrap.buyStocksFromExchangeResponse
				if(!resp.result) {
					cb(respWrap.buyStocksFromExchangeResponse);
					return;
				}
				var transaction = resp.result.transaction;
				state.User.stockWorth += transaction.stockQuantity*transaction.price;
				state.User.cash += transaction.total;
				state.User.total = state.User.cash + state.User.stockWorth;
				console.log('sab sahi hia na bhai?',((Object.keys(state.UserStockById).length)+1),parseInt(req.stockId),parseInt(respWrap.buyStocksFromExchangeResponse.result.stockQuantity))

				if(state.UserStockById[req.stockId]){
					state.UserStockById[req.stockId] += transaction.stockQuantity;
				}
				else{
					state.UserStockById[req.stockId] = transaction.stockQuantity;
				}				

				state.AllStockById[req.stockId].stocksInExchange -= transaction.stockQuantity;
				state.AllStockById[req.stockId].stocksInMarket += transaction.stockQuantity;
				state.Transactions[transaction.id] = transaction;
				state.NotifyUpdate();
				console.log('mera state',state);

				cb(respWrap.buyStocksFromExchangeResponse);
			});
		},

		CancelAskOrder: function(req, cb) {
			let cancelAskOrderReqWrap = RequestWrapper.create();
			cancelAskOrderReqWrap.cancelAskOrderRequest = req;
			wrapRWAndSend(cancelAskOrderReqWrap, function(respWrap) {
				cb(respWrap.cancelAskOrderResponse)
			});
		},

		CancelBidOrder: function(req, cb) {
			let cancelBidOrderReqWrap = RequestWrapper.create();
			cancelBidOrderReqWrap.cancelBidOrderRequest = req;
			wrapRWAndSend(cancelBidOrderReqWrap, function(respWrap) {
				cb(respWrap.cancelBidOrderResponse)
			});
		},

		Login: function(req, cb) {
			let loginReqWrap = RequestWrapper.create();
			loginReqWrap.loginRequest = req;
			wrapRWAndSend(loginReqWrap, function(respWrap) {
				console.log('hehe');
				console.log(respWrap);
				cb(respWrap.loginResponse);
			});
		},

		Logout: function(req, cb) {
			let logoutReqWrap = RequestWrapper.create();
			logoutReqWrap.logoutRequest = req;
			wrapRWAndSend(logoutReqWrap, function(respWrap) {
				cb(respWrap.logoutResponse)
			});
		},

		MortgageStocks: function(req, cb) {
			let mortgageStocksReqWrap = RequestWrapper.create();
			mortgageStocksReqWrap.mortgageStocksRequest = req;
			wrapRWAndSend(mortgageStocksReqWrap, function(respWrap) {
				console.log(respWrap, 'hey im mortagge hi',respWrap.mortgageStocksResponse.result,respWrap.mortgageStocksResponse.result.transaction);
				if(respWrap.mortgageStocksResponse.result){					
					let transaction = respWrap.mortgageStocksResponse.result.transaction;
					state.User.cash += (transaction.total);
					console.log(transaction,'mortagge ka transaction');
					state.UserStockById[transaction.stockId] += transaction.stockQuantity;					
					state.Transactions[transaction.id] = transaction;
					if(state.MortgagedStocks[transaction.stockId]) {
						state.MortgagedStocks[transaction.stockId].numStocksInBank -= transaction.stockQuantity;
					}
					else
						state.MortgagedStocks[transaction.stockId].numStocksInBank = -transaction.stockQuantity;

					state.NotifyUpdate();			
				}
				cb(respWrap.mortgageStocksResponse)
			});
		},

		PlaceAskOrder: function(req, cb) {
			let placeAskOrderReqWrap = RequestWrapper.create();
			placeAskOrderReqWrap.placeAskOrderRequest = req;
			wrapRWAndSend(placeAskOrderReqWrap, function(respWrap) {
				console.log(respWrap,'error check');
			if(respWrap.placeAskOrderResponse.result){
				window.merabhai = state.MyOrders.Asks.Open;
				state.MyOrders.Asks.Open[respWrap.placeAskOrderResponse.result.bidId] = {
						id: Object.keys(state.MyOrders.Asks.Open).length + 1,					
						stockId: req.stockId,
						bidId: respWrap.placeAskOrderResponse.result.bidId,
						price: req.price || '-',
						orderType : req.orderType,
						stockQuantity: req.stockQuantity,
						stockQuantityFulfilled: 0,
						isClosed: false,
						createdAt: Date('YYYY-MM-DDT11:22:63')
					};	
					state.NotifyUpdate();
					console.log(state.MyOrders,'checking myorders')	
			}
			else{
				console.log(respWrap.response,'seriosuly');
					console.log(respWrap);
			}												
				cb(respWrap.placeAskOrderResponse);
			});
		},

		PlaceBidOrder: function(req, cb) {
			let placeBidOrderReqWrap = RequestWrapper.create();
			placeBidOrderReqWrap.placeBidOrderRequest = req;
			wrapRWAndSend(placeBidOrderReqWrap, function(respWrap) {
				console.log(respWrap,'error check',respWrap.placeBidOrderResponse.result, (respWrap.placeBidOrderResponse.result=='PlaceBidOrderSuccessResponse'));

				console.log(Object.keys(state.MyOrders.Bids.Open).length + 1,'yehi hu mai');
				if(respWrap.placeBidOrderResponse.result){
					state.MyOrders.Bids.Open[respWrap.placeBidOrderResponse.result.bidId] = {
						id: respWrap.placeBidOrderResponse.result.bidId,
						stockId: parseInt(req.stockId),						
						price: parseInt(req.price) || '-',
						orderType : req.orderType,
						stockQuantityFulfilled: 0,
						stockQuantity: parseInt(req.stockQuantity),												
						createdAt: Date('YYYY-MM-DDT11:22:63')
					};	
					state.NotifyUpdate();				
					console.log(state.MyOrders,'checking myorders')	
				}
				else{

					console.log(respWrap.response,'seriosuly');
					console.log(respWrap);
				}					
				cb(respWrap.placeBidOrderResponse);
			});
		},

		RetrieveMortgageStocks: function(req, cb) {
			let retrieveMortgageStocksReqWrap = RequestWrapper.create();
			retrieveMortgageStocksReqWrap.retrieveMortgageStocksRequest = req;
			wrapRWAndSend(retrieveMortgageStocksReqWrap, function(respWrap) {
				if(respWrap.retrieveMortgageStocksResponse.result){					
					let transaction = respWrap.retrieveMortgageStocksResponse.result.transaction;
					state.User.cash += (transaction.total);

					state.UserStockById[transaction.stockId] += transaction.stockQuantity;					
					state.Transactions[transaction.id] = transaction;
					state.MortgagedStocks[transaction.stockId] = transaction;
					state.NotifyUpdate();			
				}
				cb(respWrap.retrieveMortgageStocksResponse)
			});
		},

		Unsubscribe: function(req, cb) {
			let unsubscribeReqWrap = RequestWrapper.create();
			unsubscribeReqWrap.unsubscribeRequest = req;
			wrapRWAndSend(unsubscribeReqWrap, function(respWrap) {
				cb(respWrap.unsubscribeResponse)
			});
		},

		Subscribe: function(req, cb) {
			let subscribeReqWrap = RequestWrapper.create();
			subscribeReqWrap.subscribeRequest = req;
			wrapRWAndSend(subscribeReqWrap, function(respWrap) {
				cb(respWrap.subscribeResponse)
			});
		},

		GetCompanyProfile: function(req, cb) {
			let getCompanyProfileReqWrap = RequestWrapper.create();
			getCompanyProfileReqWrap.getCompanyProfileRequest = req;
			wrapRWAndSend(getCompanyProfileReqWrap, function(respWrap) {
				cb(respWrap.getCompanyProfileResponse)
			});
		},

		GetMarketEvents: function(req, cb) {
			let getMarketEventsReqWrap = RequestWrapper.create();
			getMarketEventsReqWrap.getMarketEventsRequest = req;
			wrapRWAndSend(getMarketEventsReqWrap, function(respWrap) {
				cb(respWrap.getMarketEventsResponse)
			});
		},

		GetMyAsks: function(req, cb) {
			let getMyAsksReqWrap = RequestWrapper.create();
			getMyAsksReqWrap.getMyAsksRequest = req;
			wrapRWAndSend(getMyAsksReqWrap, function(respWrap) {
				cb(respWrap.getMyAsksResponse)
			});
		},

		GetMyBids: function(req, cb) {
			let getMyBidsReqWrap = RequestWrapper.create();
			getMyBidsReqWrap.getMyBidsRequest = req;
			wrapRWAndSend(getMyBidsReqWrap, function(respWrap) {
				cb(respWrap.getMyBidsResponse)
			});
		},

		GetNotifications: function(req, cb) {
			let getNotificationsReqWrap = RequestWrapper.create();
			getNotificationsReqWrap.getNotificationsRequest = req;
			wrapRWAndSend(getNotificationsReqWrap, function(respWrap) {
				cb(respWrap.getNotificationsResponse)
			});
		},

		GetTransactions: function(req, cb) {
			let getTransactionsReqWrap = RequestWrapper.create();
			getTransactionsReqWrap.getTransactionsRequest = req;
			wrapRWAndSend(getTransactionsReqWrap, function(respWrap) {
				cb(respWrap.getTransactionsResponse)
			});
		},

		GetMortgageDetails: function(req, cb) {
			let getMortgageDetailsReqWrap = RequestWrapper.create();
			getMortgageDetailsReqWrap.getMortgageDetailsRequest = req;
			wrapRWAndSend(getMortgageDetailsReqWrap, function(respWrap) {
				cb(respWrap.getMortgageDetailsResponse)
			});
		},

		GetLeaderboard: function(req, cb) {
			let getLeaderboardReqWrap = RequestWrapper.create();
			getLeaderboardReqWrap.getLeaderboardRequest = req;
			wrapRWAndSend(getLeaderboardReqWrap, function(respWrap) {
				cb(respWrap.getLeaderboardResponse)
			});
		},
	},
	DataStreams: {
		MarketDepth: {
			Subscribe(stockId, subscribeCb, updateCb) {
				let subscribeReq = SubscribeRequest.create();
				subscribeReq.dataStreamType = DataStreamType.MARKET_DEPTH;
				subscribeReq.dataStreamId = stockId;

				let subscribeReqWrap = RequestWrapper.create();
				subscribeReqWrap.subscribeRequest = subscribeReq;
				wrapRWAndSend(subscribeReqWrap, function(respWrap) {
					subscribeCb(respWrap.subscribeResponse);
				}, function(updateWrap) {
					updateCb(updateWrap.marketDepthUpdate);
				});
			},
			Unsubscribe(stockId, unsubscribeCb) {
				let unsubscribeReq = SubscribeRequest.create();
				unsubscribeReq.dataStreamType = DataStreamType.MARKET_DEPTH;
				unsubscribeReq.dataStreamId = stockId;

				let unsubscribeReqWrap = RequestWrapper.create();
				unsubscribeReqWrap.unsubscribeRequest = unsubscribeReq;
				wrapRWAndSend(unsubscribeReqWrap, function(respWrap) {
					cb(respWrap.unsubscribeResponse);
				});
			},
		},
	   	Transactions: {
	   		Subscribe(subscribeCb, updateCb) {
	   			let subscribeReq = SubscribeRequest.create();
	   			subscribeReq.dataStreamType = DataStreamType.TRANSACTIONS;	   			

	   			let subscribeReqWrap = RequestWrapper.create();
	   			subscribeReqWrap.subscribeRequest = subscribeReq;
	   			wrapRWAndSend(subscribeReqWrap, function(respWrap) {
	   				subscribeCb(respWrap.subscribeResponse);
	   			}, function(updateWrap) {
	   				updateCb(updateWrap.transactionUpdate);
	   			});
	   		},
	   		Unsubscribe(unsubscribeCb) {
	   			let unsubscribeReq = SubscribeRequest.create();
	   			unsubscribeReq.dataStreamType = DataStreamType.TRANSACTIONS;

	   			let unsubscribeReqWrap = RequestWrapper.create();
	   			unsubscribeReqWrap.unsubscribeRequest = unsubscribeReq;
	   			wrapRWAndSend(unsubscribeReqWrap, function(respWrap) {
	   				cb(respWrap.unsubscribeResponse);
	   			});
	   		},
	   	},
	   	Notifications: {
	   		Subscribe(subscribeCb, updateCb) {
	   			let subscribeReq = SubscribeRequest.create();
	   			subscribeReq.dataStreamType = DataStreamType.NOTIFICATIONS;	   			

	   			let subscribeReqWrap = RequestWrapper.create();
	   			subscribeReqWrap.subscribeRequest = subscribeReq;
	   			wrapRWAndSend(subscribeReqWrap, function(respWrap) {
	   				subscribeCb(respWrap.subscribeResponse);
	   			}, function(updateWrap) {
	   				updateCb(updateWrap.notificationUpdate);
	   			});
	   		},
	   		Unsubscribe(unsubscribeCb) {
	   			let unsubscribeReq = SubscribeRequest.create();
	   			unsubscribeReq.dataStreamType = DataStreamType.NOTIFICATIONS;

	   			let unsubscribeReqWrap = RequestWrapper.create();
	   			unsubscribeReqWrap.unsubscribeRequest = unsubscribeReq;
	   			wrapRWAndSend(unsubscribeReqWrap, function(respWrap) {
	   				cb(respWrap.unsubscribeResponse);
	   			});
	   		},
	   	},
	    StockPrices: {
	    	Subscribe(subscribeCb, updateCb) {
	   			let subscribeReq = SubscribeRequest.create();
	   			subscribeReq.dataStreamType = DataStreamType.STOCK_PRICES;	   			

	   			let subscribeReqWrap = RequestWrapper.create();
	   			subscribeReqWrap.subscribeRequest = subscribeReq;
	   			wrapRWAndSend(subscribeReqWrap, function(respWrap) {
	   				subscribeCb(respWrap.subscribeResponse);
	   			}, function(updateWrap) {
	   				updateCb(updateWrap.stockPricesUpdate);
	   			});
	   		},
	   		Unsubscribe(unsubscribeCb) {
	   			let unsubscribeReq = SubscribeRequest.create();
	   			unsubscribeReq.dataStreamType = DataStreamType.STOCK_PRICES;

	   			let unsubscribeReqWrap = RequestWrapper.create();
	   			unsubscribeReqWrap.unsubscribeRequest = unsubscribeReq;
	   			wrapRWAndSend(unsubscribeReqWrap, function(respWrap) {
	   				cb(respWrap.unsubscribeResponse);
	   			});
	   		},
	    },
	    StockExchange: {
	    	Subscribe(subscribeCb, updateCb) {
	   			let subscribeReq = SubscribeRequest.create();
	   			subscribeReq.dataStreamType = DataStreamType.STOCK_EXCHANGE;	   			

	   			let subscribeReqWrap = RequestWrapper.create();
	   			subscribeReqWrap.subscribeRequest = subscribeReq;
	   			wrapRWAndSend(subscribeReqWrap, function(respWrap) {
	   				subscribeCb(respWrap.subscribeResponse);
	   			}, function(updateWrap) {
	   				updateCb(updateWrap.stockExchangeUpdate);
	   			});
	   		},
	   		Unsubscribe(unsubscribeCb) {
	   			let unsubscribeReq = SubscribeRequest.create();
	   			unsubscribeReq.dataStreamType = DataStreamType.STOCK_EXCHANGE;

	   			let unsubscribeReqWrap = RequestWrapper.create();
	   			unsubscribeReqWrap.unsubscribeRequest = unsubscribeReq;
	   			wrapRWAndSend(unsubscribeReqWrap, function(respWrap) {
	   				cb(respWrap.unsubscribeResponse);
	   			});
	   		},
	    },
	    MarketEvents: {
	    	Subscribe(subscribeCb, updateCb) {
	   			let subscribeReq = SubscribeRequest.create();
	   			subscribeReq.dataStreamType = DataStreamType.MARKET_EVENTS;	   			

	   			let subscribeReqWrap = RequestWrapper.create();
	   			subscribeReqWrap.subscribeRequest = subscribeReq;
	   			wrapRWAndSend(subscribeReqWrap, function(respWrap) {
	   				subscribeCb(respWrap.subscribeResponse);
	   			}, function(updateWrap) {
	   				updateCb(updateWrap.marketEventsUpdate);
	   			});
	   		},
	   		Unsubscribe(unsubscribeCb) {
	   			let unsubscribeReq = SubscribeRequest.create();
	   			unsubscribeReq.dataStreamType = DataStreamType.MARKET_EVENTS;

	   			let unsubscribeReqWrap = RequestWrapper.create();
	   			unsubscribeReqWrap.unsubscribeRequest = unsubscribeReq;
	   			wrapRWAndSend(unsubscribeReqWrap, function(respWrap) {
	   				cb(respWrap.unsubscribeResponse);
	   			});
	   		},
	    },
	   	MyOrders: {
	   		Subscribe(subscribeCb, updateCb) {
	   			let subscribeReq = SubscribeRequest.create();
	   			subscribeReq.dataStreamType = DataStreamType.MY_ORDERS;	   			

	   			let subscribeReqWrap = RequestWrapper.create();
	   			subscribeReqWrap.subscribeRequest = subscribeReq;
	   			wrapRWAndSend(subscribeReqWrap, function(respWrap) {
	   				subscribeCb(respWrap.subscribeResponse);
	   			}, function(updateWrap) {
	   				updateCb(updateWrap.myOrderUpdate);
	   			});
	   		},
	   		Unsubscribe(unsubscribeCb) {
	   			let unsubscribeReq = SubscribeRequest.create();
	   			unsubscribeReq.dataStreamType = DataStreamType.MY_ORDERS;

	   			let unsubscribeReqWrap = RequestWrapper.create();
	   			unsubscribeReqWrap.unsubscribeRequest = unsubscribeReq;
	   			wrapRWAndSend(unsubscribeReqWrap, function(respWrap) {
	   				cb(respWrap.unsubscribeResponse);
	   			});
	   		},
	   	}
	}
}

console.log('yoososo',NetworkService);

module.exports = {NetworkService, state, onLoginResponse};
