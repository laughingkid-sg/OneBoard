import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Label, Input, Button } from 'reactstrap';
import useInput from '../hooks/use-input';
import { noteActions } from '../../store/note';

function AddNote(props) {
	const dispatch = useDispatch();
	const {
		value: title,
		isValid: titleIsValid,
		onChange: titleChange,
		onBlur: titleBlur,
	} = useInput((value) => value.trim() !== '', '');
	const descRef = useRef('');

	const addHandler = () => {
		console.log('Adding new Note');
		if (!titleIsValid) return;
		const description = descRef.current.value;

		// ! To be replaced by POST request
		dispatch(noteActions.addNote({ title, description }));
		props.onCancel();
	};

	return (
		<React.Fragment>
			<Form>
				<Label for="title">Title</Label>
				<Input
					type="text"
					id="title"
					name="title"
					placeholder="Enter title.."
					value={title}
					onChange={titleChange}
					onBlur={titleBlur}
				/>
				<Label for="description">Description</Label>
				<Input
					type="textarea"
					id="description"
					name="description"
					placeholder="Enter description.."
					innerRef={descRef}
				/>
				<Button onClick={addHandler} color="success">
					Add
				</Button>
				<Button onClick={props.onCancel}>Cancel</Button>
			</Form>
		</React.Fragment>
	);
}

export default AddNote;
