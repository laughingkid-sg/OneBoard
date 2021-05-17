import React, { useState } from 'react';
import styles from './Sidebar.module.css';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import { SidebarData } from './SidebarData';
import { IconContext } from 'react-icons';

const Sidebar = (props) => {
	const [sidebar, setSidebar] = useState(false);

	const showSidebarHandler = () => {
		setSidebar((prevSide) => !prevSide);
	};

    const showSidebar = `${styles['nav-menu']} ${sidebar ? styles['active'] : ''}`

	return (
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
					<li className={styles['navbar-toggle']}>
						<Link to="#" className={styles['menu-bars']}>
							<AiOutlineClose />
						</Link>
					</li>
					{SidebarData.map((item, index) => {
						return (
							<li key={index} className={styles[item.className]}>
								<Link to={item.path}>
									{item.icon}
									<span>{item.title}</span>
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>
		</IconContext.Provider>
	);
};

export default Sidebar;
