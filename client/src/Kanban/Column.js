import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Task from './Task';
import styles from './Column.module.css';

function Column(props) {
	return (
		<div className={styles.container}>
			<Title title={props.title} />
			<Droppable droppableId={props.column.id}>
				{(provided, index) => (
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
							/>
						))}
						{provided.placeholder}
					</TaskList>
				)}
			</Droppable>
		</div>
	);
}

const Title = (props) => {
	return <h3 className={styles.title}>{props.title}</h3>;
};

const TaskList = (props) => {
	return (
		<div ref={props.innerRef} className={styles.taskList}>
			{props.children}
		</div>
	);
};

export default Column;
