import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import styles from './ColumnEditModal.module.css';
import Modal from '../../../UI/Modal';
import Button from '../../../UI/Button';
import { kanbanActions } from '../../../store/kanban';

function ColumnEditModal(props) {
	const dispatch = useDispatch();
	const colTitle = useRef(props.columnTitle);
	const [beforeChange, setBeforeChange] = useState(props.columnTitle);

	const confirmEditHandler = () => {
		if (colTitle.current.value.trim() === '') {
			return;
		}

		if (colTitle.current.value === beforeChange) {
			props.onClose();
			return;
		}

		console.log('I changed');

		setBeforeChange(colTitle.current.value);
		dispatch(
			kanbanActions.editColumn({
				colId: props.id,
				columnName: colTitle.current.value,
			})
		);
		props.onClose();
	};

	return (
		<Modal onClose={props.onClose}>
			<div className={styles.container}>
				<AiOutlineClose
					onClick={props.onClose}
					className={styles.close}
				/>

				<h2 className={styles.title}>Edit Column Name</h2>
				<p className={styles.invalid}>
					{/* {columnHasError &&
					'Please ensure that Column Name is not empty!'} */}
				</p>

				<input
					type="text"
					id="columnTitle"
					ref={colTitle}
					defaultValue={beforeChange}
					className={styles.input}
				/>

				<div className={styles.buttonArea}>
					<Button
						className={`${styles.button} ${styles.confirm}`}
						onClick={confirmEditHandler}
					>
						Confirm Changes
					</Button>
					<Button className={styles.button} onClick={props.onClose}>
						Cancel Changes
					</Button>
				</div>
			</div>
		</Modal>
	);
}

export default ColumnEditModal;
