import { useRef } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import styles from './AddTask.module.css';
import { TYPES, addData } from '../../../store/kanban-actions';

const AddTask = (props) => {
	const { next: order, columnId, onCancel } = props;
	const dispatch = useDispatch();
	const taskName = useRef();
	const [cookies] = useCookies(['t']);
	const token = cookies.t;

	const addTaskHandler = () => {
		if (taskName.current.value.trim() === '') {
			onCancel();
			return;
		}

		const name = taskName.current.value.trim();
		const newTask = { name, order };
		dispatch(addData(token, TYPES.TASK, newTask, columnId));
		onCancel();
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
				<AiOutlineClose onClick={onCancel} className={styles.cancel} />
			</div>
		</div>
	);
};

export default AddTask;
