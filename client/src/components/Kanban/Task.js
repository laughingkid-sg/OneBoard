import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import EditDelete from './KanbanUI/EditDelete';
import styles from './Task.module.css';

function Task(props) {
	const showTask = ( e) => {
		if (e.defaultPrevented) {
			return;
		}

		props.showModal(props.task.id);
	};

	const deleteTask = (e) => {
		e.stopPropagation();
		props.onDelete(props.id, props.index);
	};

	const editTask = (e) => {
		e.stopPropagation();
		props.onEdit();
	}

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
						<h3>{props.task.taskName}</h3>
						<span className={styles.description}>
							{props.task.description}
						</span>
						<EditDelete onEdit={editTask} onDelete={deleteTask} />
					</div>
				);
			}}
		</Draggable>
	);
}

export default Task;
