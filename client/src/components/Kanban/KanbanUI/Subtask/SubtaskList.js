import React from 'react';
import { ListGroup } from 'reactstrap';
import SubtaskItem from './SubtaskItem';

const TEST_SUBTASK = { id: 1, title: 'Test', isDone: false };

function SubtaskList(props) {
	const subtasks = props.subtasks;
	return (
		<ListGroup>
			{/* TODO Probably set the key */}
			<SubtaskItem subtask={TEST_SUBTASK} id={'1'} />
		</ListGroup>
	);
}

export default SubtaskList;
