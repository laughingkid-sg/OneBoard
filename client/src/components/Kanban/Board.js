import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { AiOutlinePlus } from 'react-icons/ai';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Column from './Column';
import styles from './Board.module.css';
import AddColumn from './AddColumn';
import { kanbanActions } from '../../store/kanban';
import { createBoard, fetchBoardData } from '../../store/kanban-actions';
import { fetchUserData } from '../../store/user-actions';

function Board(props) {
	const [showModal, setShowModal] = useState({ showModal: false });
	const [isEditing, setIsEditing] = useState(false);
	const [cookies] = useCookies(['t']);
	const { t: token } = cookies;
	const userId = localStorage.getItem('id');
	const boardId = useSelector((state) => state.user.boards.selectedBoard);
	const tasks = useSelector((state) => state.kanban.tasks);
	const columns = useSelector((state) => state.kanban.columns);
	const columnOrder = useSelector((state) => state.kanban.columnOrder);
	const dispatch = useDispatch();

	useEffect(() => {
		if (!boardId) {
			dispatch(createBoard('My First Board', token));
			dispatch(fetchUserData(userId, token));
			return;
		}
		dispatch(fetchBoardData(boardId, token));
	}, [dispatch, boardId, token]);

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
			// dispatch(updateColOrder(boardId, newColOrder, token));
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

	const addColumnHandler = () => {
		setIsEditing(true);
	};

	const cancelHandler = () => {
		setIsEditing(false);
	};

	const renderCols = columnOrder.map((colId, index) => {
		const column = columns[colId];
		const tasksInCol = column.taskIds.map((taskId) => tasks[taskId]);
		return (
			<Column
				key={column.id}
				boardId={boardId}
				index={index}
				column={column}
				tasks={tasksInCol}
				title={column.title}
			/>
		);
	});

	const renderAddCol = isEditing ? (
		<AddColumn onCancel={cancelHandler} boardId={boardId} />
	) : (
		<div className={styles.addColBtn} onClick={addColumnHandler}>
			<AiOutlinePlus />
			<h3>Add Column</h3>
		</div>
	);

	return (
		<div style={{ display: 'flex', flexDirection: 'row' }}>
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
			{renderAddCol}
		</div>
	);
}

export default Board;
