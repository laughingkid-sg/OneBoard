function sortData(dataA, dataB) {
	return dataA.order - dataB.order;
}

export function createColumn(column) {
	const { _id, order, name, tasks } = column;
	const newTasks = tasks.sort(sortData).map((task) => createTask(task));
	return { _id, order, name, tasks: newTasks };
}

export function createTask(task) {
	// TODO what to do with label, expireAt
	const { _id, name, description, subTask, expireAt, label, order } = task;

	const formatDesc = description || '';
	const formatSubtask = subTask || [];
	const formatExpireAt = expireAt ? new Date(expireAt).valueOf() : '';

	return {
		_id,
		name,
		order,
		description: formatDesc,
		subTask: formatSubtask,
		expireAt: formatExpireAt,
	};
}

export function createSubtask(subtasks) {
	const formatted = subtasks || [];
	return formatted.map((subtask) => {
		const { name, isDone, _id: id } = subtask;
		return { id, isDone, name };
	});
}
