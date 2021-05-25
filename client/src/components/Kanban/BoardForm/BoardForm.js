import React from 'react';
import { useDispatch } from 'react-redux';
import AddTask from './AddTask';
import AddColumn from './AddColumn';
import Button from '../../../UI/Button';
import Modal from '../../../UI/Modal';
import styles from './BoardForm.module.css';
import { kanbanActions } from '../../../store/kanban';

function BoardForm(props) {
	const dispatch = useDispatch();

	const addTaskHandler = (taskName, description) => {
		dispatch(kanbanActions.addTask({ taskName, description }));
	};

	const addColumnHandler = (columnName) => {
		dispatch(kanbanActions.addColumn({ columnName }));
	};

	const showTaskHandler = () => {
		props.onOpen(
			<Modal onClose={props.onClose}>
				<AddTask onAddTask={addTaskHandler} onClose={props.onClose} />
			</Modal>
		);
	};

	const showColumnHandler = () => {
		props.onOpen(
			<Modal onClose={props.onClose}>
				<AddColumn
					onAddColumn={addColumnHandler}
					onClose={props.onClose}
				/>
			</Modal>
		);
	};

	return (
		<React.Fragment>
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
