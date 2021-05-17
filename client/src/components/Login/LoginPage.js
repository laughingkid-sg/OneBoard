import React from 'react';
import styles from './LoginPage.module.css';

export default function LoginPage(props) {
	return (
		<React.Fragment>
			<div className={styles.gridContainer}>
				{/* Side Image */}
				<div className={styles.sideImg}>
					<img src="img/loginImg.jpg" alt="Person Working" />
				</div>

				{/* Login Form */}
				<div className={styles.loginForm}>
					<h1 className={styles.title}>{props.title}</h1>
					{props.children}
				</div>
			</div>
		</React.Fragment>
	);
}
