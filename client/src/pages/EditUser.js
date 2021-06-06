import React from 'react';
import MainLayout from '../Layout/MainLayout';
import EditProfile from '../components/Profile/EditProfile';

function Home() {
	return (
		<MainLayout>
			<EditProfile />
		</MainLayout>
	);
}

export default Home;
