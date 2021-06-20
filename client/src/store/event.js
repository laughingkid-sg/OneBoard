import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const eventSlice = createSlice({
	name: 'event',
	initialState,
	reducers: {
		// ! To be handled by POST request - for testing only
		addEvent(state, action) {
			const { start, end, allDay, title } = action.payload;
			const dateStart = new Date(start);
			const dateEnd = new Date(end);
			const id = state.length;
			const newEvent = {
				id,
				title,
				allDay,
				start: dateStart,
				end: dateEnd,
			};
			const newState = [...state];
			newState.push(newEvent);
			return newState;
		},
		updateEvent(state, action) {
			const { event, start, end } = action.payload;
			const dateStart = new Date(start);
			const dateEnd = new Date(end);
			const { id } = event;
			const newEvent = { ...event, start: dateStart, end: dateEnd };
			const newState = state.map((event) =>
				event.id === id ? newEvent : event
			);
			return newState;
		},
		deleteEvent(state, action) {
			const id = action.payload;
			const newState = state.filter((event) => event.id !== id);
			return newState;
		},
		replace(state, action) {
			const replaceState = action.payload.map((event) => {
				const start = new Date(event.start);
				const end = new Date(event.end);
				return { ...event, start, end };
			});
			return replaceState;
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
