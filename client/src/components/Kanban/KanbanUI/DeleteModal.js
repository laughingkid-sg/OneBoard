import React from 'react';
import { useDispatch } from 'react-redux';
import Button from '../../../UI/Button';
import Modal from '../../../UI/Modal';
import { kanbanActions } from '../../../store/kanban';
import styles from './DeleteModal.module.css';

function DeleteModal(props) {
	const dispatch = useDispatch();

	const deleteHandler = () => {
		if (props.isCol) {
			dispatch(kanbanActions.deleteColumn({ colId: props.columnId }));
			return;
		} else {
			dispatch(
				kanbanActions.deleteTask({
					columnId: props.columnId,
					taskId: props.taskId,
					index: props.index,
				})
			);
		}

		props.onCancel();
	};

	return (
		<Modal onClose={props.onCancel}>
			<div className={styles.container}>
				<h2 className={styles.title}>
					Are you sure you want to delete {`${props.isCol ? 'column-' : 'task-'}${props.title}`}?
				</h2>
				{props.isCol && (
					<p className={styles.warning}>
						If this column is deleted, all tasks in the column would
						be deleted too! Relocate your tasks to other columns to
						prevent them from being deleted!
					</p>
				)}
				<div className={styles.btnContainer}>
					<Button onClick={deleteHandler} className={styles.delete}>
						Delete {props.isCol ? 'Column' : 'Task'}
					</Button>
					<Button onClick={props.onCancel}>Go Back</Button>
				</div>
			</div>
		</Modal>
	);
}

export default DeleteModal;
