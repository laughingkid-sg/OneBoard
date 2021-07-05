import moment from 'moment';
import React, { useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import {
	Form,
	FormGroup,
	FormFeedback,
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
import { addExpense } from '../../store/expense-action';
import styles from './AddExpense.module.css';
import { textNotEmpty, isNumeric } from '../../lib/validators';

const { Option } = Select;

function AddExpense(props) {
	const dispatch = useDispatch();
	const [cookies] = useCookies(['t']);
	const { t: token } = cookies;

	const {
		value: name,
		isValid: nameIsValid,
		hasError: nameHasError,
		onChange: nameOnChange,
		onBlur: nameOnBlur,
		reset: nameReset,
	} = useInput(textNotEmpty, '');
	const dateRef = useRef(''); // Probably use antd
	const descRef = useRef();
	const {
		value: amount,
		isValid: amountIsValid,
		hasError: amountHasError,
		onChange: amountOnChange,
		onBlur: amountOnBlur,
		reset: amountReset,
	} = useInput(isNumeric, 0.0);
	const [labels, setLabels] = useState([]);

	const changeSelectHandler = (value, option) => {
		// TODO Probably be replaced
		setLabels(option);
	};

	const addExpenseHandler = () => {
		const date = dateRef.current.value;
		const description = descRef.current.value.trim();

		if (!(nameIsValid && amountIsValid && date)) return;

		const amountNumber = parseFloat(amount);

		// TODO Add Labels
		const expense = { name, date, amount: amountNumber, description };
		console.log(expense);

		dispatch(addExpense(token, expense));
	};

	return (
		<div className={` ${styles.addExpense}`}>
			<Form>
				{/* Name */}
				<FormGroup>
					<Label for="name">Name</Label>
					<Input
						id="name"
						type="text"
						name="name"
						placeholder="Enter expense name"
						value={name}
						onChange={nameOnChange}
						onBlur={nameOnBlur}
						invalid={nameHasError}
					/>
					<FormFeedback>Please ensure name is not empty</FormFeedback>
				</FormGroup>

				{/* Amount */}
				<FormGroup>
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
							placeholder="Enter amount"
							invalid={amountHasError}
						/>
					</InputGroup>
					<FormFeedback>Please ensure amount is valid</FormFeedback>
				</FormGroup>

				{/* Date of transaction */}
				<FormGroup>
					<Label for="date">Date</Label>
					{/* Probably replace with antd */}
					<Input
						id="date"
						type="date"
						innerRef={dateRef}
						defaultValue={moment().format('YYYY-MM-DD')}
					/>
				</FormGroup>

				{/* Description */}
				<Label for="description">Description</Label>
				<Input
					id="description"
					type="textarea"
					innerRef={descRef}
					placeholder="Enter description"
				/>

				{/* Labels */}
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
					{/* <Option value="test" label="test">
						<Badge className={`bg-primary`}>Test</Badge>
					</Option>
					<Option value="abcdef" label="abcdef">
						<p>ABCDEF</p>
					</Option>
					<Option value="ORD" label="ORD">
						<p>ORD</p>
					</Option> */}
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
