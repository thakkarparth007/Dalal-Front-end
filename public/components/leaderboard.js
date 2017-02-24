import React from 'react';
import ReactDOM from 'react-dom';
var NetworkService = require("./main.js").NetworkService;


class LeaderBoard extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			//leaderboardDetails: props.leaderboardDetails,
			//userDetails: props.userDetails,
			lastUpdate: 0,
			isFetching: false,
		}

		console.log(props,'leader porpos');
	}
	componentWillMount() {
		if(this.state.isFetching) return;
		var nextUpdateIn = 2*60*1000 - (new Date() - this.state.lastUpdate);
		if(nextUpdateIn < 0) {
			nextUpdateIn = 0;
		}
		setTimeout(() => {
			this.updateIntervalId = setInterval(() => {
				this.isFetching = true;
				NetworkService.Requests.GetLeaderboard({}, (resp) => {
					this.isFetching = false;
					console.log(resp.result,'mera leaderboard!!');
					this.setState({
						myRank: resp.result.myRank,
						rankList: resp.result.rankList,
						lastUpdate: new Date(),
						userDetails: resp.result.rankList.filter(row => row.userId == state.User.id),
					});
				})
			}, 2*60*1000);
		}, nextUpdateIn);
	}
	componentWillUnmount() {
		clearInterval(this.updateIntervalId);
	}
	render(){
		let fetch = '';
		if(this.state.isFetching)
			fetch = "Updating LeaderBoard";
		else
			fetch = "LeaderBoard data updated " + (new Date() - this.state.lastUpdate)/1000 + "seconds ago. Cash and stock worth shown is not the latest ones.";
		return (
			<div className="leaderboard-container">			
			{fetch}
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

				<ul className="pagination">
					<li><a href="#">&laquo;</a></li>				
					<li><a href="#">&raquo;</a></li>
				</ul>
			</div>
			);
	}
}

module.exports = LeaderBoard;