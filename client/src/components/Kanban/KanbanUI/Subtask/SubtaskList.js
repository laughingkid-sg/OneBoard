import React from 'react';
import { ListGroup } from 'reactstrap';
import SubtaskItem from './SubtaskItem';

// const TEST_SUBTASK = [{ id: 1, title: 'Test', isDone: false }];

function SubtaskList(props) {
	const { subtasks, taskId } = props;

	if (subtasks.length === 0) return <p>No Subtasks</p>;

	const renderSubtasks = subtasks.map((subtask) => (
		<SubtaskItem subtask={subtask} key={subtask.id} taskId={taskId} />
	));

	return <ListGroup>{renderSubtasks.length > 0 && renderSubtasks}</ListGroup>;
}

export default SubtaskList;
