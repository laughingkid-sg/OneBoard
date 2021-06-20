import { kanbanActions } from './kanban';
import { userActions } from './user';
import { createTask } from '../lib/kanban';

// If none its board
export const TYPES = {
	TASK: 'TASK',
	COLUMN: 'COLUMN',
};

const URL_HEADER = 'api/kanban';

function sortData(dataA, dataB) {
	return dataA.order - dataB.order;
}

function determineURL(type, id) {
	let ending;
	switch (type) {
		case TYPES.TASK:
			ending = `/task/${id}`;
			break;
		case TYPES.COLUMN:
			ending = `/column/${id}`;
			break;
		default:
			ending = `/${id}`;
			break;
	}
	return URL_HEADER + ending;
}

// TODO To be revamped
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
					const newTasks = tasks
						.sort(sortData)
						.map((task) => createTask(task));
					return { id, name, tasks: newTasks, order };
				});

				boards[id] = { id, name, labels, columns: newColumns };
			});
			localStorage.setItem('boards', JSON.stringify(boards));

			const boardKeys = Object.keys(boards);
			const boardKey = boardKeys[0];

			let boardDict = {};
			boardKeys.forEach((key) => (boardDict[key] = boards[key].name));

			dispatch(
				userActions.setBoards({
					boards: boardDict,
					selectedBoard: boardKey,
				})
			);
			const boardToLoad = boards[boardKey];
			dispatch(kanbanActions.replace(boardToLoad));
			localStorage.setItem('currentBoard', JSON.stringify(boardToLoad));
		} catch (error) {}
	};
};

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

export const updateTask = (token, taskId, task) => {
	return async (dispatch) => {
		const putData = async () => {
			const response = await fetch(`${URL_HEADER}/task/${taskId}`, {
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(task),
			});

			if (!response.ok) {
				throw new Error('Could not change update task');
			}

			const data = await response.json();

			return data;
		};

		try {
			const newTask = await putData();
			dispatch(kanbanActions.updateTask(newTask.task));
		} catch (error) {
			alert(error.message);
		}
	};
};

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

// * See try block
export const addData = (token, type, data, id = '') => {
	return async (dispatch) => {
		const url = determineURL(type, id);
		const options = {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		};

		const postData = async () => {
			const response = await fetch(url, options);
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message);
			}
			return data;
		};

		try {
			const response = await postData();
			switch (type) {
				case TYPES.TASK:
					dispatch(
						kanbanActions.addTask({ task: response.task, id })
					);
					break;
				case TYPES.COLUMN:
					dispatch(kanbanActions.addColumn(response.data));
				default:
					// ! Special things need to be done for add Board
					break;
			}
		} catch (error) {}
	};
};

export const deleteData = (token, type, id) => {
	return async (dispatch) => {
		const url = determineURL(type, id);
		const postData = async () => {
			const response = await fetch(url, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error(`Could not delete ${type}`);
			}

			const data = await response.json();

			return data;
		};

		try {
			await postData();
			switch (type) {
				case TYPES.TASK:
					dispatch(kanbanActions.deleteTask(id));
					break;
				case TYPES.COLUMN:
					break;
				default:
					break;
			}
		} catch (error) {}
	};
};
