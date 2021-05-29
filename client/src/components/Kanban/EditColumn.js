import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FaTrash } from 'react-icons/fa';
import DeleteModal from './KanbanUI/DeleteModal';
import { kanbanActions } from '../../store/kanban';
import styles from './EditColumn.module.css';

function EditColumn(props) {
	const title = useRef();
	const [editTitle, setIsEditTitle] = useState(props.title);
	const dispatch = useDispatch();

	const updateColumnHandler = () => {
		const updatedTitle = title.current.value.trim();
		if (editTitle.previous === title.current.value || updatedTitle === '') {
			props.onCancel();
			return;
		}
		dispatch(
			kanbanActions.editColumn({
				colId: props.columnId,
				columnName: updatedTitle,
			})
		);
		setIsEditTitle(updatedTitle);
		props.onCancel();
	};

	const deleteColumnHandler = () => {
		props.onDelete(
			<DeleteModal
				isCol={true}
				title={props.title}
				columnId={props.columnId}
				onCancel={props.onModalCancel}
			/>
		);
	};

	return (
		<div className={styles.editTitle}>
			<input
				autoFocus
				ref={title}
				placeholder={props.title}
				onBlur={updateColumnHandler}
			/>
			<FaTrash
				onClick={deleteColumnHandler}
				className={styles.editIcon}
			/>
		</div>
	);
}

export default EditColumn;
