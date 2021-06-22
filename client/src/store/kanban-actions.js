import { kanbanActions } from './kanban';
import { userActions } from './user';
import { createColumn } from '../lib/kanban';

// If none its board
export const TYPES = {
	TASK: 'TASK',
	COLUMN: 'COLUMN',
	BOARD: 'BOARD',
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
// * BOARD
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
				const newColumns = columns
					.sort(sortData)
					.map((col) => createColumn(col));

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
		} catch (error) {
			console.warn(error.message);
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

// * See try blocks for all
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
					break;
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
					dispatch(kanbanActions.deleteColumn(id));
					break;
				default:
					// ! Special things need to be done for add Board
					break;
			}
		} catch (error) {}
	};
};

export const updateData = (token, type, dataReq, id) => {
	return async (dispatch) => {
		const postData = async () => {
			const response = await fetch(determineURL(type, id), {
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(dataReq),
			});

			if (!response.ok) {
				throw new Error(`Could not change ${type.toLowerCase()}`);
			}

			const data = await response.json();

			return data;
		};

		try {
			const data = await postData();
			switch (type) {
				case TYPES.TASK:
					dispatch(kanbanActions.updateTask(data.task));
					break;
				case TYPES.COLUMN:
					dispatch(
						kanbanActions.updateColumn({ column: dataReq, _id: id })
					);
					break;
				default:
					// ! Special things need to be done for update Board
					dispatch(kanbanActions.updateBoard(dataReq));
					break;
			}
		} catch (error) {}
	};
};
