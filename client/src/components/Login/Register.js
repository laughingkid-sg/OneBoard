import React, { useState } from 'react';
import { Label, Input, Form } from 'reactstrap';
import { Link } from 'react-router-dom';
import styles from './LoginCommon.module.css';
import Button from '../../UI/Button';
import LoginPage from './LoginPage';
import useInput from '../hooks/use-input';

const EMAIL_FORMAT =
	/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export default function Register() {
	const [isChecked, setIsChecked] = useState(false);
	const [checkIsTouched, setIsTouched] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');
	const [isError, setIsError] = useState(false);

	const {
		value: fName,
		isValid: fNameIsValid,
		hasError: fNameHasError,
		onChange: fNameOnChange,
		onBlur: fNameOnBlur,
		reset: fNameReset,
	} = useInput((value) => value.trim() !== '');

	const {
		value: lName,
		isValid: lNameIsValid,
		hasError: lNameHasError,
		onChange: lNameOnChange,
		onBlur: lNameOnBlur,
		reset: lNameReset,
	} = useInput((value) => value.trim() !== '');

	const {
		value: email,
		isValid: emailIsValid,
		hasError: emailHasError,
		onChange: emailOnChange,
		onBlur: emailOnBlur,
		reset: emailReset,
	} = useInput((value) => EMAIL_FORMAT.test(value));

	const {
		value: password,
		isValid: pwIsValid,
		hasError: pwHasError,
		onChange: pwOnChange,
		onBlur: pwOnBlur,
		reset: pwReset,
	} = useInput((value) => value.trim() !== '');

	const {
		value: cfmPassword,
		isValid: cfmPwIsValid,
		hasError: cfmPwHasError,
		onChange: cfmPwOnChange,
		onBlur: cfmPwOnBlur,
		reset: cfmPwReset,
	} = useInput((value) => value.trim() !== '' && value === password);

	const submitHandler = async (e) => {
		e.preventDefault();

		if (
			!(
				fNameIsValid &&
				lNameIsValid &&
				emailIsValid &&
				pwIsValid &&
				cfmPwIsValid &&
				isChecked
			)
		) {
			return;
		}

		const user = { firstName: fName, lastName: lName, email, password };

		const response = await fetch('/api/signup', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(user),
		});

		const data = await response.json();

		if (response.ok) {
			setErrorMsg('Register success! You may login to OneBoard now.');
			setIsError(false);
			fNameReset();
			lNameReset();
			emailReset();
			pwReset();
			cfmPwReset();
			setIsChecked(false);
			setIsTouched(false);
			return;
		}

		setErrorMsg(data.message);
		setIsError(true);
		return;
	};

	const toggleCheckHandler = (e) => {
		setIsChecked(!isChecked);
		setIsTouched(true);
	};

	return (
		<LoginPage title="Register" errorMsg={errorMsg} isError={isError}>
			<Form onSubmit={submitHandler}>
				<Label for="fName">First Name</Label>
				<Input
					id="fName"
					type="text"
					onChange={fNameOnChange}
					onBlur={fNameOnBlur}
					className={`${fNameHasError ? styles.invalid : ''}`}
					value={fName}
				/>
				{fNameHasError && (
					<p className={styles.invalid}>
						Please enter a valid First Name.
					</p>
				)}

				<Label for="lName">Last Name</Label>
				<Input
					id="lName"
					type="text"
					onChange={lNameOnChange}
					onBlur={lNameOnBlur}
					className={`${lNameHasError ? styles.invalid : ''}`}
					value={lName}
				/>
				{lNameHasError && (
					<p className={styles.invalid}>
						Please enter a valid Last Name.
					</p>
				)}

				<Label for="email">E-mail</Label>
				<Input
					id="email"
					type="email"
					onChange={emailOnChange}
					onBlur={emailOnBlur}
					className={`${emailHasError ? styles.invalid : ''}`}
					value={email}
				/>
				{emailHasError && (
					<p className={styles.invalid}>
						Please enter a valid E-mail.
					</p>
				)}

				<Label for="password">Password</Label>
				<Input
					id="password"
					type="password"
					onChange={pwOnChange}
					onBlur={pwOnBlur}
					className={`${pwHasError ? styles.invalid : ''}`}
					value={password}
				/>
				{pwHasError && (
					<p className={styles.invalid}>
						Please enter your password.
					</p>
				)}

				<Label for="cfmPassword">Confirm Password</Label>
				<Input
					id="cfmPassword"
					type="password"
					onChange={cfmPwOnChange}
					onBlur={cfmPwOnBlur.bind(null, password)}
					className={`${cfmPwHasError ? styles.invalid : ''}`}
					value={cfmPassword}
				/>
				{cfmPwHasError && (
					<p className={styles.invalid}>
						Confirmed password does not match.
					</p>
				)}

				<div
					className={` ${styles.checkBox} ${
						!isChecked && checkIsTouched ? styles.invalid : ''
					}`}
				>
					<Input
						type="checkbox"
						name="toc"
						id="toc"
						checked={isChecked}
						onChange={toggleCheckHandler}
						style={{ fontSize: '20px' }}
					/>
					<Label
						check
						for="toc"
						style={{ marginLeft: '15px', fontSize: '20px' }}
					>
						I agree to the terms of use
					</Label>
				</div>

				<Button type="submit" className={styles.formBtn}>
					Register
				</Button>
				<p className={styles.footText}>
					Already have an account? <Link to="/">Login here.</Link>
				</p>
			</Form>
		</LoginPage>
	);
}
