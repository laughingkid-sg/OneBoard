import React from 'react';
import ChangeInfo from './ChangeInfo';
import ChangePassword from './ChangePassword';

function EditProfile(props) {
	return (
		<React.Fragment>
			<ChangeInfo />
			<ChangePassword />
		</React.Fragment>
	);
}

export default EditProfile;
