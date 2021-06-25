import { createSlice } from '@reduxjs/toolkit';
const initialState = [];

const eventSlice = createSlice({
	name: 'event',
	initialState,
	reducers: {
		addEvent(state, action) {
			state.push(action.payload);
		},
		updateEvent(state, action) {
			console.log('redux updateEvent()');
			// const { event, start, end } = action.payload;
			// const dateStart = new Date(start);
			// const dateEnd = new Date(end);
			// const { id } = event;
			// const newEvent = { ...event, start: dateStart, end: dateEnd };
			// const newState = state.map((event) =>
			// 	event.id === id ? newEvent : event
			// );
			// return newState;
		},
		deleteEvent(state, action) {
			console.log('redux deleteEvent()');
			// const id = action.payload;
			// const newState = state.filter((event) => event.id !== id);
			// return newState;
		},
		replace(state, action) {
			return action.payload;
		},
		store(state) {
			// Uses valueOf to recreate Date instance when retrieved
			const storeEvent = state.map((event) => {
				const start = event.start.valueOf();
				const end = event.start.valueOf();
				return { ...event, start, end };
			});
			localStorage.setItem('event', JSON.stringify(storeEvent));
		},
		clear(state) {
			return initialState;
		},
	},
});

export const eventActions = eventSlice.actions;

export default eventSlice.reducer;
