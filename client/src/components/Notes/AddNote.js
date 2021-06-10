import React from 'react';
import { Form, Label, Input, Button } from 'reactstrap';

function AddNote(props) {
	const addHandler = () => {
		console.log('Adding new Note');
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
				/>
				<Label for="description">Description</Label>
				<Input
					type="textarea"
					id="description"
					name="description"
					placeholder="Enter description.."
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
