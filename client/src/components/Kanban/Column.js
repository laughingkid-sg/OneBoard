import React, { useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { useDispatch } from 'react-redux';
import Task from './Task';
import { kanbanActions } from '../../store/kanban';
import styles from './Column.module.css';
import EditDelete from './KanbanUI/EditDelete';
import DeleteModal from './KanbanUI/DeleteModal';
import ColumnEditModal from './KanbanUI/ColumnEditModal';

function Column(props) {
	const dispatch = useDispatch();

	const deleteTask = (columnId, taskId, index) => {
		dispatch(kanbanActions.deleteTask({ columnId, taskId, index }));
	};

	const deleteColumnHandler = (e) => {
		e.stopPropagation();
		props.onDelete(
			<DeleteModal
				isCol={true}
				columnId={props.column.id}
				onCancel={props.onCancel}
			/>
		);
	};

	const editColumnHandler = (e) => {
		e.stopPropagation();
		props.onColEdit(
			<ColumnEditModal columnTitle={props.title} id={props.column.id} onClose={props.onCancel}/>
		);
	};

	return (
		<Draggable draggableId={props.column.id} index={props.index}>
			{(provided) => (
				<div
					className={styles.container}
					{...provided.draggableProps}
					ref={provided.innerRef}
				>
					<div className={styles.title}>
						<h3
							className={styles.title}
							{...provided.dragHandleProps}
							// onClick={props.onEdit.bind(
							// 	null,
							// 	props.column.id,
							// 	''
							// )}
						>
							{props.title}
						</h3>
						<EditDelete
							onEdit={editColumnHandler}
							onDelete={deleteColumnHandler}
						/>
					</div>
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
										showModal={props.showTaskModal.bind(
											null,
											props.column.id
										)}
										onDelete={deleteTask.bind(
											null,
											props.column.id
										)}
										onEdit={props.onEdit.bind(
											null,
											props.column.id,
											task.id
										)}
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
