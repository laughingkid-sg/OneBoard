import React, { useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import BoardForm from './BoardForm/BoardForm';
import Column from './Column';
import TaskModal from './TaskModal';
import styles from './Board.module.css';
import initData from './init-data';
import { useSelector, useDispatch } from 'react-redux';
import { kanbanActions } from '../../store/kanban';

function Board() {
	const [showModal, setShowModal] = useState({ showModal: false });
	const tasks = useSelector((state) => state.kanban.tasks);
	const columns = useSelector((state) => state.kanban.columns);
	const columnOrder = useSelector((state) => state.kanban.columnOrder);
	const dispatch = useDispatch();

	const dragEndHandler = (result) => {
		const { source, destination, draggableId, type } = result;
		// console.log(source, destination);

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

	const addTaskHandler = (taskName, description) => {
		dispatch(kanbanActions.addTask({ taskName, description }));
	};

	const addColumnHandler = (columnName) => {
		dispatch(kanbanActions.addColumn({ columnName }));
	};

	const showModalHandler = (columnTitle, task) => {
		setShowModal({
			showModal: true,
			modal: (
				<TaskModal
					id={task.id}
					title={task.taskName}
					description={task.description}
					columnTitle={columnTitle}
					onClose={closeModalHandler}
				/>
			),
		});
	};

	const closeModalHandler = () => {
		console.log('closeModalHandler called');
		setShowModal({ showModal: false });
	};

	const editModalHandler = (columnId, taskId) => {
		const task = tasks[taskId];
		const column = columns[columnId];
		setShowModal({
			showModal: true,
			modal: (
				<TaskModal
					write={true}
					id={task.id}
					title={task.taskName}
					description={task.description}
					columnTitle={column.title}
					onClose={closeModalHandler}
				/>
			),
		});

		// console.log('Render Edit Column');
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
				showModal={showModalHandler}
				onEdit={editModalHandler}
			/>
		);
	});

	return (
		<React.Fragment>
			<BoardForm
				onAddTask={addTaskHandler}
				onAddColumn={addColumnHandler}
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
