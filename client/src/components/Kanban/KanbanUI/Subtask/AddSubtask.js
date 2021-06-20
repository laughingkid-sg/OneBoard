import React from 'react';
import { useDispatch } from 'react-redux';
import { Button, Input, InputGroup, InputGroupAddon } from 'reactstrap';
// import { kanbanActions } from '../../../../store/kanban';
import useInput from '../../../hooks/use-input';

function AddSubtask(props) {
	const dispatch = useDispatch();

	const {
		value: title,
		isValid: titleIsValid,
		hasError: titleHasError,
		onChange: titleOnChange,
		onBlur: titleOnBlur,
		reset: titleReset,
	} = useInput((value) => value.trim() !== '', '');

	const addSubtaskHandler = () => {
		if (!titleIsValid) return;
		// const subtask = {};
		// dispatch(kanbanActions.addSubtask({ taskId, subtask }));
	};

	return (
		<InputGroup>
			<Input
				placeholder="Add Subtask"
				value={title}
				onChange={titleOnChange}
				onBlur={titleOnBlur}
			/>
			<InputGroupAddon addonType="prepend">
				{/* onClick passed by prop */}
				<Button color="success" onClick={addSubtaskHandler}>
					AddTask
				</Button>
			</InputGroupAddon>
		</InputGroup>
	);
}

export default AddSubtask;
