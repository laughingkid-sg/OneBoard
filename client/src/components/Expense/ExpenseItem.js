import { Select } from 'antd';
import moment from 'moment';
import React, { useContext, useState, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input } from 'reactstrap';
import DeleteExpense from './DeleteExpense';
import EditDelete from '../Kanban/KanbanUI/EditDelete';
import LabelBar from '../../UI/LabelBar';
import ModalContext from '../../store/ModalContext';
import useInput from '../hooks/use-input';
import { updateExpense } from '../../store/expense-action';
import { hasId, isNumeric } from '../../lib/validators';
import { Badge } from 'reactstrap';
import Dropdown from '../../UI/Dropdown/Dropdown';

const { Option } = Select;

function ExpenseItem(props) {
	const { expense } = props;
	const dispatch = useDispatch();
	const [cookies] = useCookies(['t']);
	const { t: token } = cookies;
	const expenseLabels = useSelector((state) => state.expense.labels).filter(
		hasId
	);
	const modalContext = useContext(ModalContext);
	const [isEdit, setIsEdit] = useState(false);
	const [labelSelect, setLabelSelect] = useState(
		expense.label.filter((label) =>
			expenseLabels.find((eLabel) => eLabel._id === label)
		)
	);
	const [beforeChange, setBeforeChange] = useState(expense);

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

		// TODO Label checking (array of Ids comparison)
		let isChanged = false;
		if (labelSelect.length !== beforeChange.label.length) isChanged = true;
		if (!isChanged) {
			for (let i = 0; i < labelSelect.length; i++) {
				if (
					!beforeChange.label.some((label) => label === labelSelect)
				) {
					isChanged = true;
				}
			}
		}

		if (
			name === beforeChange.name &&
			amountFloat === beforeChange.amount &&
			description === beforeChange.description &&
			moment(date, 'YYYY-MM-DD').isSame(beforeChange.date, 'day') &&
			!isChanged
		) {
			console.log('The same');
			setIsEdit(false);
			return;
		}

		const updatedExpense = {
			...beforeChange,
			name,
			date: new Date(date).toISOString(),
			description,
			label: labelSelect,
			amount: parseFloat(amount),
		};

		// console.log(updatedExpense);
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
				<Dropdown
					className="w-100"
					value={labelSelect}
					onChange={(value) => setLabelSelect(value)}
					labelSrc={expenseLabels}
				/>
			</td>
			<td>
				<Input
					type="textarea"
					innerRef={descriptionRef}
					defaultValue={beforeChange.description}
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
					<LabelBar
						labels={beforeChange.label}
						labelSrc={expenseLabels}
					/>
				</React.Fragment>
			</td>
			<td>
				{/* TODO String formatting code */}
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

export default ExpenseItem;
