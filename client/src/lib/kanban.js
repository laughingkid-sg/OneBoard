export const LABEL_TYPES = [
	'primary',
	'dark',
	'success',
	'info',
	'warning',
	'danger',
];

function sortData(dataA, dataB) {
	return dataA.order - dataB.order;
}

export function createColumn(column) {
	const { _id, order, name, tasks } = column;
	const newTasks = tasks.sort(sortData).map((task) => createTask(task));
	return { _id, order, name, tasks: newTasks };
}

export function createTask(task) {
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
		label,
	};
}

export function createLabels(labels) {
	if (labels.length === 0)
		return LABEL_TYPES.map((label) => {
			return { type: label, name: '' };
		});

	return LABEL_TYPES.map((labelConst) => {
		const labelFound = labels.find((label) => label.type === labelConst);
		if (!labelFound)
			return {
				type: labelConst,
				name: '',
			};
		const { _id, type, name } = labelFound;
		return { _id, type, name };
	});
}
