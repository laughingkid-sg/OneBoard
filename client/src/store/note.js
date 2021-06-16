import { createSlice } from '@reduxjs/toolkit';

const initialState = { notes: {}, keys: [], isEmpty: true };

const noteSlice = createSlice({
	name: 'note',
	initialState,
	reducers: {
		// ! Simple add operation to be superseded by API
		addNote(state, action) {
			const newId = `${Object.keys(state.notes).length + 1}`;
			const newNote = { ...action.payload, id: newId };
			const newState = {
				notes: { ...state.notes, [newId]: newNote },
				keys: [...state.keys, newId],
				isEmpty: false,
			};
			return newState;
		},
		// Used to replace state retrieved from API
		replaceNotes(state, action) {
			console.log('Replace Notes called');
			console.log(action.payload);
			return action.payload;
		},
		updateNotes(state, action) {
			console.log('Update Notes called');
			const { isTitle, newData, noteId } = action.payload;
			const newNote = state.notes[noteId];
			if (isTitle) {
				newNote.title = newData;
			} else {
				newNote.description = newData;
			}

			state.notes = { ...state.notes, [noteId]: newNote };
		},
		deleteNote(state, action) {
			delete state.notes[action.payload];
			const newKeys = state.keys.filter((id) => id !== action.payload);
			const isEmpty = newKeys.length === 0;
			state.keys = newKeys;
			state.isEmpty = isEmpty;
		},
		clear(state) {
			return initialState;
		},
		store(state) {
			localStorage.setItem('notes', JSON.stringify(state));
		},
	},
});

export const noteActions = noteSlice.actions;

export default noteSlice.reducer;
