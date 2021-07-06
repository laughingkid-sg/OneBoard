import moment from 'moment';
import React, { useRef, useState, useContext } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import {
	Form,
	FormGroup,
	FormFeedback,
	Label,
	Input,
	Button,
	InputGroup,
	InputGroupAddon,
	InputGroupText,
} from 'reactstrap';
import 'antd/dist/antd.css';
import useInput from '../hooks/use-input';
import { addExpense } from '../../store/expense-action';
import styles from './AddExpense.module.css';
import { textNotEmpty, isNumeric, hasId } from '../../lib/validators';
import ModalContext from '../../store/ModalContext';
import ManageLabel from './ManageLabel';
import Dropdown from '../../UI/Dropdown/Dropdown';

// const { Option } = Select;

function AddExpense(props) {
	const dispatch = useDispatch();
	const [cookies] = useCookies(['t']);
	const { t: token } = cookies;
	const modalContext = useContext(ModalContext);
	const expenseLabels = useSelector((state) => state.expense.labels).filter(
		hasId
	);

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
	const [label, setLabels] = useState([]);

	const addExpenseHandler = () => {
		const date = dateRef.current.value;
		const description = descRef.current.value.trim();

		if (!(nameIsValid && amountIsValid && date)) return;

		const amountNumber = parseFloat(amount);

		const expense = {
			name,
			date,
			amount: amountNumber,
			description,
			label,
		};

		// ! Labels not tested
		dispatch(addExpense(token, expense));

		// Reset
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
				<Dropdown
					className="w-100"
					onChange={(value) => setLabels(value)}
					labelSrc={expenseLabels}
				/>

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
					<Button
						onClick={() => {
							modalContext.showModal(<ManageLabel />);
						}}
					>
						Manage Labels
					</Button>
				</div>
			</Form>
		</div>
	);
}

export default AddExpense;
