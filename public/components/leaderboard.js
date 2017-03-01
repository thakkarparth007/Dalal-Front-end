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
			totalUsers: 0,
			currentPage: 0,
		}
		var leaderboardTimer = setInterval(()=>{
			let temp = (new Date() - this.state.lastUpdate);			
			this.setState({
				time: temp,
			});
		},1000);
		console.log(props,'leader porpos');		
	}	
	fetchPage(currPage) {
		this.isFetching = true;			
		NetworkService.Requests.GetLeaderboard({
			startingId: currPage*10,
			count: 10,
		}, (resp) => {
			this.isFetching = false;
			console.log(resp.result,'mera leaderboard!!');
			var userDetailsRowId = Object.keys(resp.result.rankList)
									.filter(rowId => {
										return resp.result.rankList[rowId].userId == state.User.id
									});		
			console.log(resp);
			resp.result.totalUsers = 300;
			this.setState({
				currentPage: currPage,
				myRank: resp.result.myRank,
				rankList: resp.result.rankList,
				lastUpdate: new Date(),
				totalUsers: resp.result.totalUsers,
				isFetching: false,
			});
			console.log(resp.result.rankList[userDetailsRowId],'mera details');
		})
	}
	componentWillMount() {
		if(this.state.isFetching) return;
		var nextUpdateIn = 2*60*1000 - (new Date() - this.state.lastUpdate);
		if(nextUpdateIn < 0) {
			nextUpdateIn = 0;
		}
		setTimeout(() => {
			this.fetchPage(this.state.currentPage);
			this.updateIntervalId = setInterval(()=>(this.fetchPage(this.state.currentPage)), 2*60*1000);
		}, nextUpdateIn);
	}
	componentWillUnmount() {
		clearInterval(this.updateIntervalId);
		clearInterval(this.leaderboardTimer);
	}	
	render(){
		let fetch = '';
		if(this.state.isFetching)
			fetch = "Updating LeaderBoard";
		else
			fetch = "LeaderBoard data will be updated in " + (120 - Math.floor(this.state.time/1000)) + " seconds. Current data corresponds to last update.";						
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
					<td>{this.state.userDetails.name}</td>
					<td>{this.state.userDetails.cash}</td>
					<td>{this.state.userDetails.total}</td>
				</tr>
				</tbody>
			</table>
			<div className="text-center">
				<ul className="pagination">
					<li><a onClick = {()=>this.fetchPage(0)} className="active">&laquo;</a></li>		
					{
						function() {
							let buttonsPerFrame = 3;
							let buttons = [];
							let cp = this.state.currentPage;
							let tp = Math.ceil(this.state.totalUsers/10);
							if(cp > tp - buttonsPerFrame + 1) {
								cp = tp - buttonsPerFrame + 1;
							}
							// let tp = 10;
							let start = Math.max(0, cp - Math.floor(buttonsPerFrame/2));
							//let startOffset = cp-2;
							let end = Math.min(tp,cp+Math.floor(buttonsPerFrame/2));
							if(start == 0 && cp != Math.floor(buttonsPerFrame/2)) {
								end = Math.min(tp, cp + buttonsPerFrame - 1);
							}
							for (let i = start; i <= end; i++) {
								buttons.push(<li><a onClick = {()=>{ this.fetchPage(i)}}>{i+1}</a></li>);
								// buttons.push(<li><a onClick = {()=>{}}>{i+1}</a></li>);
							}
							return buttons;
						}.bind(this)()
					}		
					<li><a onClick = {()=>this.fetchPage(this.state.totalUsers%10 == 0 ? (Math.ceil(this.state.totalUsers/10)) : (Math.ceil(this.state.totalUsers/10)) - 1)} >&raquo;</a></li>
				</ul>
			</div>
			</div>
			</div>
			);
	}
}

module.exports = LeaderBoard;