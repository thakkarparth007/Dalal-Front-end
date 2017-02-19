import React from 'react';
import ReactDOM from 'react-dom';


var SideBarList = ['Home', 'Stock Exchange', 'Company Profile', 'News', 'Buy & Sell','Mortgage', 'Transactions' ,'Leaderboard'];
var SideBarClass = ['home','stockExchange', 'companyProfile', 'news', 'buyAndSell', 'mortgage','transactions','leaderboard'];
var SideBarLogo = ['ic_action_home.png','ic_action_exchange.png','ic_action_exchange.png','ic_action_news.png','ic_action_market.png','ic_action_mortgage.png','ic_action_transactions.png','leaderboard.png'];
var key = -1;
var link;

const SideBar = () => {
	return (
		<div className="navbar-default sidebar" role="navigation">
			<div className="sidebar-nav navbar-collapse">
				<ul className="nav" id="side-menu">
					{		
						SideBarList.map(itemName => {
							key++;

							if(key==0)
								link = '/#/';
							else
								link = '/#/' + SideBarClass[key];
							return (
								<li>
									<a  href={link} key = {key} className={'hvr-bounce-to-right ' + SideBarClass[key]}>
										<img src={'public/images/icon/' + SideBarLogo[key]} className="img-responsive sidebar-icon" alt="Image" />
										<span className="nav-label">{itemName}</span>
									</a>
								</li>
							)
						})
					}
				</ul>
			</div>
		</div>
	)
}

module.exports = SideBar;