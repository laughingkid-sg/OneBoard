import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { NavItem, Nav, NavLink, NavbarBrand, Navbar } from 'reactstrap';
import Button from '../UI/Button';
import Sidebar from '../components/Dashboard/Sidebar';
import { FiLogOut } from 'react-icons/fi';
import AuthContext from '../store/AuthContext';
import { IconContext } from 'react-icons';

function MainLayout(props) {
	const authContext = useContext(AuthContext);

	const logoutHandler = () => {
		fetch('/api/signout', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		});

		authContext.logout();
		return;
	};

	return (
		<React.Fragment>
			<Navbar style={{ backgroundColor: '#458c7f' }} className="p-3">
				<NavbarBrand>
					<Link
						to="/"
						style={{ textDecoration: 'none', color: '#fff' }}
						className="fs-2"
					>
						OneBoard
					</Link>
				</NavbarBrand>
				<Nav>
					{/* TODO Style buttons */}
					<NavItem>
						<Link to="/editprofile">
							<Button>Edit Profile</Button>
						</Link>
					</NavItem>
					<NavItem>
						<Button onClick={logoutHandler}>
							<IconContext.Provider value={{ color: '#fff' }}>
								<FiLogOut />
							</IconContext.Provider>
							{'  '}Logout
						</Button>
					</NavItem>
				</Nav>
			</Navbar>
			{/* <Sidebar /> */}
			{props.children}
		</React.Fragment>
	);
}

export default MainLayout;
