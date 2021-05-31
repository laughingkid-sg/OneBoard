import { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import { kanbanActions } from '../../store/kanban';
import styles from './AddColumn.module.css';
import { addColumn } from '../../store/kanban-actions';

const AddColumn = (props) => {
	const columnName = useRef();
	const dispatch = useDispatch();
	const token = useSelector((state) => state.user.token);

	const addColumnHandler = () => {
		if (columnName.current.value.trim() === '') {
			props.onCancel();
			return;
		}

		const colName = columnName.current.value;

		dispatch(addColumn(props.boardId, colName, token));
		props.onCancel();
	};

	const cancelHandler = () => {
		if (columnName.current.value.trim() === '') {
			props.onCancel();
		}
		return;
	};

	return (
		<div className={styles.addCol}>
			<input
				autoFocus
				placeholder="Enter Column here"
				ref={columnName}
				onBlur={cancelHandler}
			/>
			<div className={styles.btnRow}>
				<button onClick={addColumnHandler} className={styles.confirm}>
					Add Column
				</button>
				<AiOutlineClose
					onClick={props.onCancel}
					className={styles.cancel}
				/>
			</div>
		</div>
	);
};

export default AddColumn;
