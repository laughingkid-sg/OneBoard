import React, { useState } from 'react';
import Button from '../UI/Button';
import Input from '../UI/Input';
import styles from './BoardForm.module.css';

function isTextEmpty(text) {
	return text.trim() === '';
}

function BoardForm(props) {
	const [textInput, setTextInput] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

	const textChangeHandler = (e) => {
		setTextInput(e.target.value);
	};

	const addTaskHandler = () => {
		if (isTextEmpty(textInput)) {
            setErrorMsg('Text field cannot be empty');
			return;
		}

		// Add task to the first column
		props.onAddTask(textInput);
        setTextInput('');
        setErrorMsg('');
	};

	const addColumnHandler = () => {
		if (isTextEmpty(textInput)) {
            setErrorMsg('Text field cannot be empty');
			return;
		}

		// Add column
		props.onAddColumn(textInput);
        setTextInput('');
        setErrorMsg('');
	};

	return (
		<div className={styles.boardForm}>
			<Input
				id="text"
				type="text"
                label=""
				value={textInput}
				onChange={textChangeHandler}
                className={styles.input}
			/>
			<Button onClick={addTaskHandler} className={styles.button}>
				Add New Task
			</Button>
			<Button onClick={addColumnHandler} className={styles.button}>
				Add New Column
			</Button>
            {errorMsg && <p style={{color:"red"}}>{errorMsg}</p>}
		</div>
	);
}

export default BoardForm;
