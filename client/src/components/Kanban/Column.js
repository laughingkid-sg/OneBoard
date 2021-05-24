import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import Task from './Task';
import styles from './Column.module.css';

function Column(props) {
	return (
		<Draggable draggableId={props.column.id} index={props.index}>
			{(provided) => (
				<div
					className={styles.container}
					{...provided.draggableProps}
					ref={provided.innerRef}
				>
                    <h3 className={styles.title} {...provided.dragHandleProps}>{props.title}</h3>
					<Droppable droppableId={props.column.id}>
						{(provided) => (
							<TaskList
								{...provided.droppableProps}
								innerRef={provided.innerRef}
							>
								{props.tasks.map((task, index) => (
									<Task
										key={task.id}
										task={task}
										index={index}
										id={task.id}
										showModal={props.showModal.bind(null,props.title)}
									/>
								))}
								{provided.placeholder}
							</TaskList>
						)}
					</Droppable>
				</div>
			)}
		</Draggable>
	);
}

const TaskList = (props) => {
	return (
		<div ref={props.innerRef} className={styles.taskList} {...props.dragHandle}>
			{props.children}
		</div>
	);
};

export default Column;
