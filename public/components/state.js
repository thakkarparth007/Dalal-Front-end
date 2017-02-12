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

/*

ORDERFILL_TRANSACTION_COMPLETE(stockId, stockQuantityDelta, stockPrice, total)
FROM_EXCHANGE_TRANSACTION_COMPLETE(stockId, )

UPDATE_USER_STOCK(stockId, stockQuantityDelta)
UPDATE_STOCK_PRICE

*/

module.exports = state;