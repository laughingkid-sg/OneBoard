import { createSlice } from '@reduxjs/toolkit';
import { createColumn, createTask } from '../lib/kanban';

const initState = {
	id: '',
	name: '',
	labels: [],
	columns: [
		{
			id: '',
			name: '',
			order: -1,
			tasks: [
				{
					id: '',
					name: '',
					description: '',
					subtasks: [],
					label: '', // Blanked for now
				},
			],
		},
	],
};

const kanbanSlice = createSlice({
	name: 'kanban',
	initialState: initState,
	reducers: {
		// * Tasks
		addTask(state, action) {
			const { task, id: columnId } = action.payload;
			const newTask = createTask(task);
			const column = state.columns.find((col) => col.id === columnId);
			column.tasks.push(newTask);
		},
		updateTask(state, action) {
			// TODO Add expireAt and label
			const newTask = createTask(action.payload);
			const { id } = newTask;

			const taskInCol = state.columns.find((col) =>
				col.tasks.find((task) => task.id === id)
			);

			const newTasks = taskInCol.tasks.map((task) =>
				task.id === id ? newTask : task
			);

			const newCol = { ...taskInCol, tasks: newTasks };
			state.columns = state.columns.map((col) =>
				col.id === newCol.id ? newCol : col
			);
		},
		deleteTask(state, action) {
			const id = action.payload;
			const column = state.columns.find((col) =>
				col.tasks.find((task) => task.id === id)
			);
			const newTasks = column.tasks.filter((task) => task.id !== id);
			column.tasks = newTasks;
		},
		// * Column
		addColumn(state, action) {
			const column = createColumn(action.payload);
			state.columns = [...state.columns, column];
		},
		deleteColumn(state, action) {
			const id = action.payload;
			state.columns = state.columns.filter((col) => col.id !== id);
		},
		updateColumn(state, action) {
			const column = createColumn(action.payload);
			const { id } = column;
			state.columns = state.columns.map((col) =>
				col.id === id ? column : col
			);
		},
		// ?
		addSubtask(state, action) {
			const { taskId, subtask } = action.payload;
			const task = state.tasks[taskId];
			const { subtasks } = task;
			const newSubtasks = subtasks.push(subtask);
			state.tasks = {
				...state.tasks,
				[taskId]: { ...task, subtasks: newSubtasks },
			};
		},
		// ?
		updateSubTask(state, action) {
			const { taskId, newSubtask } = action.payload;
			const task = state.tasks[taskId];
			const newSubtasks = task.subtask.map((subtask) =>
				subtask.id === newSubtask.id ? newSubtask : subtask
			);
			state.tasks = {
				...state.tasks,
				[taskId]: { ...task, subtasks: newSubtasks },
			};
		},
		// ?
		editColumn(state, action) {
			const { colId, columnName } = action.payload;

			const newColumn = { ...state.columns[colId] };
			newColumn.title = columnName;
			state.columns = { ...state.columns, [colId]: newColumn };
		},
		store(state) {
			localStorage.setItem('currentBoard', JSON.stringify(state));
		},
		replace(state, action) {
			return action.payload;
		},
		clear(state) {
			return initState;
		},
	},
});

export const kanbanActions = kanbanSlice.actions;

export default kanbanSlice.reducer;
