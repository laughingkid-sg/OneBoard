import moment from 'moment';
import React, { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	Form,
	Label,
	Input,
	Button,
	Badge,
	InputGroup,
	InputGroupAddon,
	InputGroupText,
} from 'reactstrap';
import { Select } from 'antd';
import 'antd/dist/antd.css';
import useInput from '../hooks/use-input';
import { expenseActions } from '../../store/expense';

const { Option } = Select;

function isNumeric(value) {
	if (typeof value !== 'string') return false;
	return !(isNaN(value) || isNaN(parseFloat(value)));
}

function AddExpense() {
	// TODO Redux
	const expenses = useSelector((state) => state.expense);
	const dispatch = useDispatch();
	const {
		value: name,
		isValid: nameIsValid,
		hasError: nameHasError,
		onChange: valueOnChange,
		onBlur: valueOnBlur,
		reset: valueReset,
	} = useInput((value) => value.trim() !== '', '');
	const dateRef = useRef('');
	const {
		value: amount,
		isValid: amountIsValid,
		hasError: amountHasError,
		onChange: amountOnChange,
		onBlur: amountOnBlur,
		reset: amountReset,
	} = useInput((value) => isNumeric(value), 0.0);
	const [labels, setLabels] = useState([]);

	const changeSelectHandler = (value, option) => {
		// TODO Probably be replaced
		setLabels(option);
	};

	const addExpenseHandler = () => {
		const date = dateRef.current.value;

		if (!(nameIsValid && amountIsValid && date)) return;

		const amountNumber = parseFloat(amount);
		// TODO manage labels for expenses
		const expense = { name, date, amount: amountNumber };

		// ! POST Request to add expense
		dispatch(expenseActions.addExpense(expense));
	};

	return (
		<React.Fragment>
			<h3>Add Expense</h3>
			<Form>
				{/* Name */}
				<Label for="name">Name</Label>
				<Input
					id="name"
					type="text"
					name="name"
					placeholder="Enter expense name"
					value={name}
					onChange={valueOnChange}
					onBlur={valueOnBlur}
				/>

				{/* Amount */}
				<Label for="amount">Amount</Label>
				<InputGroup>
					<InputGroupAddon addonType="prepend">
						<InputGroupText>$</InputGroupText>
					</InputGroupAddon>
					<Input
						id="amount"
						type="number"
						min="0.00"
						// Conversion to number
						value={amount}
						onChange={amountOnChange}
						onBlur={amountOnBlur}
					/>
				</InputGroup>

				{/* Date of transaction */}
				<Label for="date">Date</Label>
				<Input
					id="date"
					type="date"
					innerRef={dateRef}
					defaultValue={moment().format('YYYY-MM-DD')}
				/>

				{/* Label (or categories) */}
				<Label for="label">Label</Label>
				<Select
					mode="multiple"
					// To change style - currently for testing purposes
					style={{ width: '500px' }}
					placeholder="Select labels"
					optionLabelProp="label"
					onChange={changeSelectHandler}
					allowClear
				>
					{/* Badges dont seem to work here */}
					<Option value="test" label="test">
						<Badge color="primary">Test</Badge>
					</Option>
					<Option value="abcdef" label="abcdef">
						<p>ABCDEF</p>
					</Option>
					<Option value="ORD" label="ORD">
						<p>ORD</p>
					</Option>
				</Select>
				<Button color="success" onClick={addExpenseHandler}>
					Add Expense
				</Button>
				<Button>Import from csv</Button>
			</Form>
		</React.Fragment>
	);
}

export default AddExpense;
