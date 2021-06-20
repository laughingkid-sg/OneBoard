import React, { useState, useRef } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { AiOutlinePlus } from 'react-icons/ai';
import Task from './Task';
import AddTask from './AddTask';
import styles from './Column.module.css';
import EditColumn from './EditColumn';

function Column(props) {
	const { boardId, column, index: colIndex } = props;
	const { name, tasks, id: columnId } = column;
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

	const renderTasks = tasks.map((task, index) => (
		<Task
			key={task.id}
			task={task}
			index={index}
			id={task.id}
			boardId={boardId}
			colId={columnId}
			columnTitle={name}
		/>
	));

	const renderAddTask = isEditingTask ? (
		<AddTask
			boardId={boardId}
			columnId={columnId}
			onCancel={cancelTaskHandler}
		/>
	) : (
		<div className={styles.addTaskBtn} onClick={addTaskHandler}>
			<AiOutlinePlus className={styles.addTaskIcon} />
			<p>Add a task</p>
		</div>
	);

	const renderEditCol = editTitle ? (
		<EditColumn
			title={name}
			boardId={boardId}
			onCancel={cancelTitleHandler}
			columnId={columnId}
		/>
	) : (
		<h4 className={styles.titleText} onClick={editTitleHandler}>
			{name}
		</h4>
	);

	return (
		<Draggable draggableId={columnId} index={colIndex}>
			{(provided) => (
				<div
					className={styles.container}
					{...provided.draggableProps}
					ref={provided.innerRef}
				>
					<div className={styles.title} {...provided.dragHandleProps}>
						{renderEditCol}
					</div>
					<Droppable droppableId={columnId}>
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
