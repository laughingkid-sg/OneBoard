import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './LoginCommon.module.css';
import regStyles from './Register.module.css';
import Button from '../../UI/Button';
import Input from '../../UI/Input';
import LoginPage from './LoginPage';
import useInput from '../hooks/use-input';

const EMAIL_FORMAT =
	/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

// TO CONSIDER: Generalise components to be used in both login and register
export default function Register() {
	const [isChecked, setIsChecked] = useState(false);
	const [checkIsTouched, setIsTouched] = useState(false);

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

	const submitHandler = (e) => {
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

		console.log(fName, lName, email, password, cfmPassword,isChecked);
		fNameReset();
		lNameReset();
		emailReset();
		pwReset();
		cfmPwReset();
		setIsChecked(false);
		setIsTouched(false);
	};

	const toggleCheckHandler = (e) => {
		setIsChecked(!isChecked);
		setIsTouched(true);
	};

	return (
		<LoginPage title="Register">
			<form onSubmit={submitHandler}>
				<Input
					id="fName"
					type="fName"
					label="First Name"
					onChange={fNameOnChange}
					onBlur={fNameOnBlur}
					// To change css if necessary
					className={` ${fNameHasError ? styles.invalid : ''}`}
					value={fName}
				/>
				{fNameHasError && (
					<p className={styles.invalid}>
						Please enter a valid First Name.
					</p>
				)}

				<Input
					id="lName"
					type="lName"
					label="Last Name"
					onChange={lNameOnChange}
					onBlur={lNameOnBlur}
					// To change css if necessary
					className={` ${lNameHasError ? styles.invalid : ''}`}
					value={lName}
				/>
				{lNameHasError && (
					<p className={styles.invalid}>
						Please enter a valid Last Name.
					</p>
				)}

				<Input
					id="email"
					type="email"
					label="E-mail"
					onChange={emailOnChange}
					onBlur={emailOnBlur}
					className={` ${emailHasError ? styles.invalid : ''}`}
					value={email}
				/>
				{emailHasError && (
					<p className={styles.invalid}>
						Please enter a valid E-mail.
					</p>
				)}

				<Input
					id="password"
					type="password"
					label="Password"
					onChange={pwOnChange}
					onBlur={pwOnBlur}
					className={` ${pwHasError ? styles.invalid : ''}`}
					value={password}
				/>
				{pwHasError && (
					<p className={styles.invalid}>
						Please enter your password.
					</p>
				)}

				<Input
					id="cfmPassword"
					type="password"
					label="Confirm Password"
					onChange={cfmPwOnChange}
					onBlur={cfmPwOnBlur.bind(null, password)}
					className={` ${cfmPwHasError ? styles.invalid : ''}`}
					value={cfmPassword}
				/>
				{cfmPwHasError && (
					<p className={styles.invalid}>
						Confirmed password does not match.
					</p>
				)}

				<div className={`${(!isChecked && checkIsTouched) ? styles.invalid : ''}`}>
					<input
						type="checkbox"
						name="toc"
						id="toc"
						checked={isChecked}
						onChange={toggleCheckHandler}
					/>
					<label htmlFor="toc" className={regStyles.check}>
						I agree to the Terms of Use
					</label>
				</div>

				<Button type="submit" className={styles.formBtn}>
					Register
				</Button>
				<p className={styles.footText}>
					Already have an account? <Link to="/">Login here.</Link>
				</p>
			</form>
		</LoginPage>
	);
}
