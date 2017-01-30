import React from 'react';
import ReactDOM from 'react-dom';


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
			leaderboard: leaderboard
		}
	}
	render(){
		return (
			<table className="table table-striped table-hover table-responsive">
				<thead>
					<tr>
						<th>Rank</th>
						<th>Username</th>
						<th>Total Assets</th>
					</tr>
				</thead>
				<tbody>
				{
				
				(this.state.leaderboard).map((x)=>{
					return (
							<tr>
								<td>{count++}</td>
								<td>{x.username}</td>
								<td>{x.totalAssets}</td>
							</tr>
						);
				})

			}
					
				</tbody>
			</table>
			);
	}
}

module.exports = LeaderBoard;