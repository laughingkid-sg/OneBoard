import { kanbanActions } from './kanban';

export const createBoard = (boardName, token) => {
	return async (dispatch) => {
		const postData = async () => {
			const response = await fetch('/api/kanban/', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ name: boardName }),
			});

			if (!response.ok) {
				throw new Error('Could not make new board');
			}

			const data = await response.json();

			return data;
		};

		try {
			await postData();
		} catch (error) {}
	};
};

export const fetchBoardData = (boardId, token) => {
	return async (dispatch) => {
		const fetchData = async () => {
			const response = await fetch(`/api/${boardId}/columns`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				throw new Error('Could not fetch user data');
			}

			const data = await response.json();

			return data;
		};

		try {
			const columnData = await fetchData();
			const columnOrder = [];
			const colObj = {};
			const taskObj = {};
			columnData.map(async (column) => {
				const { name: title, tasks: taskIds } = column;
				const colId = column._id.toString();
				columnOrder.push(colId);
				colObj[colId] = {
					id: colId,
					title,
					taskIds,
				};
			});

			// May convert this to a forEach
			for (const i in columnOrder) {
				const tasks = await dispatch(
					fetchTaskData(boardId, columnOrder[i], token)
				);
				tasks.map(
					(task) =>
						(taskObj[task._id] = {
							id: task._id,
							taskName: task.name,
							description: task.description || '',
						})
				);
			}

			dispatch(
				kanbanActions.replaceBoard({
					tasks: taskObj,
					columns: colObj,
					columnOrder,
				})
			);
		} catch (error) {}
	};
};

export const fetchTaskData = (boardId, columnId, token) => {
	return async () => {
		const fetchData = async () => {
			const response = await fetch(
				`/api/kanban/${boardId}/${columnId}/tasks`,
				{
					method: 'GET',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				}
			);

			if (!response.ok) {
				throw new Error('Could not fetch task data');
			}

			const data = await response.json();

			return data;
		};

		const tasks = await fetchData();
		return tasks;
	};
};

export const updateColumn = (boardId, columnId, newName, token) => {
	return async (dispatch) => {
		const postData = async () => {
			const response = await fetch(`/api/kanban/${boardId}/${columnId}`, {
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ name: newName }),
			});

			if (!response.ok) {
				throw new Error('Could not change column name');
			}

			const data = await response.json();

			return data;
		};

		try {
			await postData();
			dispatch(
				kanbanActions.editColumn({
					colId: columnId,
					columnName: newName,
				})
			);
			// dispatch(fetchBoardData(boardId, token));
		} catch (error) {}
	};
};

export const updateTask = (boardId, columnId, taskId, task, token) => {
	return async (dispatch) => {
		const postData = async () => {
			const response = await fetch(
				`/api/kanban/${boardId}/${columnId}/${taskId}`,
				{
					method: 'PUT',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(task),
				}
			);

			if (!response.ok) {
				throw new Error('Could not change update task');
			}

			const data = await response.json();

			return data;
		};

		try {
			await postData();
			const newTask = {
				id: taskId,
				taskName: task.name,
				description: task.description,
			};
			dispatch(kanbanActions.editTask(newTask));
		} catch (error) {}
	};
};

// NOT WORKING
export const updateColOrder = (boardId, newColumnOrder, token) => {
	return async (dispatch) => {
		const postData = async () => {
			console.log(boardId, newColumnOrder);
			const response = await fetch(
				`/api/kanban/column/order/${boardId}`,
				{
					method: 'PUT',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ columns: newColumnOrder }),
				}
			);

			if (!response.ok) {
				throw new Error('Could not change column order');
			}

			const data = await response.json();

			return data;
		};

		try {
			await postData();
		} catch (error) {}
	};
};

export const addData = (boardId, token, title, columnId = '') => {
	return async (dispatch) => {
		let url = `api/kanban/${boardId}`;
		const options = {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ name: title }),
		};

		if (columnId) {
			url += `/${columnId}`;
		}

		const postData = async () => {
			const response = await fetch(url, options);
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message);
			}
			return data;
		};

		try {
			await postData();
			dispatch(fetchBoardData(boardId, token));
		} catch (error) {}
	};
};

// NOT WORKING
export const deleteData = (boardId, ids, isCol, token) => {
	return async (dispatch) => {
		const postData = async () => {
			let url = `/api/kanban/${boardId}/${ids.columnId}/`;
			if (!isCol) {
				console.log(ids.taskId);
				url += ids.taskId;
				console.log(url);
			}

			const response = await fetch(url, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error(
					`Could not delete ${isCol ? 'Column' : 'Task'}`
				);
			}

			const data = await response.json();

			return data;
		};

		try {
			await postData();
			dispatch(fetchBoardData(boardId, token));
		} catch (error) {}
	};
};
