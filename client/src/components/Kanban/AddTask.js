import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import { kanbanActions } from '../../store/kanban';

const AddTask = (props) => {
	const dispatch = useDispatch();
	const taskName = useRef();

	const addTaskHandler = () => {
		if (taskName.current.value.trim() === '') {
			props.onCancel();
			return;
		}
		dispatch(
			kanbanActions.addTask({
				taskName: taskName.current.value,
				columnId: props.columnId,
			})
		);
		props.cancelEdit();
	};

	return (
		<div
			style={{
				margin: '8px',
				width: '90%',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<textarea
				placeholder="Enter Task here"
				ref={taskName}
				style={{ resize: 'none' }}
			/>
			<div>
				<button onClick={addTaskHandler}>Add Task</button>
				<AiOutlineClose
					onClick={props.cancelEdit}
					style={{ cursor: 'pointer' }}
				/>
			</div>
		</div>
	);
};

export default AddTask;
