import React from 'react';
import styles from './Add.module.css';
import Button from '../../../UI/Button';
import Input from '../../../UI/Input';
// import Modal from '../../../UI/Modal';
import useInput from '../../hooks/use-input';

function AddTask(props) {
	const {
		value: taskName,
		isValid: taskIsValid,
		hasError: taskHasError,
		onChange: taskNameChangeHandler,
		onBlur: taskNameBlurHandler,
		reset: taskReset,
	} = useInput((text) => text.trim() !== '');

	// !! May add validation in future (eg character encoding for possible injections)
	const {
		value: description,
		isValid: descriptionIsValid,
		hasError: descriptionHasError,
		onChange: descriptionChangeHandler,
		onBlur: descriptionBlurHandler,
		reset: descriptionReset,
	} = useInput(() => {
		return true;
	});

	const addTaskHandler = (e) => {
		e.preventDefault();
		if (taskHasError) {
			console.log('Please ensure the task name is not empty!');
			return;
		}
		console.log(taskName, description);

        // Send information upwards to add task
        props.onAddTask(taskName, description);

		taskReset();
		descriptionReset();
        props.onClose();
	};

	return (
		<React.Fragment>
			<h2 className={styles.title}>Add Task</h2>
			<p className={styles.invalid}>
				{taskHasError && 'Please ensure that Task Name is not empty!'}
			</p>
			<form onSubmit={addTaskHandler} className={styles.form}>
				<Input
					id="taskName"
					label="Task Name"
					type="text"
					value={taskName}
					onChange={taskNameChangeHandler}
					onBlur={taskNameBlurHandler}
				/>

				<div>
					<label htmlFor="description">Description</label>
					<textarea
						id="description"
						value={description}
						rows="10"
						onChange={descriptionChangeHandler}
						onBlur={descriptionBlurHandler}
					/>
				</div>

                {/* Dropdown to choose column (Coming soon!) */}
				{/* <h3>Subtask (Coming soon!)</h3> */}

				<div className={styles.buttonArea}>
					<Button className={styles.button} onClick={props.onClose}>Cancel</Button>
					<Button type="Submit" className={styles.button}>
						Submit
					</Button>
				</div>
			</form>
		</React.Fragment>
	);
}

export default AddTask;
