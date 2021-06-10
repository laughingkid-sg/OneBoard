import { configureStore } from '@reduxjs/toolkit';
import kanbanReducer from './kanban';
import userReducer from './user';
import noteReducer from './note';

const store = configureStore({
	reducer: {
		kanban: kanbanReducer,
		note: noteReducer,
		user: userReducer,
	},
});

export default store;
