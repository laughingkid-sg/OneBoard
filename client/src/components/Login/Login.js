import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Login.module.css';
import Button from '../../UI/Button';
import LoginPage from './LoginPage';
import Input from '../../UI/Input.js';
import useInput from '../hooks/use-input';

const EMAIL_FORMAT =
	/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

// TO CONSIDER: Generalise components used in both login and register
export default function Login() {
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

	const submitHandler = (e) => {
		e.preventDefault();

		if (!(emailIsValid && pwIsValid)) {
			return;
		}

		console.log(email, password);
		emailReset();
		pwReset();
	};

	return (
		<LoginPage title="Log In">
			<form onSubmit={submitHandler}>
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
				<Button type="submit" className={styles.formBtn}>
					Log In
				</Button>
				<p className={styles.footText}>
					Don't have an account?{' '}
					<Link to="/register">Register here.</Link>
				</p>
			</form>
		</LoginPage>
	);
}
