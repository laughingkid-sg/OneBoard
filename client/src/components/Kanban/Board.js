import React, { useEffect, useState, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { AiOutlinePlus } from 'react-icons/ai';
import { Button, Input } from 'reactstrap';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Column from './Column';
import styles from './Board.module.css';
import AddColumn from './Add/AddColumn';
import { kanbanActions } from '../../store/kanban';
import {
	TYPES,
	fetchAllBoards,
	updateData,
	addData,
} from '../../store/kanban-actions';
import EditDelete from './KanbanUI/EditDelete';
import { getBoard } from '../../store/kanban-actions';
import useInput from '../hooks/use-input';
import { userActions } from '../../store/user';

function Board(props) {
	const [isEditing, setIsEditing] = useState(false);
	const [cookies] = useCookies(['t']);
	const { t: token } = cookies;
	const boards = useSelector((state) => state.user.boards);
	const kanban = useSelector((state) => state.kanban);
	const { columns, id: boardId } = kanban;
	const dispatch = useDispatch();

	// For board operations
	const selectBoardRef = useRef();
	const [boardAdd, setBoardAdd] = useState(false);
	const toggleBoardAdd = () => {
		setBoardAdd((prevAdd) => !prevAdd);
	};
	const addBoardHandler = () => {
		if (!boardNameIsValid) return;
		const data = { name: boardName };
		dispatch(addData(token, TYPES.BOARD, data));
		boardNameReset();
		toggleBoardAdd();
	};

	const boardSelectChangeHandler = () => {
		const newBoardId = selectBoardRef.current.value;
		dispatch(getBoard(token, newBoardId));
		dispatch(userActions.setSelectedBoard(newBoardId));
	};

	const {
		value: boardName,
		isValid: boardNameIsValid,
		// hasError: boardNameHasError,
		onChange: boardNameOnChange,
		onBlur: boardNameOnBlur,
		reset: boardNameReset,
	} = useInput((value) => value.trim() !== '', '');

	// TODO useEffect when board changes
	useEffect(() => {
		function boardFromStorage() {
			let strBoard = localStorage.getItem('currentBoard');
			let jsonBoard = JSON.parse(strBoard);
			if (strBoard === JSON.stringify(kanban)) {
				console.log('Mount from storage', jsonBoard);
				dispatch(kanbanActions.replace(jsonBoard));
			} else {
				console.log('Fetch from server');
				dispatch(fetchAllBoards(token));
			}
		}

		boardFromStorage();
		return () => {
			// console.log('Unmount');
			dispatch(kanbanActions.store());
		};
	}, [dispatch, token]);

	const dragEndHandler = (result) => {
		const { source, destination, draggableId, type } = result;

		// Draggable dropped outside of DnD
		// Draggable has no change in position
		if (
			!destination ||
			(source.droppableId === destination.droppableId &&
				source.index === destination.index)
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

		// * Operation for same column
		if (start === finish) {
			const { name, order, _id } = start;
			let tasksInCol = [...start.tasks];
			const [taskToMove] = tasksInCol.splice(source.index, 1);
			tasksInCol.splice(destination.index, 0, taskToMove);
			tasksInCol = tasksInCol.map((task, index) => {
				return {
					...task,
					expireAt:
						task.expireAt && new Date(task.expireAt).toISOString(),
					order: index,
				};
			});

			const data = { name, order, tasks: tasksInCol };
			dispatch(updateData(token, TYPES.COLUMN, data, _id));
		} else {
			// * Operation for different column
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

	const toggleAddColumn = () => {
		setIsEditing((prev) => !prev);
	};

	const renderCols = columns.map((col, index) => (
		<Column key={col._id} index={index} boardId={boardId} column={col} />
	));

	const renderAddCol = isEditing ? (
		<AddColumn
			onCancel={toggleAddColumn}
			boardId={boardId}
			next={columns.length}
		/>
	) : (
		<div className={styles.addColBtn} onClick={toggleAddColumn}>
			<AiOutlinePlus />
			<h4>Add Column</h4>
		</div>
	);

	return (
		<div className="d-flex flex-column">
			{boardAdd ? (
				<Input
					type="text"
					name="boardName"
					id="boardId"
					value={boardName}
					onChange={boardNameOnChange}
					onBlur={boardNameOnBlur}
					placeholder="Enter board name"
				/>
			) : (
				<Input
					type="select"
					name="boardSelect"
					id="boardSelect"
					innerRef={selectBoardRef}
					// Useful for swapping boards later
					defaultValue={kanban.name}
					onChange={boardSelectChangeHandler}
				>
					{boards.boards.map((board) => (
						<option value={board._id} key={board._id}>
							{board.name}
						</option>
					))}
				</Input>
			)}
			<Button onClick={boardAdd ? addBoardHandler : toggleBoardAdd}>
				Add Board
			</Button>
			{boardAdd && <Button onClick={toggleBoardAdd}>Cancel</Button>}
			{/* <EditDelete /> */}
			{/* The kanban board itself */}
			<div className="d-flex flex-row">
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
		</div>
	);
}

export default Board;
