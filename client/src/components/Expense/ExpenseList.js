import React from 'react';
import { Button, Input } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import ExpenseTable from './ExpenseTable';
import { expenseActions } from '../../store/expense';
import useInput from '../hooks/use-input';

const DUMMY_EXPENSES = [
	{
		id: '1',
		name: 'LiHo',
		date: new Date(),
		amount: 3.5,
		label: [
			{
				type: 'primary',
				name: 'Bubble Tea',
			},
		],
	},
	{
		id: '2',
		date: new Date(2021, 5, 6),
		name: 'Shopee 6.6 purchase',
		amount: 750.5,
	},
	{
		id: '3',
		date: new Date(),
		name: 'Gas money',
		amount: 74.94,
		label: [{ type: 'warning', name: 'expenses' }],
	},
];

function ExpenseList() {
	// TODO Integration with redux
	const expenses = useSelector((state) => state.expense);
	const {
		value: filter,
		isValid: filterIsValid,
		onChange: filterOnChange,
		reset: filterReset,
	} = useInput((value) => value.trim() !== '', '');

	// ? Convert to React Hooks?
	const filteredExpenses = filterIsValid
		? expenses.filter((expense) =>
				expense.name.toLowerCase().includes(filter.toLowerCase())
		  )
		: expenses;

	return (
		<React.Fragment>
			<h3>Transaction History</h3>
			{/* TODO - Filter expenses */}
			<Input
				id="filter"
				name="filter"
				placeholder="Enter Transaction Name"
				value={filter}
				onChange={filterOnChange}
			/>
			<Button onClick={filterReset}>Clear</Button>
			<ExpenseTable expenses={filteredExpenses} />
		</React.Fragment>
	);
}

export default ExpenseList;
