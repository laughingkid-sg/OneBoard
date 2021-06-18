import React from 'react';
import { Button, Input } from 'reactstrap';
import { useSelector } from 'react-redux';
import ExpenseTable from './ExpenseTable';
import { expenseActions } from '../../store/expense';
import useInput from '../hooks/use-input';

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
