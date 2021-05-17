import React from 'react';
import Button from '../../UI/Button';
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
				{props.children}
			</div>
		</React.Fragment>
	);
}
