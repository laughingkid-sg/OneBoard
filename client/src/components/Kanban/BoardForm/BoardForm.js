import React, { useReducer } from 'react';
import AddTask from './AddTask';
import AddColumn from './AddColumn';
import Button from '../../../UI/Button';
// import Input from '../../../UI/Input';
import styles from './BoardForm.module.css';
import Modal from '../../../UI/Modal';

function isTextEmpty(text) {
	return text.trim() === '';
}

const initialState = {
	showModal: false,
	modalToShow: null,
};

const modalReducer = (state, action) => {
	switch (action.type) {
		case 'task':
		case 'column':
			return {
				showModal: true,
				modalToShow: action.modal,
			};
	}

	return initialState;
};

function BoardForm(props) {
	const [showModal, dispatchShowModal] = useReducer(
		modalReducer,
		initialState
	);

	const closeModal = () => dispatchShowModal({ type: 'close' });

	const showTaskHandler = () => {
		dispatchShowModal({
			type: 'task',
			modal: <AddTask onClose={closeModal} onAddTask={props.onAddTask} />,
		});
		// // Add task to the first column
		// props.onAddTask(textInput);
	};

	const showColumnHandler = () => {
		dispatchShowModal({
			type: 'column',
			modal: (
				<AddColumn
					onClose={closeModal}
					onAddColumn={props.onAddColumn}
				/>
			),
		});
		// // Add column
		// props.onAddColumn(textInput);
	};

	return (
		<React.Fragment>
			{showModal.showModal && (
				<Modal onClose={closeModal}>{showModal.modalToShow}</Modal>
			)}
			<div className={styles.boardForm}>
				<Button onClick={showTaskHandler} className={styles.button}>
					Add New Task
				</Button>
				<Button onClick={showColumnHandler} className={styles.button}>
					Add New Column
				</Button>
			</div>
		</React.Fragment>
	);
}

export default BoardForm;
