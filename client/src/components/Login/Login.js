import React, { useContext, useState } from 'react';
import { Form, Label, Input } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './LoginCommon.module.css';
import Button from '../../UI/Button';
import LoginPage from './LoginPage';
import useInput from '../hooks/use-input';
import { fetchUserData } from '../../store/user-actions';
import AuthContext from '../../store/AuthContext';

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
	const authContext = useContext(AuthContext);
	const dispatch = useDispatch();

	const submitHandler = async (e) => {
		e.preventDefault();

		if (!(emailIsValid && pwIsValid)) {
			return;
		}

		const user = { username: email, password };

		const response = await fetch('/api/signin', {
			method: 'POST',
			body: JSON.stringify(user),
			headers: { 'Content-Type': 'application/json' },
		});

		const data = await response.json();

		if (!response.ok) {
			setErrorMsg(data.message);
			return;
		}

		const token = data.token;
		const id = data.user._id;
		localStorage.setItem('id', id);
		const getUserData = await dispatch(fetchUserData(id, token));

		if (getUserData.isSuccess) {
			authContext.login(token);
		} else {
			setErrorMsg(getUserData.errorMsg);
		}
	};

	return (
		<LoginPage title="Log In" errorMsg={errorMsg}>
			<Form onSubmit={submitHandler}>
				{/* <form onSubmit={submitHandler}> */}
				<Label for="email">E-mail</Label>
				<Input
					type="email"
					name="email"
					id="email"
					placeholder="Enter your email"
					onChange={emailOnChange}
					onBlur={emailOnBlur}
					className={` ${emailHasError ? styles.invalid : ''}`}
					value={email}
				/>
				<p className={styles.invalid}>
					{emailHasError && 'Please enter a valid E-mail.'}
				</p>
				<Label for="password">Password</Label>
				<Input
					id="password"
					name="password"
					type="password"
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
				{/* </form> */}
			</Form>
		</LoginPage>
	);
}
