import React from 'react';
import { Form, Label, Input } from 'reactstrap';
import Button from '../../UI/Button';
import useInput from '../hooks/use-input';

function ChangePassword(props) {
	const {
		value: currentPassword,
		isValid: currentPWValid,
		hasError: currentPWHasError,
		onBlur: currentPWOnBlur,
		onChange: currentPWOnChange,
		reset: currentPWReset,
	} = useInput((value) => value.trim() !== '');

	const {
		value: newPassword,
		isValid: newPWValid,
		hasError: newPWHasError,
		onBlur: newPWOnBlur,
		onChange: newPWOnChange,
		reset: newPWReset,
	} = useInput((value) => value.trim() !== '' && value !== currentPassword);

	const {
		value: cfmPassword,
		isValid: cfmPWValid,
		hasError: cfmPWHasError,
		onBlur: cfmPWOnBlur,
		onChange: cfmPWOnChange,
		reset: cfmPWReset,
	} = useInput((value) => value.trim() !== '' && value === newPassword);

	const onSubmitHandler = (e) => {
		e.preventDefault();
		if (!(currentPWValid && newPWValid && cfmPWValid)) return;

		// ? Is there a need to renew the token?
		// ! POST to server to update user information

		currentPWReset();
		newPWReset();
		cfmPWReset();
		alert('Password successfully changed');
	};

	return (
		<React.Fragment>
			<h3>Change Password</h3>
			<Form onSubmit={onSubmitHandler}>
				<Label for="currentPassword">Current Password</Label>
				<Input
					id="currentPassword"
					type="password"
					onBlur={currentPWOnBlur}
					onChange={currentPWOnChange}
					// className={`${currentPasswordHasError ? styles.invalid : ''}`}
					value={currentPassword}
				/>

				<Label for="newPassword">New Password</Label>
				<Input
					id="newPassword"
					type="password"
					onBlur={newPWOnBlur}
					onChange={newPWOnChange}
					// className={`${newPasswordHasError ? styles.invalid : ''}`}
					value={newPassword}
				/>

				<Label for="cfmPassword">Confirm New Password</Label>
				<Input
					id="cfmPassword"
					type="password"
					onBlur={cfmPWOnBlur}
					onChange={cfmPWOnChange}
					// className={`${newPasswordHasError ? styles.invalid : ''}`}
					value={cfmPassword}
				/>
				<Button type="submit">Change Password</Button>
			</Form>
		</React.Fragment>
	);
}

export default ChangePassword;
