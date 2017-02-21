import {observable, extendObservable, map} from 'mobx';

var listeners = [];

var state = {
	IsConnected: false,
	User: {
		sessionId: '',
		name: '',
		cash: 0,
		stockWorth: 0,
		total: 0,
	},	
	UserStockById:{
		1: 100,		
	},
	AllStockById: {
		1: {
			id: 1,
			shortName: 'Pragyan',
			fullName: 'Pragyan',
		 	description: "The Avatar The Avatar The AvatarThe AvatarTheThe AvatarThe AvatarThe AvatarThe Avatar",
			currentPrice: 100,
			dayHigh: 109,
			dayLow: 90,
			allTimeHigh: 120,
			allTimeLow: 76,
			stocksInExchange: 10,
			stocksInMarket: 150,
			upOrDown: true,
			previousDayClose: 50,
			createdAt: Date('YYYY-MM-DDT11:22:63'),
			updatedAt: Date('YYYY-MM-DDT13:22:44')
		},
	},
	Transactions:{
		1: {
			id: 1,			
			stockId: 1,
			type: 1,
			stockQuantity: 100,
			price: 230,
			total: 1000,			
		},
		2: {
			id: 1,			
			stockId: 1,
			type: 2,
			stockQuantity: 50,
			price: 210,
			total: -50,			
		},
	},
	MortgagedStocks: {
		
	},
	MyOrders: {
			Bids: {
				Open:{
					1:{
						id : 1,						
						stockId : 1,
						price : 100,
						orderType : 'Fill',
						stockQuantity : '10',
						stockQuantityFulfilled : '20',
						isClosed : false,
						createdAt :'' ,
						updatedAt : '' ,
					}
					},
				Closed:{
					1:{
						id : 1,						
						stockId : 1,
						price : 100,
						orderType : 'Market',
						stockQuantity : '20',
						stockQuantityFulfilled : '30',
						isClosed : true,
						createdAt :'' ,
						updatedAt : '' ,
					}
				},
			},
			Asks:{
				Open:{
					1:{
						id : 1,						
						stockId : 1,
						price : 100,
						orderType : 'fill',
						stockQuantity : '40',
						stockQuantityFulfilled : '50',
						isClosed : false,
						createdAt :'' ,
						updatedAt : '' ,
					}
				},
				Closed:{
					1:{
						id : 1,						
						stockId : 1,
						price : 100,
						orderType : 'market',
						stockQuantity : '60',
						stockQuantityFulfilled : '70',
						isClosed : true,
						createdAt :'' ,
						updatedAt : '' ,
					}
				},
			},
	},
	CompanyProfile: {

	},
	Notifications: {
		
	},
	Leaderboard: {
		myRank: 0,
		rankList: {

		}
	},
	Status: {
		ExchangeUnderProcess: false,
		BidOrAskUnderProcess: false,
	}	
};

window.listeners = listeners;
Object.defineProperty(state, 'Listen', {
	value: function(cb) {
		listeners.push(cb);
	}
});

Object.defineProperty(state, 'NotifyUpdate', {
	value: function() {
		listeners.forEach(cb => cb(state));
	}
});

/*

ORDERFILL_TRANSACTION_COMPLETE(stockId, stockQuantityDelta, stockPrice, total)
FROM_EXCHANGE_TRANSACTION_COMPLETE(stockId, )

UPDATE_USER_STOCK(stockId, stockQuantityDelta)
UPDATE_STOCK_PRICE



1: {
			id: 1,
			shortName: 'Pragyan',
			fullName: 'Festember',
		 	description: "The Avatar The Avatar The AvatarThe AvatarTheThe AvatarThe AvatarThe AvatarThe Avatar",
			currentPrice: 100,
			dayHigh: 109,
			dayLow: 90,
			allTimeHigh: 120,
			allTimeLow: 76,
			stocksInExchange: 10,
			stocksInMarket: 150,
			upOrDown: true,
			createdAt: Date('YYYY-MM-DDT11:22:63'),
			updatedAt: Date('YYYY-MM-DDT13:22:44')
		},

const state = {
	User: {
		sessionId: '',
		name: '',
		cash: 0,
		stockWorth: 0,
		total: 0,
	},
	UserStockById:{
		1: {
			id: 1,
			stockQuantity: 100,
		},
		2: {
			id: 2,
			stockQuantity: 100,
		},
	},
	AllStockById:{
		1: {
			id: 1,
			shortName: 'Pragyan',
			fullName: 'Pragyan',
		 	description: "The Avatar The Avatar The AvatarThe AvatarTheThe AvatarThe AvatarThe AvatarThe Avatar",
			currentPrice: 100,
			dayHigh: 109,
			dayLow: 90,
			allTimeHigh: 120,
			allTimeLow: 76,
			stocksInExchange: 10,
			stocksInMarket: 150,
			upOrDown: true,
			createdAt: Date('YYYY-MM-DDT11:22:63'),
			updatedAt: Date('YYYY-MM-DDT13:22:44')
		},
		2: {
			id: 2,
			shortName: 'Festember',
			fullName: 'Festember',
		 	description: "The Avatar The Avatar The AvatarThe AvatarTheThe AvatarThe AvatarThe AvatarThe Avatar",
			currentPrice: 100,
			dayHigh: 109,
			dayLow: 90,
			allTimeHigh: 120,
			allTimeLow: 76,
			stocksInExchange: 10,
			stocksInMarket: 150,
			upOrDown: true,
			createdAt: Date('YYYY-MM-DDT11:22:63'),
			updatedAt: Date('YYYY-MM-DDT13:22:44')
		},
	},
	Transactions:{
		1: {
			id: 1,
			userId: 112,
			stockId: 1,
			type: 1,
			stockQuantity: 100,
			price: 230,
			createdAt: '23rd'
		},
		2: {
			id: 1,
			userId: 112,
			stockId: 1,
			type: 2,
			stockQuantity: 50,
			price: 210,
			createdAt: '23rd'
		},
		3: {
			id: 2,
			userId: 112,
			stockId: 2,
			type: 3,
			stockQuantity: 200,
			price: 430,
			createdAt: '24rd'
		},
	}
};

*/

module.exports = state;