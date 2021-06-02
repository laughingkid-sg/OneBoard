import React, { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '../../../UI/Button';
import Modal from '../../../UI/Modal';
import styles from './DeleteModal.module.css';
import { deleteData } from '../../../store/kanban-actions';
import ModalContext from '../../../store/ModalContext';

function DeleteModal(props) {
	const modalContext = useContext(ModalContext);
	const dispatch = useDispatch();
	const token = useSelector((state) => state.user.token);

	const deleteHandler = () => {
		if (props.isCol) {
			dispatch(
				deleteData(
					props.boardId,
					{ columnId: props.columnId },
					true,
					token
				)
			);
		} else {
			dispatch(
				deleteData(
					props.boardId,
					{ columnId: props.columnId, taskId: props.taskId },
					false,
					token
				)
			);
		}

		modalContext.hideModal();
	};

	return (
		<Modal onClose={modalContext.hideModal}>
			<div className={styles.container}>
				<h2 className={styles.title}>
					Are you sure you want to delete this{' '}
					{props.isCol ? 'Column' : 'Task'}?
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
					<Button onClick={modalContext.hideModal}>Go Back</Button>
				</div>
			</div>
		</Modal>
	);
}

export default DeleteModal;
