import React from 'react';
import { ListGroup } from 'reactstrap';
import SubtaskItem from './SubtaskItem';

const TEST_SUBTASK = [{ id: 1, title: 'Test', isDone: false }];

function SubtaskList(props) {
	const { subtasks, taskId } = props.subtasks;

	// TODO To be replaced by props.subtask
	const renderSubtasks = TEST_SUBTASK.map((subtask) => (
		<SubtaskItem subtask={subtask} key={subtask.id} taskId={taskId} />
	));

	if (renderSubtasks.length === 0) return <p>No Subtasks</p>;

	return (
		<ListGroup>
			{/* TODO Probably set the key
			<SubtaskItem subtask={TEST_SUBTASK} id={'1'} /> */}
			{renderSubtasks.length > 0 && renderSubtasks}
		</ListGroup>
	);
}

export default SubtaskList;
