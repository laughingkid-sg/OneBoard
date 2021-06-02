import React, { useContext } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import EditDelete from './KanbanUI/EditDelete';
import DeleteModal from './KanbanUI/DeleteModal';
import TaskModal from './KanbanUI/TaskModal';
import styles from './Task.module.css';
import ModalContext from '../../store/ModalContext';

function Task(props) {
	const modalContext = useContext(ModalContext);

	const deleteTaskHandler = (e) => {
		e.stopPropagation();
		deleteTask();
	};

	const showTaskHandler = (e) => {
		if (e.defaultPrevented) {
			return;
		}
		modalContext.showModal(setTaskModal(false));
	};

	const editTaskHandler = (e) => {
		e.stopPropagation();
		modalContext.showModal(setTaskModal(true));
	};

	const deleteTask = () => {
		const deleteModal = (
			<DeleteModal
				isCol={false}
				taskId={props.id}
				title={props.task.taskName}
				boardId={props.boardId}
				columnId={props.colId}
			/>
		);
		modalContext.showModal(deleteModal);
	};

	const setTaskModal = (isWrite) => {
		return (
			<TaskModal
				write={isWrite}
				id={props.id}
				boardId={props.boardId}
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
