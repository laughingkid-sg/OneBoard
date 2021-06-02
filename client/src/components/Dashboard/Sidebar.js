import React, { useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { IconContext } from 'react-icons';
import { AiOutlineClose } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { SidebarData } from './SidebarData';
import styles from './Sidebar.module.css';
import { RiLogoutBoxFill } from 'react-icons/ri';
import { userActions } from '../../store/user';
import AuthContext from '../../store/AuthContext';

const Sidebar = (props) => {
	const [sidebar, setSidebar] = useState(false);
	const authContext = useContext(AuthContext);
	const dispatch = useDispatch();

	const showSidebarHandler = () => {
		setSidebar((prevSide) => !prevSide);
	};

	const logoutHandler = () => {
		fetch('/api/signout', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		});

		authContext.logout();
		return;
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
						<li
							key={SidebarData.length + 1}
							className={styles['nav-text']}
							onClick={props.onLogout}
						>
							<Link to="/" exact onClick={logoutHandler}>
								<RiLogoutBoxFill />
								<span>Logout</span>
							</Link>
						</li>
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
