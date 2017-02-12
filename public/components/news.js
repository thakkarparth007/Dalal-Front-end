import React from 'react';
import ReactDOM from 'react-dom';


class News extends React.Component{
	constructor(props){
		super(props);
		this.state = {			
			stocks: this.props.stocksList
		}
	}
	render(){
		return(
			<div className="container">
				<h2>News List</h2>
				{Object.keys(this.state.stocks).map((t)=>{
					let e = (this.state.stocks)[t];
					
					return (
						<div className="row newsRow">							
							<div className="col-md-8 col-md-offset-1">
								<h4 className="company-heading">{e.fullName}</h4>
								<p className="company-text">{e.description}</p>
							</div>
						</div>
						)
				})}
				
			</div>
			)
	}
}

module.exports = News;