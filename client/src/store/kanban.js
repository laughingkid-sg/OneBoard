import { createSlice } from '@reduxjs/toolkit';

const initState = {
	tasks: {},
	columns: {},
	columnOrder: [],
	labels: {
		primary: '',
		secondary: '',
		success: '',
		info: '',
		warning: '',
		danger: '',
	},
};

const kanbanSlice = createSlice({
	name: 'kanban',
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
		editTask(state, action) {
			const taskId = action.payload.id;
			state.tasks = { ...state.tasks, [taskId]: { ...action.payload } };
		},
		editColumn(state, action) {
			const { colId, columnName } = action.payload;

			const newColumn = { ...state.columns[colId] };
			newColumn.title = columnName;
			state.columns = { ...state.columns, [colId]: newColumn };
		},
	},
});

export const kanbanActions = kanbanSlice.actions;

export default kanbanSlice.reducer;
