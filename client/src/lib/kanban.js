function sortData(dataA, dataB) {
	return dataA.order - dataB.order;
}

export function createColumn(column) {
	const { order, name, _id: id, tasks } = column;
	const newTasks = tasks.sort(sortData).map((task) => createTask(task));
	return { id, name, tasks: newTasks, order };
}

export function createTask(task) {
	// TODO what to do with label, expireAt
	const {
		_id: id,
		name,
		description,
		subtask,
		expireAt,
		label,
		order,
	} = task;

	// * Just convert to Date object?
	// console.log(expireAt, typeof expireAt);

	const formatDesc = description || '';
	const formatSubtask = createSubtask(subtask);

	return {
		id,
		name,
		description: formatDesc,
		subtasks: formatSubtask,
		order,
	};
}

export function createSubtask(subtasks) {
	const formatted = subtasks || [];
	return formatted.map((subtask) => {
		const { name, isDone, _id: id } = subtask;
		return { id, isDone, name };
	});
}
