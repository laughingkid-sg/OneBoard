import React, { useEffect, useState, useRef } from 'react';
import { Button, Input, Label } from 'reactstrap';
import { useSelector } from 'react-redux';
import ExpenseTable from './ExpenseTable';
import useInput from '../hooks/use-input';
import { textNotEmpty } from '../../lib/validators';

function queryInString(value, query) {
	return value.toLowerCase().includes(query.toLowerCase());
}

function ExpenseList(props) {
	const expenses = useSelector((state) => state.expense);
	const [checked, setChecked] = useState({ name: true, description: true });
	const [filteredExpenses, setFilteredExpenses] = useState(expenses.expense);
	const {
		value: filter,
		isValid: filterIsValid,
		onChange: filterOnChange,
		reset: filterReset,
	} = useInput(textNotEmpty, '');
	const nameRef = useRef();
	const descriptionRef = useRef();

	useEffect(() => {
		// console.log(checked);
		const filtered = filterIsValid
			? expenses.expense.filter(
					(expense) =>
						(checked.name && queryInString(expense.name, filter)) ||
						(checked.description &&
							queryInString(expense.description, filter))
			  )
			: expenses.expense;
		// if (filtered.length < expenses.expense.length) console.log(filtered);
		setFilteredExpenses(filtered);
		return () => {};
	}, [filter, checked, expenses.expense]);

	return (
		<div>
			{/* <h3>Transaction History</h3> */}
			{/* TODO - Filter expenses */}
			{/* TODO - Include Date Range */}
			<div className="d-flex align-items-center">
				<div className="d-flex w-75">
					<Input
						id="filter"
						name="filter"
						placeholder="Enter Transaction Name"
						value={filter}
						onChange={filterOnChange}
					/>
					<Button onClick={filterReset}>Clear</Button>
				</div>

				<Input
					id="name"
					name="name"
					type="checkbox"
					innerRef={nameRef}
					checked={checked.name}
					onChange={() => {
						setChecked({ ...checked, name: !checked.name });
					}}
				/>
				<Label for="name">Name</Label>

				<Input
					id="description"
					name="description"
					type="checkbox"
					innerRef={descriptionRef}
					checked={checked.description}
					onChange={() => {
						setChecked({
							...checked,
							description: !checked.description,
						});
					}}
				/>
				<Label for="description">Description</Label>
			</div>
			<ExpenseTable expenses={filteredExpenses} />
		</div>
	);
}

export default ExpenseList;
