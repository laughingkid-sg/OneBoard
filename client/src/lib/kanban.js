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
