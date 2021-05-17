import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Register.module.css';
import Button from '../../UI/Button';
import LoginPage from './LoginPage';
import LoginForm from './LoginForm';

// TO CONSIDER: Generalise components to be used in both login and register
export default function Register() {
	return (
		<LoginPage>
			{/* RegisterForm */}
			<LoginForm title="Register">
				<div className={styles.regRow}>
					<label htmlFor="fName">First Name</label>
					<input type="text" id="fName" />
				</div>
				<div className={styles.regRow}>
					<label htmlFor="lName">Last Name</label>
					<input type="email" id="lName" />
				</div>
				<div className={styles.regRow}>
					<label htmlFor="email">E-mail</label>
					<input type="email" id="email" />
				</div>
				<div className={styles.regRow}>
					<label htmlFor="password">Password</label>
					<input type="password" id="password" />
				</div>
				<div className={styles.regRow}>
					<label htmlFor="password">Confirm Password</label>
					<input type="password" id="cfm-password" />
				</div>
				{/* To add custom style {width: 100%, font-size: 1.5rem} */}
				<Button type="submit" className={styles.formBtn}>
					Register
				</Button>
				<p className={styles.footText}>
					{/* TODO: Add hyperlink to 'Login' */}
					Already have an account? <Link to="/">Login here.</Link>
				</p>
			</LoginForm>
		</LoginPage>
	);
}
