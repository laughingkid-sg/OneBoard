import React, { useState } from 'react';
import { Form, Label, Input } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import Button from '../../UI/Button';
import useInput from '../hooks/use-input';
import { userActions } from '../../store/user';

function ChangeInfo() {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);
	const [beforeChange, setBeforeChange] = useState({
		firstName: user.firstName,
		lastName: user.lastName,
	});

	const {
		value: firstName,
		isValid: fNameIsValid,
		hasError: fNameHasError,
		onChange: fNameOnChange,
		onBlur: fNameOnBlur,
	} = useInput((value) => value.trim() !== '', user.firstName);

	const {
		value: lastName,
		isValid: lNameIsValid,
		hasError: lNameHasError,
		onChange: lNameOnChange,
		onBlur: lNameOnBlur,
	} = useInput((value) => value.trim() !== '', user.lastName);

	const onSubmitHandler = (e) => {
		e.preventDefault();

		if (!(fNameIsValid && lNameIsValid)) return;
		if (
			firstName === beforeChange.firstName &&
			lastName === beforeChange.lastName
		) {
			return;
		}

		const updatedUser = { firstName, lastName };

		// ! POST to server to update user information
		// TODO Move this function to user-actions
		dispatch(userActions.update(updatedUser));
		setBeforeChange({ firstName, lastName });
	};

	return (
		<React.Fragment>
			<h3>Change User Information</h3>
			<Form onSubmit={onSubmitHandler}>
				<Label for="fName">First Name</Label>
				<Input
					id="fName"
					type="text"
					onBlur={fNameOnBlur}
					onChange={fNameOnChange}
					// className={`${fNameHasError ? styles.invalid : ''}`}
					value={firstName}
				/>

				<Label for="lName">Last Name</Label>
				<Input
					id="lName"
					type="text"
					onBlur={lNameOnBlur}
					onChange={lNameOnChange}
					// className={`${lNameHasError ? styles.invalid : ''}`}
					value={lastName}
				/>

				<Button type="submit">Update Information</Button>
			</Form>
		</React.Fragment>
	);
}

export default ChangeInfo;
