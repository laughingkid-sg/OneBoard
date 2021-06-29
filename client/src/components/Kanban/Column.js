import React, { useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { AiOutlinePlus } from 'react-icons/ai';
import { Card, CardHeader, CardFooter } from 'reactstrap';
import Task from './Task';
import AddData from './Add/AddData';
import EditColumn from './Edit/EditColumn';
import styles from './Column.module.css';
import { TYPES } from '../../store/kanban-actions';

function Column(props) {
	const { column, index: colIndex } = props;
	const { name, tasks, _id: columnId } = column;
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

	const renderAddTask = isEditingTask ? (
		<CardFooter>
			<AddData
				id={columnId}
				onCancel={cancelTaskHandler}
				order={tasks.length}
				type={TYPES.TASK}
			/>
		</CardFooter>
	) : (
		<div className={styles.addTaskBtn} onClick={addTaskHandler}>
			<AiOutlinePlus className={styles.addTaskIcon} />
			<p>Add a task</p>
		</div>
	);

	const renderEditCol = editTitle ? (
		<EditColumn
			title={name}
			onCancel={cancelTitleHandler}
			column={column}
		/>
	) : (
		<h4 className={styles.titleText} onClick={editTitleHandler}>
			{name}
		</h4>
	);

	return (
		<Draggable draggableId={columnId} index={colIndex}>
			{(provided) => (
				<Card
					className={styles.container}
					{...provided.draggableProps}
					innerRef={provided.innerRef}
				>
					<CardHeader
						className={styles.title}
						{...provided.dragHandleProps}
					>
						{renderEditCol}
					</CardHeader>
					<Droppable droppableId={columnId} type="task">
						{(provided) => (
							<React.Fragment>
								<TaskList
									{...provided.droppableProps}
									innerRef={provided.innerRef}
									tasks={tasks}
									columnTitle={name}
								>
									{provided.placeholder}
								</TaskList>
								{renderAddTask}
							</React.Fragment>
						)}
					</Droppable>
				</Card>
			)}
		</Draggable>
	);
}

const TaskList = (props) => {
	const renderTasks = props.tasks.map((task, index) => (
		<Task
			key={task._id}
			task={task}
			index={index}
			columnTitle={props.columnTitle}
		/>
	));

	return (
		<div
			ref={props.innerRef}
			className={styles.taskList}
			{...props.dragHandle}
		>
			{renderTasks}
			{props.children}
		</div>
	);
};

export default Column;
