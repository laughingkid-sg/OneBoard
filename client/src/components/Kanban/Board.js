import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { AiOutlinePlus } from 'react-icons/ai';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Column from './Column';
import styles from './Board.module.css';
import AddColumn from './Add/AddColumn';
import { kanbanActions } from '../../store/kanban';
import { TYPES, fetchAllBoards, updateData } from '../../store/kanban-actions';

function Board(props) {
	const [isEditing, setIsEditing] = useState(false);
	const [cookies] = useCookies(['t']);
	const { t: token } = cookies;
	// const userId = localStorage.getItem('id');
	// const boardId = useSelector((state) => state.user.boards.selectedBoard);
	const kanban = useSelector((state) => state.kanban);
	const { columns, id: boardId } = kanban;
	const dispatch = useDispatch();

	// TODO insert boardId to dependencies
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
	}, [dispatch, token]);

	// TODO Could be refactored
	const dragEndHandler = (result) => {
		const { source, destination, draggableId, type } = result;
		console.log(source, destination, draggableId, type);

		// Draggable dropped outside of DnD
		if (!destination) {
			return;
		}

		// Draggable has no change in position
		if (
			source.droppableId === destination.droppableId &&
			source.index === destination.index
		) {
			return;
		}

		// * Operation for movement between columns
		if (type === 'column') {
			console.log('Reorder columns');
			let columnsInOrder = [...columns];
			const [colToMove] = columnsInOrder.splice(source.index, 1);
			columnsInOrder.splice(destination.index, 0, colToMove);
			columnsInOrder = columnsInOrder.map((col, index) => {
				return { ...col, order: index };
			});
			const data = { name: kanban.name, columns: columnsInOrder };
			dispatch(updateData(token, TYPES.BOARD, data, boardId));
			return;
		}

		const start = columns.find((col) => col._id === source.droppableId);
		const finish = columns.find(
			(col) => col._id === destination.droppableId
		);

		const { name, order, _id } = start;
		let data = {};
		// * Operation for same column
		if (start === finish) {
			let tasksInCol = [...start.tasks];
			const taskIndex = tasksInCol.findIndex(
				(task) => task._id === draggableId
			);
			const taskToMove = tasksInCol[taskIndex];
			tasksInCol.splice(taskIndex, 1);
			tasksInCol.splice(destination.index, 0, taskToMove);
			tasksInCol = tasksInCol.map((task, index) => {
				return {
					...task,
					expireAt:
						task.expireAt && new Date(task.expireAt).toISOString(),
					order: index,
				};
			});

			data = { name, order, tasks: tasksInCol };
			dispatch(updateData(token, TYPES.COLUMN, data, _id));
		} else {
			// * Operation for different column
			// * DraggableId is the task being moved
			console.log('Moving task to different column');
			let tasksInStart = [...start.tasks];
			let tasksInFin = [...finish.tasks];
			const [taskToMove] = tasksInStart.splice(source.index, 1);
			tasksInFin.splice(destination.index, 0, taskToMove);
			const newStart = { ...start, tasks: tasksInStart };
			const newFin = { ...finish, tasks: tasksInFin };
			dispatch(updateData(token, TYPES.COLUMN, newStart, newStart._id));
			dispatch(updateData(token, TYPES.COLUMN, newFin, newFin._id));
		}
		return;
	};

	const addColumnHandler = () => {
		setIsEditing(true);
	};

	const cancelHandler = () => {
		setIsEditing(false);
	};

	const renderCols = columns.map((col, index) => (
		<Column key={col._id} index={index} boardId={boardId} column={col} />
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
