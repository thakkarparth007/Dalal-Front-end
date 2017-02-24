import React from 'react';
import ReactDOM from 'react-dom';
var NetworkService = require("./main.js").NetworkService;
var state = require("./state.js");


class LeaderBoard extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			myRank: '',
			rankList: '',			
			lastUpdate: 0,
			isFetching: false,
			time: 0,	
			userDetails: props.userDetails,
		}
		setTimeout(()=>{
			this.setState({
				time: (new Date() - this.state.lastUpdate),
			});
		},1000);
		console.log(props,'leader porpos');
	}
	componentWillMount() {
		if(this.state.isFetching) return;
		var nextUpdateIn = 2*60*1000 - (new Date() - this.state.lastUpdate);
		if(nextUpdateIn < 0) {
			nextUpdateIn = 0;
		}
		var realWork = () => {
			this.isFetching = true;			
			NetworkService.Requests.GetLeaderboard({}, (resp) => {
				this.isFetching = false;
				console.log(resp.result,'mera leaderboard!!');
				var userDetailsRowId = Object.keys(resp.result.rankList)
										.filter(rowId => {
											return resp.result.rankList[rowId].userId == state.User.id
										});
				this.setState({
					myRank: resp.result.myRank,
					rankList: resp.result.rankList,
					lastUpdate: new Date(),					
				});
				console.log(resp.result.rankList[userDetailsRowId],'mera details');
			})
		}
		setTimeout(() => {
			realWork();
			this.updateIntervalId = setInterval(realWork, 2*60*1000);
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
			fetch = "LeaderBoard data updated " + (this.state.time)/1000 + "seconds ago. Cash and stock worth shown is not the latest ones.";
		return (
			<div className="container">
			<div className="leaderboard-container row col-md-10">			
			<p className="leaderboard-fetch">{fetch}</p>
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
				
				Object.keys(this.state.rankList).map((y)=>{
					let x = (this.state.rankList)[y];
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
					<td>{this.state.myRank}</td>
					<td>Your Rank</td>
					<td>{this.state.userDetails.cash}</td>
					<td>{this.state.userDetails.total}</td>
				</tr>
				</tbody>
			</table>			
			</div>
			</div>
			);
	}
}

module.exports = LeaderBoard;