import React, { useContext } from 'react';
import {
	Alert,
	Form,
	FormFeedback,
	FormGroup,
	Label,
	Input,
	Button,
} from 'reactstrap';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './LoginCommon.module.css';
import LoginPage from './LoginPage';
import useInput from '../hooks/use-input';
import useError from '../hooks/use-error';
import { fetchUserData, login } from '../../store/user-actions';
import AuthContext from '../../store/AuthContext';
import { isEmail, textNotEmpty } from '../../lib/validators';

export default function Login(props) {
	const dispatch = useDispatch();
	const authContext = useContext(AuthContext);

	const {
		value: email,
		isValid: emailIsValid,
		hasError: emailHasError,
		onChange: emailOnChange,
		onBlur: emailOnBlur,
	} = useInput(isEmail);

	const {
		value: password,
		isValid: pwIsValid,
		hasError: pwHasError,
		onChange: pwOnChange,
		onBlur: pwOnBlur,
	} = useInput(textNotEmpty);

	const { error, errorMsg, changeError, changeMessage } = useError();

	const submitHandler = async (e) => {
		e.preventDefault();

		if (!(emailIsValid && pwIsValid)) {
			changeMessage('Please ensure all fields are valid');
			return;
		}

		const user = { username: email, password };

		const response = await dispatch(login(user));

		if (!response.status) {
			changeMessage(response.message);
		} else {
			const { data } = response;
			const token = data.token;
			const id = data.user._id;
			const userData = await dispatch(fetchUserData(id, token));
			if (userData.isSuccess) {
				localStorage.setItem('id', id);
				authContext.login(token);
			} else {
				changeMessage(userData.errorMsg);
			}
		}
	};

	return (
		<LoginPage title="Log In">
			<Alert
				color="danger"
				className="w-25"
				isOpen={error}
				toggle={() => {
					changeError(!error);
				}}
			>
				{errorMsg}
			</Alert>
			<Form onSubmit={submitHandler}>
				<FormGroup>
					<Label for="email">E-mail</Label>
					<Input
						type="email"
						name="email"
						id="email"
						placeholder="Enter your email"
						onChange={emailOnChange}
						onBlur={emailOnBlur}
						value={email}
						invalid={emailHasError}
					/>
					<FormFeedback invalid>
						Please enter a valid E-mail
					</FormFeedback>
				</FormGroup>
				<FormGroup>
					<Label for="password">Password</Label>
					<Input
						id="password"
						name="password"
						type="password"
						onChange={pwOnChange}
						onBlur={pwOnBlur}
						value={password}
						invalid={pwHasError}
					/>
					<FormFeedback invalid>
						Please enter your password
					</FormFeedback>
				</FormGroup>
				<Button type="submit" color="primary" className="mt-4">
					Log In
				</Button>
				<p className={styles.footText}>
					Don't have an account?{' '}
					<Link to="/register">Register here.</Link>
				</p>
			</Form>
		</LoginPage>
	);
}
