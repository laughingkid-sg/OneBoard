import { kanbanActions } from './kanban';

const URL_HEADER = 'api/kanban';

const sortData = (dataA, dataB) => dataA.order - dataB.order;

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

export const fetchAllBoards = (token) => {
	return async (dispatch) => {
		const fetchData = async () => {
			const response = await fetch(`${URL_HEADER}/boards`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error('Could not retrieve boards!');
			}

			const data = await response.json();

			return data;
		};

		try {
			const boardsData = await fetchData();
			let boards = {};
			boardsData.forEach((board) => {
				const { name, labels, columns, _id: id } = board;
				const newColumns = columns.sort(sortData).map((col) => {
					const { order, name, _id: id, tasks } = col;
					const newTasks = tasks.sort(sortData).map((task) => {
						// TODO what to do with label, expireAt
						const {
							name,
							description,
							subtask,
							_id: id,
							expireAt,
							label,
						} = task;

						// * Just convert to Date object?
						console.log(expireAt, typeof expireAt);

						const formatDesc = description || '';
						const formatSubtask = subtask || [];
						return {
							id,
							name,
							description: formatDesc,
							subtask: formatSubtask,
						};
					});

					return { id, name, tasks: newTasks, order };
				});

				boards[id] = { id, name, labels, columns: newColumns };
			});
			console.log(boards);
			localStorage.setItem('boards', JSON.stringify(boards));
			const boardKey = Object.keys(boards)[0];
			const boardToLoad = boards[boardKey];
			dispatch(kanbanActions.replace(boardToLoad));
			localStorage.setItem('currentBoard', JSON.stringify(boardToLoad));
		} catch (error) {}
	};
};

// export const fetchBoardData = (boardId, token) => {
// 	return async (dispatch) => {
// 		const fetchData = async () => {
// 			const response = await fetch(`/api/${boardId}/columns`, {
// 				method: 'GET',
// 				headers: {
// 					Authorization: `Bearer ${token}`,
// 					'Content-Type': 'application/json',
// 				},
// 			});

// 			if (!response.ok) {
// 				throw new Error('Could not fetch user data');
// 			}

// 			const data = await response.json();

// 			return data;
// 		};

// 		try {
// 			const columnData = await fetchData();
// 			// const columnOrder = [];
// 			// const colObj = {};
// 			// const taskObj = {};
// 			// columnData.map(async (column) => {
// 			// 	const { name: title, tasks: taskIds } = column;
// 			// 	const colId = column._id.toString();
// 			// 	columnOrder.push(colId);
// 			// 	colObj[colId] = {
// 			// 		id: colId,
// 			// 		title,
// 			// 		taskIds,
// 			// 	};
// 			// });

// 			// // May convert this to a forEach
// 			// for (const i in columnOrder) {
// 			// 	const tasks = await dispatch(
// 			// 		fetchTaskData(boardId, columnOrder[i], token)
// 			// 	);
// 			// 	tasks.map(
// 			// 		(task) =>
// 			// 			(taskObj[task._id] = {
// 			// 				id: task._id,
// 			// 				taskName: task.name,
// 			// 				description: task.description || '',
// 			// 			})
// 			// 	);
// 			// }

// 			const boardInfo = { tasks: taskObj, columns: colObj, columnOrder };
// 			localStorage.setItem('currentBoard', JSON.stringify(boardInfo));
// 			dispatch(kanbanActions.replace(boardInfo));
// 		} catch (error) {}
// 	};
// };

// export const fetchTaskData = (boardId, columnId, token) => {
// 	return async () => {
// 		const fetchData = async () => {
// 			const response = await fetch(
// 				`/api/kanban/${boardId}/${columnId}/tasks`,
// 				{
// 					method: 'GET',
// 					headers: {
// 						Authorization: `Bearer ${token}`,
// 						'Content-Type': 'application/json',
// 					},
// 				}
// 			);

// 			if (!response.ok) {
// 				throw new Error('Could not fetch task data');
// 			}

// 			const data = await response.json();

// 			return data;
// 		};

// 		const tasks = await fetchData();
// 		return tasks;
// 	};
// };

// export const updateColumn = (boardId, columnId, newName, token) => {
// 	return async (dispatch) => {
// 		const postData = async () => {
// 			const response = await fetch(`/api/kanban/${boardId}/${columnId}`, {
// 				method: 'PUT',
// 				headers: {
// 					Authorization: `Bearer ${token}`,
// 					'Content-Type': 'application/json',
// 				},
// 				body: JSON.stringify({ name: newName }),
// 			});

// 			if (!response.ok) {
// 				throw new Error('Could not change column name');
// 			}

// 			const data = await response.json();

// 			return data;
// 		};

// 		try {
// 			await postData();
// 			dispatch(
// 				kanbanActions.editColumn({
// 					colId: columnId,
// 					columnName: newName,
// 				})
// 			);
// 			// dispatch(fetchBoardData(boardId, token));
// 		} catch (error) {}
// 	};
// };

// export const updateTask = (boardId, columnId, taskId, task, token) => {
// 	return async (dispatch) => {
// 		const postData = async () => {
// 			const response = await fetch(
// 				`/api/kanban/${boardId}/${columnId}/${taskId}`,
// 				{
// 					method: 'PUT',
// 					headers: {
// 						Authorization: `Bearer ${token}`,
// 						'Content-Type': 'application/json',
// 					},
// 					body: JSON.stringify(task),
// 				}
// 			);

// 			if (!response.ok) {
// 				throw new Error('Could not change update task');
// 			}

// 			const data = await response.json();

// 			return data;
// 		};

// 		try {
// 			await postData();
// 			const newTask = {
// 				id: taskId,
// 				taskName: task.name,
// 				description: task.description,
// 			};
// 			dispatch(kanbanActions.editTask(newTask));
// 		} catch (error) {}
// 	};
// };

// // NOT WORKING
// export const updateColOrder = (boardId, newColumnOrder, token) => {
// 	return async (dispatch) => {
// 		const postData = async () => {
// 			console.log(boardId, newColumnOrder);
// 			const response = await fetch(
// 				`/api/kanban/column/order/${boardId}`,
// 				{
// 					method: 'PUT',
// 					headers: {
// 						Authorization: `Bearer ${token}`,
// 						'Content-Type': 'application/json',
// 					},
// 					body: JSON.stringify({ columns: newColumnOrder }),
// 				}
// 			);

// 			if (!response.ok) {
// 				throw new Error('Could not change column order');
// 			}

// 			const data = await response.json();

// 			return data;
// 		};

// 		try {
// 			await postData();
// 		} catch (error) {}
// 	};
// };

// export const addData = (boardId, token, title, columnId = '') => {
// 	return async (dispatch) => {
// 		let url = `api/kanban/${boardId}`;
// 		const options = {
// 			method: 'POST',
// 			headers: {
// 				Authorization: `Bearer ${token}`,
// 				'Content-Type': 'application/json',
// 			},
// 			body: JSON.stringify({ name: title }),
// 		};

// 		if (columnId) {
// 			url += `/${columnId}`;
// 		}

// 		const postData = async () => {
// 			const response = await fetch(url, options);
// 			const data = await response.json();

// 			if (!response.ok) {
// 				throw new Error(data.message);
// 			}
// 			return data;
// 		};

// 		try {
// 			await postData();
// 			dispatch(fetchBoardData(boardId, token));
// 		} catch (error) {}
// 	};
// };

// // NOT WORKING
// export const deleteData = (boardId, ids, isCol, token) => {
// 	return async (dispatch) => {
// 		const postData = async () => {
// 			let url = `/api/kanban/${boardId}/${ids.columnId}/`;
// 			if (!isCol) {
// 				console.log(ids.taskId);
// 				url += ids.taskId;
// 				console.log(url);
// 			}

// 			const response = await fetch(url, {
// 				method: 'DELETE',
// 				headers: {
// 					Authorization: `Bearer ${token}`,
// 				},
// 			});

// 			if (!response.ok) {
// 				throw new Error(
// 					`Could not delete ${isCol ? 'Column' : 'Task'}`
// 				);
// 			}

// 			const data = await response.json();

// 			return data;
// 		};

// 		try {
// 			await postData();
// 			dispatch(fetchBoardData(boardId, token));
// 		} catch (error) {}
// 	};
// };
