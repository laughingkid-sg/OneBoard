import React, { useState } from 'react';
import { IconContext } from 'react-icons';
import { AiOutlineClose } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { SidebarData } from './SidebarData';
import styles from './Sidebar.module.css';

const Sidebar = (props) => {
	const [sidebar, setSidebar] = useState(false);

	const showSidebarHandler = () => {
		setSidebar((prevSide) => !prevSide);
	};

	const renderSidebars = SidebarData.map((item, index) => {
		return (
			<li key={index} className={styles['nav-text']}>
				<Link to={item.path}>
					{item.icon}
					<span>{item.title}</span>
				</Link>
			</li>
		);
	});

	const showSidebar = `${styles['nav-menu']} ${
		sidebar ? styles['active'] : ''
	}`;

	return (
		<React.Fragment>
			<IconContext.Provider value={{ color: '#fff' }}>
				<div className={styles['navbar']}>
					<Link to="#" className={styles['menu-bars']}>
						<FaBars onClick={showSidebarHandler} />
					</Link>
				</div>
				<nav className={showSidebar}>
					<ul
						className={styles['nav-menu-items']}
						onClick={showSidebarHandler}
					>
						<SidebarToggle />
						{renderSidebars}
					</ul>
				</nav>
			</IconContext.Provider>
		</React.Fragment>
	);
};

export default Sidebar;

const SidebarToggle = () => {
	return (
		<li className={styles['navbar-toggle']}>
			<Link to="#" className={styles['menu-bars']}>
				<AiOutlineClose />
			</Link>
		</li>
	);
};
