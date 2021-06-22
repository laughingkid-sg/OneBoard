import React, { useContext, useRef, useState } from 'react';
import { Button, Input } from 'reactstrap';
import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux';
import EditDelete from '../KanbanUI/EditDelete';
import useInput from '../../hooks/use-input';
import { userActions } from '../../../store/user';
import { addData, getBoard, TYPES } from '../../../store/kanban-actions';
import ModalContext from '../../../store/ModalContext';
import DeleteModal from '../KanbanUI/DeleteModal';

function AddBoard(props) {
	const { name } = props;
	const [cookies] = useCookies(['t']);
	const { t: token } = cookies;
	const boards = useSelector((state) => state.user.boards);
	const selectBoardRef = useRef();
	const [boardAdd, setBoardAdd] = useState(false);
	const modalContext = useContext(ModalContext);
	const dispatch = useDispatch();

	const {
		value: boardName,
		isValid: boardNameIsValid,
		// hasError: boardNameHasError,
		onChange: boardNameOnChange,
		onBlur: boardNameOnBlur,
		reset: boardNameReset,
	} = useInput((value) => value.trim() !== '', '');

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
		dispatch(userActions.setSelectedBoard(newBoardId));
	};

	const deleteBoardHandler = () => {
		modalContext.showModal(
			<DeleteModal
				type={TYPES.BOARD}
				id={boards.selectedBoard._id}
				index={selectBoardRef.current.selectedIndex}
			/>
		);
	};

	return (
		<div className="d-flex flex-row">
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
					defaultValue={boards.selectedBoard.name}
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
			<EditDelete
				onEdit={() => {
					alert('Edit Board');
				}}
				onDelete={deleteBoardHandler}
			/>
		</div>
	);
}

export default AddBoard;
