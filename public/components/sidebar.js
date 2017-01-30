import React from 'react';
import ReactDOM from 'react-dom';

var SideBarList = ['Dalal Panel', 'Stock Exchange', 'Buy & Sell', 'Bank Mortgage', 'Company Profile', 'My Current Orders','Transaction History' ,'Leaderboard'];
var SideBarClass = ['dashboard','stockExchange','buyAndSell','bankMorgage','companyProfile','myCurrentOrders','transactionHistory','leaderboard'];
var key = -1;

const SideBar = () => {
	return (
		<div className="navbar-default sidebar" role="navigation">
		         <div className="sidebar-nav navbar-collapse">
		         <ul className="nav" id="side-menu">
					{		
						SideBarList.map((itemName)=>{
						key++;
						return (
								<li>
								    <a href="#" key = {key} className={'hvr-bounce-to-right ' + SideBarClass[key]}>
								    <i className="fa fa-dashboard nav_icon "></i><span className="nav-label">{itemName}</span> </a>
								</li>
							)
					})}		
		             
		            
		             
		         </ul>
		     </div>
		</div>
		)
}

module.exports = SideBar;