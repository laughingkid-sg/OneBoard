import React from 'react';
import Sidebar from '../components/Dashboard/Sidebar';

function MainLayout(props) {
	return (
		<React.Fragment>
			<Sidebar />
			{props.children}
		</React.Fragment>
	);
}

export default MainLayout;
