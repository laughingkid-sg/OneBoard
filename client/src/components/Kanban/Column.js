import React, { useState, useRef } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { AiOutlinePlus } from 'react-icons/ai';
import { FaTrash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import Task from './Task';
import AddTask from './AddTask';
import DeleteModal from './KanbanUI/DeleteModal';
import styles from './Column.module.css';
import { kanbanActions } from '../../store/kanban';

function Column(props) {
	const [isEditingTask, setIsEditingTask] = useState(false);
	const [editTitle, setIsEditTitle] = useState({
		isEditing: false,
		previous: props.title,
	});
	const newTitle = useRef(props.title);
	const dispatch = useDispatch();

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

	const addTaskHandler = () => {
		setIsEditingTask(true);
	};

	const cancelTaskHandler = () => {
		setIsEditingTask(false);
	};

	const editTitleHandler = () => {
		setIsEditTitle({ ...editTitle, isEditing: true });
	};

	const updateColumnHandler = () => {
		const updatedTitle = newTitle.current.value.trim();
		if (
			editTitle.previous === newTitle.current.value ||
			updatedTitle === ''
		) {
			setIsEditTitle({ ...editTitle, isEditing: false });
			return;
		}
		dispatch(
			kanbanActions.editColumn({
				colId: props.column.id,
				columnName: updatedTitle,
			})
		);
		setIsEditTitle({ isEditing: false, previous: updatedTitle });
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
		<AddTask cancelEdit={cancelTaskHandler} columnId={props.column.id} />
	) : (
		<div
			style={{
				display: 'flex',
				flexDirection: 'row',
				height: '50px',
				cursor: 'pointer',
			}}
			onClick={addTaskHandler}
		>
			<AiOutlinePlus />
			<p>Add a task</p>
		</div>
	);

	const renderEditCol = editTitle.isEditing ? (
		<div>
			<input
				autoFocus
				ref={newTitle}
				placeholder={props.title}
				onBlur={updateColumnHandler}
			/>
			<FaTrash onClick={deleteColumnHandler} />
		</div>
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
