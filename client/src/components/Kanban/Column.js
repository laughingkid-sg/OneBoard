import React, {useState} from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import {useDispatch} from 'react-redux'
import Task from './Task';
import { kanbanActions } from '../../store/kanban';
import styles from './Column.module.css';

function Column(props) {
	const dispatch = useDispatch();

	const deleteTask = (columnId,taskId,index) => {
		dispatch(kanbanActions.deleteTask({ columnId, taskId,index }));
	}
	
	return (
		<Draggable draggableId={props.column.id} index={props.index}>
			{(provided) => (
				<div
					className={styles.container}
					{...provided.draggableProps}
					ref={provided.innerRef}
				>
					<h3 className={styles.title} {...provided.dragHandleProps} onClick={props.onEdit.bind(null,props.column.id,'')}>
						{props.title}
					</h3>
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
										showModal={props.showModal.bind(
											null,
											props.title
										)}
										onDelete={deleteTask.bind(null,props.column.id)}
										onEdit={props.onEdit.bind(null,props.column.id,task.id)}
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
		<div
			ref={props.innerRef}
			className={styles.taskList}
			{...props.dragHandle}
		>
			{props.children}
		</div>
	);
};

export default Column;
