import React, { useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import BoardForm from './BoardForm/BoardForm';
import Column from './Column';
import TaskModal from './KanbanUI/TaskModal';
import styles from './Board.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { kanbanActions } from '../../store/kanban';

function Board() {
	const [showModal, setShowModal] = useState({ showModal: false });
	const tasks = useSelector((state) => state.kanban.tasks);
	const columns = useSelector((state) => state.kanban.columns);
	const columnOrder = useSelector((state) => state.kanban.columnOrder);
	const dispatch = useDispatch();

	// TODO Could be refactored
	const dragEndHandler = (result) => {
		const { source, destination, draggableId, type } = result;

		if (!destination) {
			return;
		}

		// If the Draggable has no change in position
		if (
			source.droppableId === destination.droppableId &&
			source.index === destination.index
		) {
			return;
		}

		const start = columns[source.droppableId];
		const finish = columns[destination.droppableId];

		// Operation for movement between columns
		if (type === 'column') {
			const newColOrder = [...columnOrder];
			newColOrder.splice(source.index, 1);
			newColOrder.splice(destination.index, 0, draggableId);

			dispatch(kanbanActions.columnReorder({ newColOrder }));
			return;
		}

		let newColumns = {};

		// Operation for same column
		if (start === finish) {
			const newTasks = [...start.taskIds];
			newTasks.splice(source.index, 1);
			newTasks.splice(destination.index, 0, draggableId);

			const newCol = {
				...start,
				taskIds: newTasks,
			};

			newColumns = {
				...columns,
				[newCol.id]: newCol,
			};
		} else {
			// Operation for different column
			const startTaskIds = [...start.taskIds];
			startTaskIds.splice(source.index, 1);
			const newStart = {
				...start,
				taskIds: startTaskIds,
			};

			const finTaskIds = [...finish.taskIds];
			finTaskIds.splice(destination.index, 0, draggableId);
			const newFin = {
				...finish,
				taskIds: finTaskIds,
			};

			newColumns = {
				...columns,
				[newStart.id]: newStart,
				[newFin.id]: newFin,
			};
		}

		dispatch(kanbanActions.taskReorder({ newColumns }));
		return;
	};

	const showModalHandler = (modal) => {
		setShowModal({ showModal: true, modal });
	}
	
	const editTaskModalHandler = (columnId, taskId) => {
		setTaskModal(columnId, taskId, true);
	};

	const setTaskModal = (columnId,taskId,isWrite) => {
		const task = tasks[taskId];
		const column = columns[columnId];
		// console.log(task);
		setShowModal({
			showModal: true,
			modal: (
				<TaskModal
					write={isWrite}
					id={task.id}
					title={task.taskName}
					description={task.description}
					columnTitle={column.title}
					columnId={columnId}
					onClose={closeModalHandler}
				/>
			),
		});
	}

	const closeModalHandler = () => {
		setShowModal({ showModal: false });
	};

	const renderCols = columnOrder.map((colId, index) => {
		const column = columns[colId];
		const tasksInCol = column.taskIds.map((taskId) => tasks[taskId]);
		return (
			<Column
				key={column.id}
				index={index}
				column={column}
				tasks={tasksInCol}
				title={column.title}
				onCancel={closeModalHandler}
				onEdit={editTaskModalHandler}
				showModal={showModalHandler}
			/>
		);
	});

	return (
		<React.Fragment>
			<BoardForm
				onOpen={showModalHandler}
				onClose={closeModalHandler}
			/>
			{showModal.showModal && showModal.modal}
			<DragDropContext onDragEnd={dragEndHandler}>
				<Droppable
					droppableId="all-cols"
					direction="horizontal"
					type="column"
				>
					{(provided) => (
						<div
							className={styles.board}
							{...provided.droppableProps}
							ref={provided.innerRef}
						>
							{renderCols}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>
		</React.Fragment>
	);
}

export default Board;
