import { useRef } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import styles from './AddColumn.module.css';
import { addData } from '../../store/kanban-actions';

const AddColumn = (props) => {
	const columnName = useRef();
	const dispatch = useDispatch();
	const [cookies] = useCookies(['t']);
	const token = cookies.t;

	const addColumnHandler = () => {
		if (columnName.current.value.trim() === '') {
			props.onCancel();
			return;
		}

		const colName = columnName.current.value.trim();

		dispatch(addData(props.boardId, token, colName));
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
