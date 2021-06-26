import { createNote } from '../lib/note';
import { noteActions } from './note';

const URL_HEADER = 'api/note';

// May need to inspect further
export const fetchAllNotes = (token) => {
	return async (dispatch) => {
		const fetchData = async () => {
			const response = await fetch(URL_HEADER, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error('Cannot retrieve notes!');
			}

			const data = await response.json();

			return data;
		};

		try {
			const responseData = await fetchData();
			const notes = responseData.map((note) => createNote(note));
			dispatch(noteActions.replace(notes));
		} catch (error) {}
	};
};

export const addNote = (token, dataReq) => {
	return async (dispatch) => {
		const postData = async () => {
			const response = await fetch(URL_HEADER, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(dataReq),
			});

			if (!response.ok) {
				throw new Error('Cannot send note!');
			}

			const data = await response.json();

			return data;
		};

		try {
			const responseData = await postData();
			const note = createNote(responseData.note);
			dispatch(noteActions.addNote(note));
		} catch (error) {}
	};
};

export const deleteNote = (token, id) => {
	return async (dispatch) => {
		const postData = async () => {
			const response = await fetch(`${URL_HEADER}/${id}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				throw new Error('Cannot delete note!');
			}

			const data = await response.json();

			return data;
		};

		try {
			const responseData = await postData();
			if (responseData.status) dispatch(noteActions.deleteNote(id));
		} catch (error) {}
	};
};

export const updateNote = (token, id, dataReq) => {
	return async (dispatch) => {
		const postData = async () => {
			const response = await fetch(`${URL_HEADER}/${id}`, {
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(dataReq),
			});

			if (!response.ok) {
				throw new Error('Cannot update note!');
			}

			const data = await response.json();

			return data;
		};

		try {
			postData();
			dispatch(noteActions.updateNote(dataReq));
		} catch (error) {}
	};
};
