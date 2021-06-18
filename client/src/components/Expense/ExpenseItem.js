import moment from 'moment';
import React, { useContext, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Badge, Button, Input } from 'reactstrap';
import DeleteExpense from './DeleteExpense';
import EditDelete from '../Kanban/KanbanUI/EditDelete';
import { expenseActions } from '../../store/expense';
import ModalContext from '../../store/ModalContext';
import useInput from '../hooks/use-input';

function isNumeric(value) {
	if (typeof value !== 'string') return false;
	return !(isNaN(value) || isNaN(parseFloat(value)));
}

function ExpenseItem(props) {
	const { expense } = props;
	const modalContext = useContext(ModalContext);
	const [isEdit, setIsEdit] = useState(false);
	const dispatch = useDispatch();

	const {
		value: name,
		isValid: nameIsValid,
		onChange: nameOnChange,
	} = useInput((value) => value.trim() !== '', expense.name);

	const {
		value: amount,
		isValid: amountIsValid,
		onChange: amountOnChange,
	} = useInput((value) => isNumeric(value), expense.amount.toString());
	const dateRef = useRef();

	const deleteHandler = () => {
		modalContext.showModal(<DeleteExpense expense={expense} />);
	};

	const editHandler = () => {
		const date = dateRef.current.value;
		if (!(nameIsValid && amountIsValid && date)) {
			return;
		}

		const amountFloat = parseFloat(amount);

		// TODO Label checking (array of Objects comparison)
		if (
			name === expense.name &&
			amountFloat === expense.amount &&
			moment(date, 'YYYY-MM-DD').isSame(expense.date, 'day')
		) {
			setIsEdit(false);
			return;
		}

		const updatedExpense = {
			...expense,
			name,
			date,
			amount: parseFloat(amount),
		};

		dispatch(expenseActions.updateExpense(updatedExpense));
		// setBeforeChange(updatedExpense);
		setIsEdit(false);
	};

	const renderContent = isEdit ? (
		<React.Fragment>
			<td>
				<Input
					type="date"
					defaultValue={moment(expense.date).format('YYYY-MM-DD')}
					innerRef={dateRef}
				/>
			</td>
			<td>
				{/* TODO Add Label selector */}
				<Input type="text" value={name} onChange={nameOnChange} />
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
			<td> {moment(expense.date).format('D/M/YYYY')}</td>{' '}
			<td>
				<React.Fragment>
					{expense.name}
					{expense.label && <ExpenseBadges labels={expense.label} />}
				</React.Fragment>
			</td>
			<td>{expense.amount.toFixed(2)}</td>
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

	return <tr key={expense.id}>{renderContent}</tr>;
}

const ExpenseBadges = (props) => {
	const { labels } = props;

	return labels.map((label) => (
		<Badge className={`bg-${label.type}`}>{label.name}</Badge>
	));
};

export default ExpenseItem;
