import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import EditDelete from './KanbanUI/EditDelete';
import DeleteModal from './KanbanUI/DeleteModal';
import TaskModal from './KanbanUI/TaskModal';
import styles from './Task.module.css';

function Task(props) {
	const deleteTaskHandler = (e) => {
		e.stopPropagation();
		deleteTask();
	};

	const showTaskHandler = (e) => {
		if (e.defaultPrevented) {
			return;
		}
		console.log('showTask');
		props.showModal(setTaskModal(false));
	};

	const editTaskHandler = (e) => {
		e.stopPropagation();
		props.showModal(setTaskModal(true));
	};

	const deleteTask = () => {
		const deleteModal = (
			<DeleteModal
				isCol={false}
				taskId={props.id}
				title={props.task.taskName}
				columnId={props.colId}
				index={props.index}
				onCancel={props.onCancel}
			/>
		);
		props.showModal(deleteModal);
	};

	const setTaskModal = (isWrite) => {
		return (
			<TaskModal
				write={isWrite}
				id={props.id}
				index={props.index}
				title={props.task.taskName}
				description={props.task.description}
				columnTitle={props.columnTitle}
				columnId={props.colId}
				onClose={props.onCancel}
				onDelete={deleteTask}
			/>
		);
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
						onClick={showTaskHandler}
					>
						<p>{props.task.taskName}</p>
						<EditDelete
							onEdit={editTaskHandler}
							onDelete={deleteTaskHandler}
						/>
					</div>
				);
			}}
		</Draggable>
	);
}

export default Task;
