import moment from 'moment';
import React, { useContext, useState, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { Badge, Button, Input } from 'reactstrap';
import DeleteExpense from './DeleteExpense';
import EditDelete from '../Kanban/KanbanUI/EditDelete';
// import { expenseActions } from '../../store/expense';
import ModalContext from '../../store/ModalContext';
import useInput from '../hooks/use-input';
import { updateExpense } from '../../store/expense-action';

function isNumeric(value) {
	if (typeof value !== 'string') return false;
	return !(isNaN(value) || isNaN(parseFloat(value)));
}

function ExpenseItem(props) {
	const modalContext = useContext(ModalContext);
	const [isEdit, setIsEdit] = useState(false);
	const [beforeChange, setBeforeChange] = useState(props.expense);
	const dispatch = useDispatch();
	const [cookies] = useCookies(['t']);
	const { t: token } = cookies;

	const {
		value: name,
		isValid: nameIsValid,
		onChange: nameOnChange,
	} = useInput((value) => value.trim() !== '', beforeChange.name);

	const descriptionRef = useRef();

	const {
		value: amount,
		isValid: amountIsValid,
		onChange: amountOnChange,
	} = useInput((value) => isNumeric(value), beforeChange.amount.toString());

	const dateRef = useRef();

	const deleteHandler = () => {
		modalContext.showModal(<DeleteExpense expense={beforeChange} />);
	};

	const editHandler = () => {
		const date = dateRef.current.value;
		const description = descriptionRef.current.value;

		if (!(nameIsValid && amountIsValid && date)) {
			setIsEdit(false);
			return;
		}

		const amountFloat = parseFloat(amount);

		// TODO Label checking (array of Objects comparison)
		// const cmpInfo = [
		// 	[name, expense.name, name === expense.name],
		// 	[amountFloat, expense.amount, amountFloat === expense.amount],
		// 	[
		// 		description,
		// 		expense.description,
		// 		description === expense.description,
		// 	],
		// 	[
		// 		date,
		// 		expense.date,
		// 		moment(date, 'YYYY-MM-DD').isSame(expense.date, 'day'),
		// 	],
		// ];
		// console.table(cmpInfo);
		if (
			name === beforeChange.name &&
			amountFloat === beforeChange.amount &&
			description === beforeChange.description &&
			moment(date, 'YYYY-MM-DD').isSame(beforeChange.date, 'day')
		) {
			console.log('The same');
			setIsEdit(false);
			return;
		}

		// TODO Add Labels
		const updatedExpense = {
			...beforeChange,
			name,
			date: new Date(date).toISOString(),
			description,
			amount: parseFloat(amount),
		};

		dispatch(updateExpense(token, updatedExpense));
		setBeforeChange(updatedExpense);
		setIsEdit(false);
	};

	const renderContent = isEdit ? (
		<React.Fragment>
			<td>
				<Input
					type="date"
					defaultValue={moment(beforeChange.date).format(
						'YYYY-MM-DD'
					)}
					innerRef={dateRef}
				/>
			</td>
			<td>
				{/* TODO Add Label selector */}
				<Input type="text" value={name} onChange={nameOnChange} />
			</td>
			<td>
				<Input
					type="textarea"
					innerRef={descriptionRef}
					defaultValue={beforeChange.description}
					// value={description}
					// onChange={nameOnChange}
				/>
			</td>
			<td>
				<Input
					id="amount"
					type="number"
					min="0.00"
					value={amount}
					onChange={amountOnChange}
				/>
			</td>
			<td>
				<Button color="success" onClick={editHandler}>
					Done
				</Button>
			</td>
		</React.Fragment>
	) : (
		<React.Fragment>
			<td> {moment(beforeChange.date).format('D/M/YYYY')}</td>{' '}
			<td>
				<React.Fragment>
					{beforeChange.name}
					{/* Replace with label bar */}
					{/* {beforeChange.label && <ExpenseBadges labels={beforeChange.label} />} */}
				</React.Fragment>
			</td>
			<td>
				{/* String formatting code */}
				{beforeChange.description.length < 25 ? (
					beforeChange.description
				) : (
					<React.Fragment>
						{/* Probably needs some work on this */}
						{beforeChange.description.substring(0, 30)}{' '}
						<a>Read more</a>
					</React.Fragment>
				)}
			</td>
			<td>{beforeChange.amount.toFixed(2)}</td>
			<td>
				{/* CSS change needed */}
				<EditDelete
					onEdit={() => {
						setIsEdit(true);
					}}
					onDelete={deleteHandler}
				/>
			</td>
		</React.Fragment>
	);

	return <tr key={beforeChange._id}>{renderContent}</tr>;
}

// const ExpenseBadges = (props) => {
// 	const { labels } = props;

// 	return labels.map((label) => (
// 		<Badge className={`bg-${label.type}`}>{label.name}</Badge>
// 	));
// };

export default ExpenseItem;
