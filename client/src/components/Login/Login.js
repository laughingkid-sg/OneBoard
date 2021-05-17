import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Login.module.css';
import Button from '../../UI/Button';
import LoginPage from './LoginPage';
import LoginForm from './LoginForm';

// TO CONSIDER: Generalise components to be used in both login and register
export default function Login() {
	return (
		<LoginPage>
			{/* LoginForm */}
			<LoginForm title="Log In">
				<div className={styles.formRow}>
					<label htmlFor="email">E-mail</label>
					<input type="email" id="email" />
				</div>
				<div className={styles.formRow}>
					<label htmlFor="password">Password</label>
					<input type="password" id="password" />
				</div>
				{/* To add custom style {width: 100%, font-size: 1.5rem} */}
				<Button type="submit" className={styles.formBtn}>
					Log In
				</Button>
				<p className={styles.footText}>
					{/* TODO: Add hyperlink to 'Register' */}
					Don't have an account? <Link to="/register">Register here.</Link>
				</p>
			</LoginForm>
		</LoginPage>
	);
}
