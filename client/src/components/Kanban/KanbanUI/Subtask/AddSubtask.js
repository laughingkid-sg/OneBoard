import React from 'react';
import { Button, Input, InputGroup, InputGroupAddon } from 'reactstrap';

function AddSubtask(props) {
	return (
		<InputGroup>
			<Input placeholder="Add Subtask" />
			<InputGroupAddon addonType="prepend">
				{/* onClick passed by prop */}
				<Button
					color="success"
					onClick={() => {
						alert('Added subtask');
					}}
				>
					AddTask
				</Button>
			</InputGroupAddon>
		</InputGroup>
	);
}

export default AddSubtask;
