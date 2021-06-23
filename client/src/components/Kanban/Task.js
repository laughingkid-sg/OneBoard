import moment from 'moment';
import React, { useContext } from 'react';
import { Badge } from 'reactstrap';
import { BiTime } from 'react-icons/bi';
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
			<DeleteModal id={task._id} title={task.name} type={TYPES.TASK} />
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
		<Draggable draggableId={task._id} index={taskIndex}>
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
						{task.expireAt && (
							<p style={{ fontSize: '16px', marginTop: '4px' }}>
								<Badge className="bg-warning align-self-start">
									<BiTime />{' '}
									{moment(task.expireAt).format('DD/MM/YY')}
								</Badge>
							</p>
						)}
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
