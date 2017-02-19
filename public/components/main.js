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
// const ws = new WebSocket("ws://10.1.94.138:3000/ws");
const ws = new WebSocket("ws://172.20.10.11:3000/ws");
let NetworkService;
const callbacks = {
	actions: {},
	datastreams: {},
};

let loggedIn = false;
let lastRequestId = 0;

ws.onopen = function(event) {
	console.log("Connected!");
	console.log(NetworkService);
	// var email = prompt("Enter email");
	// var password = prompt("Enter password");

	NetworkService.Requests.Login({
		email: '106114081@nitt.edu',
		password: '081'
	}, function(response) {
		if(!response.result) {
			console.log("Not logged in.")
			// redirect to login page			
		}
		//adding subscribe
		//let Streams = NetworkService.ProtoRoot.lookup("dalalstreet.socketapi.models.DataStreamType").values;

		console.log(response.result);		
		extendObservable(state.User, response.result.user);
		extendObservable(state.AllStockById, response.result.stockList);
		// extendObservable(state.UserStockById, response.result.UserStockById);
		state.NotifyUpdate();		
		NetworkService.DataStreams.StockExchange.Subscribe(function(resp) {
			console.log(resp, "subscription status");
		}, function(response){
			Object.keys(state.AllStockById).map(id=>{
				state.AllStockById[id].currentPrice = response.stocksInExchange.price;
				state.AllStockById[id].stocksInExchange = response.stocksInExchange.stocksInExchange;
				state.AllStockById[id].stocksInMarket = response.stocksInExchange.stocksInMarket;
			})
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
		
		console.log(state);
	});
}

ws.onmessage = function(event) {
	console.log("Got message", event);
	console.log(event.data);

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
				if(!respWrap.buyStocksFromExchangeResponse.notEnoughStocksError){
					state.User.cash -= respWrap.buyStocksFromExchangeResponse.result.stockQuantity*respWrap.buyStocksFromExchangeResponse.result.tradingPrice;
					state.UserStockById[((Object.keys(state.UserStockById).length)+1)] = {
						id: parseInt(req.stockId),
						stockQuantity: parseInt(respWrap.buyStocksFromExchangeResponse.result.stockQuantity),
					};
					state.AllStockById[req.stockId].stocksInExchange -= respWrap.buyStocksFromExchangeResponse.result.stockQuantity;
									state.AllStockById[req.stockId].stocksInMarket += respWrap.buyStocksFromExchangeResponse.result.stockQuantity;
					state.NotifyUpdate();						
					console.log('mera state',state);
				}
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
			wrapRWAndSend(LogoutReqWrap, function(respWrap) {
				cb(respWrap.logoutResponse)
			});
		},

		MortgageStocks: function(req, cb) {
			let mortgageStocksReqWrap = RequestWrapper.create();
			mortgageStocksReqWrap.mortgageStocksRequest = req;
			wrapRWAndSend(mortgageStocksReqWrap, function(respWrap) {
				cb(respWrap.mortgageStocksResponse)
			});
		},

		PlaceAskOrder: function(req, cb) {
			let placeAskOrderReqWrap = RequestWrapper.create();
			placeAskOrderReqWrap.placeAskOrderRequest = req;
			wrapRWAndSend(placeAskOrderReqWrap, function(respWrap) {
				(state.MyOrders.Asks.Open)[Object.keys(state.MyOrders.Asks.Open).length + 1] = {
					id: Object.keys(state.MyOrders.Asks.Open).length + 1,					
					stockId: req.stockId,
					price: req.price,
					orderType : req.orderType,
					stockQuantity: req.stockQuantity,
					isClosed: false,
					createdAt: Date('YYYY-MM-DDT11:22:63')
				};				
				state.NotifyUpdate();										
				cb(respWrap.response);
			});
		},

		PlaceBidOrder: function(req, cb) {
			let placeBidOrderReqWrap = RequestWrapper.create();
			placeBidOrderReqWrap.placeBidOrderRequest = req;
			wrapRWAndSend(placeBidOrderReqWrap, function(respWrap) {
				console.log(Object.keys(state.MyOrders.Bids.Open).length + 1,'yehi hu mai');
				(state.MyOrders.Bids.Open)[Object.keys(state.MyOrders.Bids.Open).length + 1] = {
					id: Object.keys(state.MyOrders.Bids.Open).length + 1,					
					stockId: req.stockId,
					price: req.price,
					orderType : req.orderType,
					stockQuantity: req.stockQuantity,
					isClosed: false,
					createdAt: Date('YYYY-MM-DDT11:22:63')
				};	
				state.NotifyUpdate();										
				cb(respWrap.response);
			});
		},

		RetrieveMortgageStocks: function(req, cb) {
			let retrieveMortgageStocksReqWrap = RequestWrapper.create();
			retrieveMortgageStocksReqWrap.retrieveMortgageStocksRequest = req;
			wrapRWAndSend(retrieveMortgageStocksReqWrap, function(respWrap) {
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
	   				updateCb(updateWrap.transactionsUpdate);
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
	   				updateCb(updateWrap.notificationsUpdate);
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
	}
}

console.log('yoososo',NetworkService);

module.exports = {NetworkService, state};
