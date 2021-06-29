import { createNote } from '../lib/note';
import { noteActions } from './note';
import {
	deleteRequest,
	getRequest,
	postRequest,
	putRequest,
} from '../lib/fetch';

const URL_HEADER = 'api/note';

function formatId(id) {
	return `${URL_HEADER}/${id}`;
}

// May need to inspect further
export const fetchAllNotes = (token) => {
	return async (dispatch) => {
		try {
			const responseData = await getRequest(token, URL_HEADER);
			const notes = responseData.map((note) => createNote(note));
			dispatch(noteActions.replace(notes));
		} catch (error) {}
	};
};

export const addNote = (token, dataReq) => {
	return async (dispatch) => {
		try {
			const responseData = await postRequest(token, URL_HEADER, dataReq);
			const note = createNote(responseData.note);
			dispatch(noteActions.addNote(note));
		} catch (error) {}
	};
};

export const deleteNote = (token, id) => {
	return async (dispatch) => {
		// const postData = async () => {
		// 	const response = await fetch(`${URL_HEADER}/${id}`, {
		// 		method: 'DELETE',
		// 		headers: {
		// 			Authorization: `Bearer ${token}`,
		// 			'Content-Type': 'application/json',
		// 		},
		// 	});

		// 	if (!response.ok) {
		// 		throw new Error('Cannot delete note!');
		// 	}

		// 	const data = await response.json();

		// 	return data;
		// };

		try {
			// const responseData = await postData();
			// if (responseData.status) dispatch(noteActions.deleteNote(id));
			deleteRequest(token, formatId(id));
			dispatch(noteActions.deleteNote(id));
		} catch (error) {}
	};
};

export const updateNote = (token, id, dataReq) => {
	return async (dispatch) => {
		try {
			putRequest(token, formatId(id), dataReq);
			dispatch(noteActions.updateNote(dataReq));
		} catch (error) {}
	};
};
