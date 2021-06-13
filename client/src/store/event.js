import { createSlice } from '@reduxjs/toolkit';
import EVENT_CONST from '../components/Calendar/events';

const initialState = EVENT_CONST; // []

const eventSlice = createSlice({
	name: 'event',
	initialState,
	reducers: {
		addEvent(state, action) {
			// ! To be handled by POST request - for testing only
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
	},
});

export const eventActions = eventSlice.actions;

export default eventSlice.reducer;
