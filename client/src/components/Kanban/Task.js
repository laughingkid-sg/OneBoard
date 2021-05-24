import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { IconContext } from 'react-icons';
import { FaEdit, FaTrash } from 'react-icons/fa';
import styles from './Task.module.css';

function Task(props) {

	const showTask = (e) => {
		if (e.defaultPrevented) {
			return;
		}

		props.showModal(props.task);
	};

	const deleteTask = (e) => {
		e.stopPropagation();
		props.onDelete(props.id,props.index)
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
						<div className={styles.icons}>
							<IconContext.Provider value={{className: styles.icons}}>
								<FaEdit />
								<FaTrash onClick={deleteTask}/>
							</IconContext.Provider>
						</div>
					</div>
				);
			}}
		</Draggable>
	);
}

export default Task;
