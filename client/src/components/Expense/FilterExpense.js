import React, { useEffect, useState, useRef } from 'react';
import { Button, Input, Label } from 'reactstrap';
import useInput from '../hooks/use-input';
import { hasId, textNotEmpty } from '../../lib/validators';
import Dropdown from '../../UI/Dropdown/Dropdown';

function queryInString(value, query) {
	return value.toLowerCase().includes(query.toLowerCase());
}

function FilterExpense(props) {
	const { allExpenses, filterResults, labelSrc } = props;
	const labels = labelSrc.filter(hasId);
	const {
		value: filter,
		isValid: filterIsValid,
		onChange: filterOnChange,
		reset: filterReset,
	} = useInput(textNotEmpty, '');
	const [checked, setChecked] = useState({ name: true, description: true });
	const [labelSelect, setLabelSelect] = useState([]);
	const nameRef = useRef();
	const descriptionRef = useRef();

	{
		/* TODO - Include Date Range */
	}
	useEffect(() => {
		function filterExpenses() {
			let filteredExp =
				labelSelect.length === 0
					? allExpenses
					: allExpenses.filter((expense) =>
							expense.label.some((id) => labelSelect.includes(id))
					  );

			if (filterIsValid) {
				filteredExp = filteredExp.filter(
					(expense) =>
						(checked.name && queryInString(expense.name, filter)) ||
						(checked.description &&
							queryInString(expense.description, filter))
				);
			}
			return filteredExp;
		}

		filterResults(filterExpenses());
		return () => {};
	}, [filter, checked, allExpenses, labelSelect.length]);

	const resetHandler = () => {
		filterReset();
		setChecked({ name: true, description: true });
		setLabelSelect([]);
	};

	return (
		<div className="d-flex w-100 align-items-center">
			<Input
				id="filter"
				name="filter"
				placeholder="Enter Transaction Name"
				value={filter}
				onChange={filterOnChange}
				className="w-25"
			/>
			<div className="mx-2">
				<Input
					id="filterName"
					name="filterName"
					type="checkbox"
					innerRef={nameRef}
					checked={checked.name}
					onChange={() => {
						setChecked({ ...checked, name: !checked.name });
					}}
				/>
				<Label for="filterName" style={{ marginRight: '4px' }}>
					Name
				</Label>

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
			<Dropdown
				value={labelSelect}
				onChange={(value) => {
					setLabelSelect(value);
				}}
				className="w-25"
				labelSrc={labels}
			/>
			<Button onClick={resetHandler} className="mx-2">
				Reset
			</Button>
		</div>
	);
}

export default FilterExpense;
