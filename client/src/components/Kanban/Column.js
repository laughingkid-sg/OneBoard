import React, { useState, useRef } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { AiOutlinePlus } from 'react-icons/ai';
import Task from './Task';
import AddTask from './AddTask';
import styles from './Column.module.css';
import EditColumn from './EditColumn';

function Column(props) {
	const [isEditingTask, setIsEditingTask] = useState(false);
	const [editTitle, setIsEditTitle] = useState(false);

	const addTaskHandler = () => {
		setIsEditingTask(true);
	};

	const cancelTaskHandler = () => {
		setIsEditingTask(false);
	};

	const editTitleHandler = () => {
		setIsEditTitle(true);
	};

	const cancelTitleHandler = () => {
		setIsEditTitle(false);
	};

	const renderTasks = props.tasks.map((task, index) => (
		<Task
			key={task.id}
			task={task}
			index={index}
			id={task.id}
			colId={props.column.id}
			columnTitle={props.title}
			showModal={props.showModal}
			onCancel={props.onCancel}
		/>
	));

	const renderAddTask = isEditingTask ? (
		<AddTask columnId={props.column.id} onCancel={cancelTaskHandler} />
	) : (
		<div className={styles.addTaskBtn} onClick={addTaskHandler}>
			<AiOutlinePlus className={styles.addTaskIcon} />
			<p>Add a task</p>
		</div>
	);

	const renderEditCol = editTitle ? (
		<EditColumn
			title={props.title}
			onCancel={cancelTitleHandler}
			onModalCancel={props.onCancel}
			onDelete={props.showModal}
			columnId={props.column.id}
		/>
	) : (
		<h3 className={styles.titleText} onClick={editTitleHandler}>
			{props.title}
		</h3>
	);

	return (
		<Draggable draggableId={props.column.id} index={props.index}>
			{(provided) => (
				<div
					className={styles.container}
					{...provided.draggableProps}
					ref={provided.innerRef}
				>
					<div className={styles.title} {...provided.dragHandleProps}>
						{renderEditCol}
					</div>
					<Droppable droppableId={props.column.id}>
						{(provided) => (
							<React.Fragment>
								<TaskList
									{...provided.droppableProps}
									innerRef={provided.innerRef}
								>
									{renderTasks}
									{provided.placeholder}
								</TaskList>
								{renderAddTask}
							</React.Fragment>
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
