import React from 'react';
import styles from './LoginForm.module.css';

export default function LoginForm(props) {
	return (
		<div className={styles.loginForm}>
			<form>
				<h1 className={styles.title}>{props.title}</h1>
				{props.children}
			</form>
		</div>
	);
}
