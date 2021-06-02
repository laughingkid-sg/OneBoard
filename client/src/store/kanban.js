import { createSlice } from '@reduxjs/toolkit';

// const initKanbanState = {
// 	tasks: {
// 		'task-1': {
// 			id: 'task-1',
// 			taskName: 'Take out the garbage',
// 			description: '',
// 		},
// 		'task-2': {
// 			id: 'task-2',
// 			taskName: 'Watch my favorite show',
// 			description: 'My favorite show is Attack on Titan',
// 		},
// 		'task-3': {
// 			id: 'task-3',
// 			taskName: 'Charge my phone',
// 			description: '',
// 		},
// 		'task-4': {
// 			id: 'task-4',
// 			taskName: 'Cook dinner',
// 			description: 'Find recipes for pizza',
// 		},
// 	},
// 	columns: {
// 		'column-1': {
// 			id: 'column-1',
// 			title: 'To do',
// 			taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
// 		},
// 		'column-2': {
// 			id: 'column-2',
// 			title: 'In progress',
// 			taskIds: [],
// 		},
// 		'column-3': {
// 			id: 'column-3',
// 			title: 'Done',
// 			taskIds: [],
// 		},
// 	},
// 	// Facilitate reordering of the columns
// 	columnOrder: ['column-1', 'column-2', 'column-3'],
// };

const initState = {
	tasks: {},
	columns: {},
	columnOrder: [],
};

const kanbanSlice = createSlice({
	name: 'kanban',
	// initialState: initKanbanState,
	initialState: initState,
	reducers: {
		replaceBoard(state, action) {
			state.tasks = action.payload.tasks;
			state.columns = action.payload.columns;
			state.columnOrder = action.payload.columnOrder;
		},
		resetBoard(state) {
			return initState;
		},
	},
});

export const kanbanActions = kanbanSlice.actions;

export default kanbanSlice.reducer;
