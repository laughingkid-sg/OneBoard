import React from 'react';
import { Button, Input } from 'reactstrap';
import { useSelector } from 'react-redux';
import ExpenseTable from './ExpenseTable';
import useInput from '../hooks/use-input';

function ExpenseList(props) {
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
		? expenses.expense.filter((expense) =>
				expense.name.toLowerCase().includes(filter.toLowerCase())
		  )
		: expenses.expense;

	return (
		<div className={props.className}>
			{/* <h3>Transaction History</h3> */}
			{/* TODO - Filter expenses */}
			<div className="d-flex">
				<Input
					id="filter"
					name="filter"
					placeholder="Enter Transaction Name"
					value={filter}
					onChange={filterOnChange}
				/>
				<Button onClick={filterReset}>Clear</Button>
			</div>
			<ExpenseTable expenses={filteredExpenses} />
		</div>
	);
}

export default ExpenseList;
