import React, { useState } from 'react';
import { Nav, NavLink, TabContent, TabPane } from 'reactstrap';
import MainLayout from '../Layout/MainLayout';
import ChangeInfo from '../components/Profile/ChangeInfo';
import ChangePassword from '../components/Profile/ChangePassword';

const EDIT = { info: 'changeInfo', password: 'changePW' };

function Home() {
	const [activeTab, setActiveTab] = useState(EDIT.info);

	const onClickHandler = (tabChange) => {
		setActiveTab(tabChange);
	};

	return (
		<MainLayout>
			<Nav tabs>
				<NavLink
					onClick={onClickHandler.bind(null, EDIT.info)}
					style={{ active: activeTab === EDIT.info }}
				>
					Edit User Information
				</NavLink>
				<NavLink
					onClick={onClickHandler.bind(null, EDIT.password)}
					style={{ active: activeTab === EDIT.password }}
				>
					Change Password
				</NavLink>
			</Nav>
			<TabContent activeTab={activeTab}>
				<TabPane tabId={EDIT.info}>
					<ChangeInfo />
				</TabPane>
				<TabPane tabId={EDIT.password}>
					<ChangePassword />
				</TabPane>
			</TabContent>
		</MainLayout>
	);
}

export default Home;
