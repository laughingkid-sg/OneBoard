import { kanbanActions } from './kanban';
import { userActions } from './user';
import { createColumn, createLabels } from '../lib/kanban';
import {
	deleteRequest,
	getRequest,
	postRequest,
	putRequest,
} from '../lib/fetch';

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

// * BOARD
export const fetchAllBoards = (token) => {
	return async (dispatch) => {
		try {
			const boardsData = await getRequest(token, `${URL_HEADER}/boards`);
			let boards = {};
			boardsData.forEach((board) => {
				const { name, labels, columns, _id: id } = board;
				const newColumns = columns
					.sort(sortData)
					.map((col) => createColumn(col));
				const formatLabels = createLabels(labels);
				boards[id] = {
					id,
					name,
					labels: formatLabels,
					columns: newColumns,
				};
			});

			const boardKeys = Object.keys(boards);
			const boardKey = boardKeys[0];

			let boardArr = [];
			boardKeys.forEach((key) =>
				boardArr.push({ _id: key, name: boards[key].name })
			);

			dispatch(
				userActions.setBoards({
					boards: boardArr,
					selectedBoard: boardArr[0],
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

export const getBoard = (token, boardId) => {
	return async (dispatch) => {
		try {
			const board = await getRequest(
				token,
				determineURL(TYPES.BOARD, boardId)
			);
			const { name, labels, columns, _id: id } = board;
			const newColumns = columns
				.sort(sortData)
				.map((col) => createColumn(col));

			const formatLabels = createLabels(labels);
			const newBoard = {
				id,
				name,
				labels: formatLabels,
				columns: newColumns,
			};
			dispatch(kanbanActions.replace(newBoard));
			localStorage.setItem('currentBoard', JSON.stringify(newBoard));
		} catch (error) {
			console.warn(error.message);
		}
	};
};

// Used for updating column information
export const updateLabels = (token, dataReq, id) => {
	return async (dispatch) => {
		try {
			const res = await putRequest(
				token,
				determineURL(TYPES.BOARD, id),
				dataReq
			);
			const { labels, name } = res.board;
			const formatLabels = createLabels(labels);
			dispatch(
				kanbanActions.updateLabels({ name, labels: formatLabels })
			);
		} catch (error) {}
	};
};

// * See try blocks for all
export const addData = (token, type, dataReq, id = '') => {
	return async (dispatch) => {
		try {
			const response = await postRequest(
				token,
				determineURL(type, id),
				dataReq
			);
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
					const { _id, name } = response;
					dispatch(userActions.addBoard({ _id, name }));
					break;
			}
		} catch (error) {}
	};
};

export const deleteData = (token, type, id) => {
	return async (dispatch) => {
		// const url = determineURL(type, id);
		// const postData = async () => {
		// 	const response = await fetch(url, {
		// 		method: 'DELETE',
		// 		headers: {
		// 			Authorization: `Bearer ${token}`,
		// 		},
		// 	});

		// 	if (!response.ok) {
		// 		throw new Error(`Could not delete ${type}`);
		// 	}

		// 	const data = await response.json();

		// 	return data;
		// };

		try {
			deleteRequest(token, determineURL(type, id));
			switch (type) {
				case TYPES.TASK:
					dispatch(kanbanActions.deleteTask(id));
					break;
				case TYPES.COLUMN:
					dispatch(kanbanActions.deleteColumn(id));
					break;
				default:
					dispatch(userActions.deleteBoard(id));
					break;
			}
		} catch (error) {}
	};
};

export const updateData = (token, type, dataReq, id) => {
	return async (dispatch) => {
		try {
			const data = await putRequest(
				token,
				determineURL(type, id),
				dataReq
			);
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
					// Used for updating column order
					dispatch(kanbanActions.updateBoard(dataReq));
					break;
			}
		} catch (error) {}
	};
};
