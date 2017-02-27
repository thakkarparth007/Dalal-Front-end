import React from 'react';
import ReactDOM from 'react-dom';


class News extends React.Component{
	constructor(props){
		super(props);
		this.state = {			
			events: this.props.marketEvents
		}
	}
	componentWillReceiveProps(newProps){
		this.setState({
			events: newProps.marketEvents	
		})
	}
	render(){
		return(
			<div className="container NewsContainer">
				<h2>News List</h2>
				{Object.keys(this.state.events).reverse().map((t)=>{
					let e = (this.state.events)[t];
					
					return (
						<div className="row newsRow">							
							<div className="col-md-8 col-md-offset-1">
								<h4 className="company-heading">{e.headline}</h4>
								<p className="company-text">{e.text}</p>
							</div>
						</div>
						)
				})}
				
			</div>
			)
	}
}

module.exports = News;