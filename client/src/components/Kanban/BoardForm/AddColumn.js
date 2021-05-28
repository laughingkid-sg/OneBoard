import React from 'react';
import styles from './Add.module.css';
import Button from '../../../UI/Button';
import Input from '../../../UI/Input';
import useInput from '../../hooks/use-input';

function AddColumn(props) {
	const {
		value: columnName,
		hasError: columnHasError,
		onChange: columnNameChangeHandler,
		onBlur: columnNameBlurHandler,
		reset: columnReset,
	} = useInput((text) => text.trim() !== '');

	const addColumnHandler = (e) => {
		e.preventDefault();
		if (columnHasError) {
			console.log('Please ensure the column name is not empty!');
			return;
		}
		console.log(columnName);

        // Send information upwards to add column
        props.onAddColumn(columnName);

		columnReset();
        props.onClose();
	};

	return (
		<React.Fragment>
			<h2 className={styles.title}>Add Column</h2>
			<p className={styles.invalid}>
				{columnHasError && 'Please ensure that Column Name is not empty!'}
			</p>
			<form onSubmit={addColumnHandler} className={styles.form}>
				<Input
					id="columnName"
					label="Column Name"
					type="text"
					value={columnName}
					onChange={columnNameChangeHandler}
					onBlur={columnNameBlurHandler}
				/>

				<div className={styles.buttonArea}>
					<Button type="Submit" className={`${styles.button} ${styles.confirm}`}>
						Submit
					</Button>
					<Button className={styles.button} onClick={props.onClose}>Cancel</Button>
				</div>
			</form>
		</React.Fragment>
	);
}

export default AddColumn;
