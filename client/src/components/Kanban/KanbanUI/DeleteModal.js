import React, { useContext } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import styles from './DeleteModal.module.css';
import { deleteData } from '../../../store/kanban-actions';
import ModalContext from '../../../store/ModalContext';

function DeleteModal(props) {
	const modalContext = useContext(ModalContext);
	const dispatch = useDispatch();
	const token = useSelector((state) => state.user.token);

	// ! Not working yet
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
		<Modal isOpen={modalContext.isVisible} toggle={modalContext.hideModal}>
			<ModalHeader>
				Are you sure you want to delete this{' '}
				{props.isCol ? 'Column' : 'Task'}?
			</ModalHeader>
			{props.isCol && (
				<ModalBody className={styles.warning}>
					If this column is deleted, all tasks in the column would be
					deleted too! Relocate your tasks to other columns to prevent
					them from being deleted!
				</ModalBody>
			)}
			<ModalFooter>
				<Button onClick={deleteHandler} color="danger">
					Delete {props.isCol ? 'Column' : 'Task'}
				</Button>
				<Button onClick={modalContext.hideModal} outline>
					Go Back
				</Button>
			</ModalFooter>
		</Modal>
	);
}

export default DeleteModal;
