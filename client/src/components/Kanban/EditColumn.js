import React, { useContext, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaTrash } from 'react-icons/fa';
import DeleteModal from './KanbanUI/DeleteModal';
import { kanbanActions } from '../../store/kanban';
import styles from './EditColumn.module.css';
import { updateColumn } from '../../store/kanban-actions';
import ModalContext from '../../store/ModalContext';

function EditColumn(props) {
	const title = useRef();
	const modalContext = useContext(ModalContext);
	const [editTitle, setIsEditTitle] = useState(props.title);
	const token = useSelector((state) => state.user.token);
	const dispatch = useDispatch();

	const updateColumnHandler = () => {
		const updatedTitle = title.current.value.trim();
		if (editTitle.previous === title.current.value || updatedTitle === '') {
			props.onCancel();
			return;
		}
		dispatch(
			updateColumn(props.boardId, props.columnId, updatedTitle, token)
		);
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
		modalContext.showModal(
			<DeleteModal
				isCol={true}
				title={props.title}
				boardId={props.boardId}
				columnId={props.columnId}
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
