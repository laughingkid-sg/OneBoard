import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styles from './Task.module.css';

function Task(props) {
    return (
		<Draggable draggableId={props.id} index={props.index}>
			{(provided) => {
				return <div
					className={styles.container}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					ref={provided.innerRef}
				>
					{props.task.content}
				</div>;
			}}
		</Draggable>
	);
}

export default Task;
