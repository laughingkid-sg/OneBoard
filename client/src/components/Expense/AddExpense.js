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
import styles from './AddExpense.module.css';

const { Option } = Select;

function isNumeric(value) {
	if (typeof value !== 'string') return false;
	return !(isNaN(value) || isNaN(parseFloat(value)));
}

function AddExpense(props) {
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
		<div className={` ${styles.addExpense}`}>
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
					// ? Maybe To change style - currently for testing purposes
					style={{ width: '100%' }}
					placeholder="Select labels"
					optionLabelProp="label"
					onChange={changeSelectHandler}
					allowClear
				>
					<Option value="test" label="test">
						<Badge className={`bg-primary`}>Test</Badge>
					</Option>
					<Option value="abcdef" label="abcdef">
						<p>ABCDEF</p>
					</Option>
					<Option value="ORD" label="ORD">
						<p>ORD</p>
					</Option>
				</Select>
				<div className="mt-3">
					<Button color="success" onClick={addExpenseHandler}>
						Add Expense
					</Button>
					<Button
						onClick={() => {
							alert('Feature coming soon!');
						}}
					>
						Import from csv
					</Button>
				</div>
			</Form>
		</div>
	);
}

export default AddExpense;
