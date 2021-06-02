import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import Button from '../../../UI/Button';
import Modal from '../../../UI/Modal';
import styles from './TaskModal.module.css';
import { updateTask } from '../../../store/kanban-actions';

function TaskModal(props) {
	const dispatch = useDispatch();
	const taskName = useRef(props.title);
	const description = useRef(props.description);
	const [isWrite, setIsWrite] = useState(props.write || false);
	const [beforeChange, setBeforeChange] = useState({
		taskName: props.title,
		description: props.description,
	});
	const token = useSelector((state) => state.user.token);

	const confirmEditHandler = () => {
		if (taskName.current.value.trim() === '') {
			return;
		}

		if (
			taskName.current.value === beforeChange.taskName &&
			description.current.value === beforeChange.description
		) {
			toggleEditHandler();
			return;
		}

		const updatedTask = {
			name: taskName.current.value,
			description: description.current.value,
		};

		setBeforeChange(updatedTask);
		// dispatch(kanbanActions.editTask({ ...updatedTask, id: props.id }));
		dispatch(
			updateTask(
				props.boardId,
				props.columnId,
				props.id,
				updatedTask,
				token
			)
		);
		toggleEditHandler();
	};

	const toggleEditHandler = () => {
		setIsWrite((prevWrite) => !prevWrite);
	};

	const deleteTaskHandler = () => {
		props.onDelete(props.id, props.title, props.index);
	};

	const renderButtons = isWrite ? (
		<div className={styles.btnContainer}>
			<Button onClick={confirmEditHandler} className={styles.confirm}>
				Confirm Changes
			</Button>
			<Button onClick={toggleEditHandler}>Cancel Changes</Button>
		</div>
	) : (
		<div className={styles.btnContainer}>
			<Button onClick={deleteTaskHandler} className={styles.delete}>
				Delete Task
			</Button>
			<Button onClick={toggleEditHandler}>Edit Task</Button>
		</div>
	);

	return (
		<Modal onClose={props.onClose}>
			<div className={styles.container}>
				<AiOutlineClose
					onClick={props.onClose}
					className={styles.close}
				/>

				<div className={styles.taskinfo}>
					{!isWrite && (
						<h2 className={styles.title}>
							{beforeChange.taskName}
						</h2>
					)}
					{isWrite && (
						<input
							type="text"
							id="taskTitle"
							ref={taskName}
							defaultValue={beforeChange.taskName}
							className={styles.input}
						/>
					)}
					<p className={styles.subtitle}>in {props.columnTitle}</p>
				</div>

				<div className={styles.taskinfo}>
					<h3 className={styles.header}>Description</h3>
					{!isWrite && (
						<p className={styles.description}>
							{beforeChange.description}
						</p>
					)}
					{isWrite && (
						<textarea
							rows="10"
							ref={description}
							defaultValue={beforeChange.description}
							className={styles.input}
						/>
					)}
				</div>

				{/* Labels */}
				{/* <h3>Labels</h3> */}

				{/* Subtasks */}
				{/* <h3>Subtasks</h3> */}

				{renderButtons}
			</div>
		</Modal>
	);
}

export default TaskModal;
