import React, { useState, useRef } from 'react';
import {useDispatch} from 'react-redux'
import { AiOutlineClose } from 'react-icons/ai';
import Button from '../../UI/Button';
import Modal from '../../UI/Modal';
import styles from './TaskModal.module.css';
import { kanbanActions } from '../../store/kanban';

function TaskModal(props) {
	const dispatch = useDispatch();
	const taskName = useRef(props.title);
	const description = useRef(props.description);
	const [isWrite, setIsWrite] = useState(props.write || false);
	const [beforeChange, setBeforeChange] = useState({taskName:props.title,description:props.description})

	const confirmEditHandler = () => {
		// console.log(taskName.current.value)
		if (taskName.current.value.trim() === '') {
			return;
		}

		const updatedTask = {taskName: taskName.current.value,description:description.current.value}
		setBeforeChange(updatedTask)
		// setIsWrite(false)
		dispatch(kanbanActions.editTask({...updatedTask, id:props.id}));
	};

	const cancelEditHandler = () => {
		setIsWrite(false)
	}

	return (
		<Modal onClose={props.onClose}>
			<div className={styles.container}>
				<AiOutlineClose
					onClick={props.onClose}
					className={styles.close}
				/>

				<div className={styles.taskinfo}>
					{!isWrite && (
						<h2 className={styles.title}>{beforeChange.taskName}</h2>
					)}
					{isWrite && <input type="text" id="taskTitle" ref={taskName} defaultValue={beforeChange.taskName}/>}
					<p className={styles.subtitle}>in {props.columnTitle}</p>
				</div>

				<div className={styles.taskinfo}>
					<h3 className={styles.header}>Description</h3>
					{!isWrite && (
						<p className={styles.description}>
							{beforeChange.description}
						</p>
					)}
					{isWrite && <textarea ref={description} defaultValue={beforeChange.description}></textarea>}
				</div>

				{/* Labels */}
				{/* <h3>Labels</h3> */}

				{/* Subtasks */}
				{/* <h3>Subtasks</h3> */}

				{/* Some button badges to edit or remove task? */}
				{isWrite && <Button onClick={confirmEditHandler}>Confirm changes</Button>}
				{isWrite && <Button onClick={cancelEditHandler}>Cancel</Button>}
			</div>
		</Modal>
	);
}

export default TaskModal;
