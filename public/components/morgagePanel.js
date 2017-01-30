import React from 'react';
import ReactDOM from 'react-dom';

class MorgagePanel extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			morgageStocks: this.props
		}
	}
	render(){
		let text;
		if((this.state.morgageStocks).length == 0){
			text = <p className="morgageText"><i>-No morgaged stocks-</i></p>;
		}
		else{
			text = <p className="morgageText"><i>Stocks list goes here</i></p>;
		}
		return (
			<div className = "container morgagePanel">
				<h3 className="dash-head">Morgage Panel</h3>
				<div className="row">
					{text}
				</div>
			</div>
			)
	}
}

module.exports = MorgagePanel;