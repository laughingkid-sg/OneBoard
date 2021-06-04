import { useRef } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import styles from './AddTask.module.css';
import { addData } from '../../store/kanban-actions';

const AddTask = (props) => {
	const dispatch = useDispatch();
	const taskName = useRef();
	const [cookies] = useCookies(['t']);
	const token = cookies.t;

	const addTaskHandler = () => {
		if (taskName.current.value.trim() === '') {
			props.onCancel();
			return;
		}
		const title = taskName.current.value.trim();
		dispatch(addData(props.boardId, token, title, props.columnId));
		props.onCancel();
	};

	const cancelHandler = () => {
		if (taskName.current.value.trim() === '') {
			props.onCancel();
		}
		return;
	};

	return (
		<div className={styles.addTask}>
			<textarea
				autoFocus
				placeholder="Enter Task here"
				ref={taskName}
				className={styles.text}
				onBlur={cancelHandler}
			/>
			<div>
				<button onClick={addTaskHandler} className={styles.confirm}>
					Add Task
				</button>
				<AiOutlineClose
					onClick={props.onCancel}
					className={styles.cancel}
				/>
			</div>
		</div>
	);
};

export default AddTask;
