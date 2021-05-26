import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import Task from './Task';
import styles from './Column.module.css';
import EditDelete from './KanbanUI/EditDelete';
import DeleteModal from './KanbanUI/DeleteModal';
import ColumnEditModal from './KanbanUI/ColumnEditModal';
import TaskModal from './KanbanUI/TaskModal';

function Column(props) {
	const deleteColumnHandler = (e) => {
		e.stopPropagation();
		props.showModal(
			<DeleteModal
				isCol={true}
				title={props.title}
				columnId={props.column.id}
				onCancel={props.onCancel}
			/>
		);
	};

	const deleteTaskHandler = (
		taskId,
		taskName,
		index,
		onCancel = props.onCancel
	) => {
		props.showModal(
			<DeleteModal
				isCol={false}
				taskId={taskId}
				title={taskName}
				columnId={props.column.id}
				index={index}
				onCancel={onCancel}
			/>
		);
	};

	const editColumnHandler = (e) => {
		e.stopPropagation();
		props.showModal(
			<ColumnEditModal
				columnTitle={props.title}
				id={props.column.id}
				onClose={props.onCancel}
			/>
		);
	};

	const setTaskModal = (task, index, isWrite) => {
		props.showModal(
			<TaskModal
				write={isWrite}
				id={task.id}
				index={index}
				title={task.taskName}
				description={task.description}
				columnTitle={props.column.title}
				columnId={props.column.id}
				onClose={props.onCancel}
				onDelete={deleteTaskHandler}
			/>
		);
	};

	const renderTasks = props.tasks.map((task, index) => (
		<Task
			key={task.id}
			task={task}
			index={index}
			id={task.id}
			showModal={setTaskModal}
			onDelete={deleteTaskHandler}
		/>
	));

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
							className={styles.titleText}
							{...provided.dragHandleProps}
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
								{renderTasks}
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
