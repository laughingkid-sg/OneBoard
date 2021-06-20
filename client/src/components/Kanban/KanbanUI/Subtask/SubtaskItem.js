import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FaTrash } from 'react-icons/fa';
import { ListGroupItem, Input } from 'reactstrap';
import { kanbanActions } from '../../../../store/kanban';

const SubtaskItem = (props) => {
	const subtask = props.subtask;
	const subtaskRef = useRef(subtask);
	const [isEdit, setIsEdit] = useState(false);
	const [beforeChange, setBeforeChange] = useState(subtask.title);
	const [isInvalid, setIsInvalid] = useState(null);
	const dispatch = useDispatch();

	const openEditHandler = () => {
		setIsEdit(true);
	};

	const closeEditHandler = () => {
		setIsEdit(false);
	};

	const onBlurHandler = () => {
		const newTitle = subtaskRef.current.value;
		if (newTitle.trim() === '') {
			setIsInvalid(true);
			return;
		}

		if (newTitle === beforeChange) {
			closeEditHandler();
			return;
		}

		// ! POST Request to change
		// dispatch(kanbanActions.updateSubTask());
		// Changes wont reflect for now as subtask is a constant
		setBeforeChange(newTitle);
		setIsInvalid(false);
		closeEditHandler();
	};

	const subtaskTitle = subtask.isDone ? (
		<strike>{subtask.title}</strike>
	) : (
		<span>{subtask.title}</span>
	);

	return (
		<ListGroupItem
			className="d-flex justify-content-between"
			onClick={openEditHandler}
		>
			{/* TODO edit subtask onClick, strikethrough when done */}
			{isEdit ? (
				<Input
					defaultValue={beforeChange}
					onBlur={onBlurHandler}
					innerRef={subtaskRef}
					autoFocus
					invalid={isInvalid}
				/>
			) : (
				subtaskTitle
			)}
			<div>
				<input type="checkbox" /> <FaTrash />
			</div>
		</ListGroupItem>
	);
};

export default SubtaskItem;
