import React, { useRef, useImperativeHandle } from 'react';
import styles from './Input.module.css';

export default function Input(props) {
	// const inputRef = useRef();

	// const activate = () => {
	// 	inputRef.current.focus();
	// };

	// useImperativeHandle(ref, () => {
	// 	activate;
	// });

	return (
		<div className={`${styles.control} ${props.className}`}>
			<label htmlFor={props.id}>{props.label}</label>
			<input
				type={props.type}
				id={props.id}
				value={props.value}
				onChange={props.onChange}
				onBlur={props.onBlur}
			/>
		</div>
	);
}
