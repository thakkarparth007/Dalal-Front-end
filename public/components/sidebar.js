import React from 'react';
import ReactDOM from 'react-dom';


var SideBarList = ['Home', 'Stock Exchange', 'Company Profile', 'News', 'Buy & Sell','Mortgage', 'Transactions', 'My Orders' ,'Leaderboard'];
var SideBarClass = ['home','stockExchange', 'companyProfile', 'news', 'buyAndSell', 'mortgage','transactions','myOrders','leaderboard'];
var SideBarLogo = ['ic_action_home.png','ic_action_exchange.png','ic_action_exchange.png','ic_action_news.png','ic_action_market.png','ic_action_mortgage.png','ic_action_transactions.png','ic_action_transactions.png','leaderboard.png'];
var link;

const SideBar = () => {
	return (
		<div>
		<div className="navbar-default sidebar hidden-xs" role="navigation">
			<div className="sidebar-nav-fixed navbar-collapse affix ">
				<ul className="nav" id="side-menu">
					{		
						SideBarList.map((itemName, key) => {							
							if(key==0)
								link = '/#/';
							else
								link = '/#/' + SideBarClass[key];
							return (
								<li>
									<a href={link} key = {key} className={'hvr-bounce-to-right ' + SideBarClass[key]}>
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
		<div className="navbar-default sidebar visible-xs" role="navigation">
			<div className="sidebar-nav navbar-collapse ">
				<ul className="nav" id="side-menu">
					{		
						SideBarList.map((itemName, key) => {							
							if(key==0)
								link = '/#/';
							else
								link = '/#/' + SideBarClass[key];
							return (
								<li>
									<a href={link} key = {key} className={'hvr-bounce-to-right ' + SideBarClass[key]}>
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
		</div>
	)
}

module.exports = SideBar;