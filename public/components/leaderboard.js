import React from 'react';
import ReactDOM from 'react-dom';
var NetworkService = require("./main.js").NetworkService;


var leaderboard = [
	{
		username: 'Tom',
		totalAssets: 12000
	},
	{
		username: 'Dick',
		totalAssets: 100000
	},
	{
		username:'Harry',
		totalAssets: 19203
	}
];
var count = 1;
leaderboard.sort((a,b)=>{return (b.totalAssets - a.totalAssets)});

class LeaderBoard extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			leaderboardDetails: props.leaderboardDetails,
			userDetails: props.userDetails,
		}

		console.log(props,'leader porpos');

	}	
	render(){
		return (
			<table className="table table-striped table-hover table-responsive">
				<thead>
					<tr>
						<th>Rank</th>
						<th>Username</th>
						<th>Cash</th>
						<th>Total Assets</th>
					</tr>
				</thead>
				<tbody>
				{
				
				Object.keys(this.state.leaderboardDetails.rankList).map((y)=>{
					let x = (this.state.leaderboardDetails.rankList)[y];
					return (
							<tr>
								<td>{x.rank}</td>
								<td>{x.userName}</td>
								<td>{x.cash}</td>
								<td>{x.totalWorth}</td>
							</tr>
						);
				})

			}				
				<tr className="user-rank">
					<td>{this.state.leaderboardDetails.myRank}</td>
					<td>Your Rank</td>
					<td>{this.state.userDetails.cash}</td>
					<td>{this.state.userDetails.total}</td>
				</tr>
				</tbody>
			</table>
			);
	}
}

module.exports = LeaderBoard;