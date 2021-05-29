import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import { kanbanActions } from '../../store/kanban';
import styles from './AddColumn.module.css';

const AddColumn = (props) => {
	const columnName = useRef();
	const dispatch = useDispatch();

	const addColumnHandler = () => {
		if (columnName.current.value.trim() === '') {
			props.onCancel();
			return;
		}

		dispatch(
			kanbanActions.addColumn({ columnName: columnName.current.value })
		);
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
