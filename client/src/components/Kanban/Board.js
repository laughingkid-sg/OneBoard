import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { AiOutlinePlus } from 'react-icons/ai';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Column from './Column';
import styles from './Board.module.css';
import AddColumn from './Add/AddColumn';
import { kanbanActions } from '../../store/kanban';
import { fetchAllBoards } from '../../store/kanban-actions';

function Board(props) {
	const [isEditing, setIsEditing] = useState(false);
	const [cookies] = useCookies(['t']);
	const { t: token } = cookies;
	const userId = localStorage.getItem('id');
	// const boardId = useSelector((state) => state.user.boards.selectedBoard);
	const kanban = useSelector((state) => state.kanban);
	const { columns, id: boardId } = kanban;
	const dispatch = useDispatch();

	useEffect(() => {
		function boardFromStorage() {
			let strBoard = localStorage.getItem('currentBoard');
			let jsonBoard = JSON.parse(strBoard);
			if (jsonBoard) {
				// TODO
				// if (jsonBoard.id === boardId) {
				// 	console.log('Mount from storage');
				// 	console.log(jsonBoard, kanban);
				// } else {
				// 	strBoard = localStorage.getItem('boards');
				// 	jsonBoard = JSON.parse(strBoard).filter(
				// 		(board) => board.id === boardId
				// 	);
				// }
				console.log('Mount from storage');
				dispatch(kanbanActions.replace(jsonBoard));
			} else {
				console.log('Fetch from server');
				dispatch(fetchAllBoards(token));
			}
		}

		boardFromStorage();
		return () => {
			console.log('Unmount');
			dispatch(kanbanActions.store());
		};
	}, [dispatch, userId, token]); // TODO insert boardId to dependencies

	// TODO Could be refactored
	const dragEndHandler = (result) => {
		// const { source, destination, draggableId, type } = result;
		// if (!destination) {
		// 	return;
		// }
		// // If the Draggable has no change in position
		// if (
		// 	source.droppableId === destination.droppableId &&
		// 	source.index === destination.index
		// ) {
		// 	return;
		// }
		// const start = columns[source.droppableId];
		// const finish = columns[destination.droppableId];
		// // Operation for movement between columns
		// if (type === 'column') {
		// 	const newColOrder = [...columnOrder];
		// 	newColOrder.splice(source.index, 1);
		// 	newColOrder.splice(destination.index, 0, draggableId);
		// 	dispatch(kanbanActions.columnReorder({ newColOrder }));
		// 	// dispatch(updateColOrder(boardId, newColOrder, token));
		// 	return;
		// }
		// let newColumns = {};
		// // Operation for same column
		// if (start === finish) {
		// 	const newTasks = [...start.taskIds];
		// 	newTasks.splice(source.index, 1);
		// 	newTasks.splice(destination.index, 0, draggableId);
		// 	const newCol = {
		// 		...start,
		// 		taskIds: newTasks,
		// 	};
		// 	newColumns = {
		// 		...columns,
		// 		[newCol.id]: newCol,
		// 	};
		// } else {
		// 	// Operation for different column
		// 	const startTaskIds = [...start.taskIds];
		// 	startTaskIds.splice(source.index, 1);
		// 	const newStart = {
		// 		...start,
		// 		taskIds: startTaskIds,
		// 	};
		// 	const finTaskIds = [...finish.taskIds];
		// 	finTaskIds.splice(destination.index, 0, draggableId);
		// 	const newFin = {
		// 		...finish,
		// 		taskIds: finTaskIds,
		// 	};
		// 	newColumns = {
		// 		...columns,
		// 		[newStart.id]: newStart,
		// 		[newFin.id]: newFin,
		// 	};
		// }
		// dispatch(kanbanActions.taskReorder({ newColumns }));
		// return;
	};

	const addColumnHandler = () => {
		setIsEditing(true);
	};

	const cancelHandler = () => {
		setIsEditing(false);
	};

	const renderCols = columns.map((col, index) => (
		<Column key={col.id} index={index} boardId={boardId} column={col} />
	));

	const renderAddCol = isEditing ? (
		<AddColumn
			onCancel={cancelHandler}
			boardId={boardId}
			next={columns.length}
		/>
	) : (
		<div className={styles.addColBtn} onClick={addColumnHandler}>
			<AiOutlinePlus />
			<h4>Add Column</h4>
		</div>
	);

	return (
		<div style={{ display: 'flex', flexDirection: 'row' }}>
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
