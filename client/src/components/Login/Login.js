import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import styles from './LoginCommon.module.css';
import Button from '../../UI/Button';
import LoginPage from './LoginPage';
import Input from '../../UI/Input.js';
import useInput from '../hooks/use-input';

const EMAIL_FORMAT =
	/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export default function Login(props) {
	const {
		value: email,
		isValid: emailIsValid,
		hasError: emailHasError,
		onChange: emailOnChange,
		onBlur: emailOnBlur,
		// reset: emailReset,
	} = useInput((value) => EMAIL_FORMAT.test(value));

	const {
		value: password,
		isValid: pwIsValid,
		hasError: pwHasError,
		onChange: pwOnChange,
		onBlur: pwOnBlur,
		// reset: pwReset,
	} = useInput((value) => value.trim() !== '');

	const [errorMsg, setErrorMsg] = useState('');

	const submitHandler = async (e) => {
		e.preventDefault();

		if (!(emailIsValid && pwIsValid)) {
			return;
		}

		const user = { email, password };

		const response = await fetch('/api/signin', {
			method: 'POST',
			body: JSON.stringify(user),
			headers: { 'Content-Type': 'application/json' },
		});

		const data = await response.json();
		console.log(data);

		if (response.ok) {
			props.onLogin(data.token);
			return;
		}

		setErrorMsg(data.message);
		return;
	};

	return (
		<LoginPage title="Log In" errorMsg={errorMsg}>
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
				<p className={styles.invalid}>
					{emailHasError && 'Please enter a valid E-mail.'}
				</p>
				<Input
					id="password"
					type="password"
					label="Password"
					onChange={pwOnChange}
					onBlur={pwOnBlur}
					className={` ${pwHasError ? styles.invalid : ''}`}
					value={password}
				/>
				<p className={styles.invalid}>
					{pwHasError && 'Please enter your password.'}
				</p>
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
