import React from 'react';
import { useDispatch } from 'react-redux';
import Button from '../../../UI/Button';
import Modal from '../../../UI/Modal';
import {kanbanActions} from '../../../store/kanban'

function DeleteModal(props) {
	const dispatch = useDispatch();

	const deleteHandler = () => {
		if (props.isCol) {
            dispatch(kanbanActions.deleteColumn({colId:props.columnId}))
			return;
		}
		console.log('Not a column');
	};

    const cancelHandler = () => {
        
    }
    
	return (
		<Modal
			onClose={props.onCancel}
		>
			<h2>Are you sure you want to delete {props.title}?</h2>
			{props.isCol && (
				<p>
					If this column is deleted, all tasks in the column would be
					deleted too!
				</p>
			)}
			<Button onClick={deleteHandler}>
				Delete {props.isCol ? 'Column' : 'Task'}
			</Button>
			<Button onClick={props.onCancel}>
				Go Back
			</Button>
		</Modal>
	);
}

export default DeleteModal;
