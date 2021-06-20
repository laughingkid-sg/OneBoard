import React, { useContext } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import EditDelete from './KanbanUI/EditDelete';
import DeleteModal from './KanbanUI/DeleteModal';
import TaskModal from './KanbanUI/TaskModal';
import styles from './Task.module.css';
import ModalContext from '../../store/ModalContext';
import { TYPES } from '../../store/kanban-actions';

function Task(props) {
	// ! columnId, boardId not required anymore
	const { task, index: taskIndex, columnTitle } = props;
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
		// TODO set onCancel
		const deleteModal = (
			<DeleteModal id={task.id} title={task.name} type={TYPES.TASK} />
		);
		modalContext.showModal(deleteModal);
	};

	const setTaskModal = (isWrite) => {
		return (
			<TaskModal
				write={isWrite}
				task={task}
				columnTitle={columnTitle}
				onDelete={deleteTask}
			/>
		);
	};

	return (
		<Draggable draggableId={task.id} index={taskIndex}>
			{(provided) => {
				return (
					<div
						className={styles.container}
						{...provided.draggableProps}
						{...provided.dragHandleProps}
						ref={provided.innerRef}
						onClick={showTaskHandler}
					>
						<p>{task.name}</p>
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
