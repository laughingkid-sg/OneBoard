import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { FaEllipsisH } from 'react-icons/fa';
import styles from './Task.module.css';

function Task(props) {
	const showTask = (e) => {
		if (e.defaultPrevented) {
			return;
		}

		props.showModal(props.task);
	};

	return (
		<Draggable draggableId={props.id} index={props.index}>
			{(provided) => {
				return (
					<div
						className={styles.container}
						{...provided.draggableProps}
						{...provided.dragHandleProps}
						ref={provided.innerRef}
						onClick={showTask}
					>
						<h4>{props.task.taskName}</h4>
						{/* <FaEllipsisH onClick={showTask} /> */}
						<span className={styles.description}>
							{props.task.description}
						</span>
						{/* Make this bigger for users to click on it */}
					</div>
				);
			}}
		</Draggable>
	);
}

export default Task;
