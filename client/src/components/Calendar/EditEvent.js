import moment from 'moment';
import React, { useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Form, Input, Label, ModalBody, ModalFooter } from 'reactstrap';
import { DatePicker } from 'antd';
import 'antd/dist/antd.css';
import EventModal from './EventModal';
import ModalContext from '../../store/ModalContext';
import { eventActions } from '../../store/event';
import useInput from '../hooks/use-input';

function EditEvent(props) {
	const dispatch = useDispatch();
	const { event, addStart } = props;
	const isAdd = !!!event;
	const initTitle = event ? event.title : '';
	const initDateTime = event
		? [moment(event.start), moment(event.end)]
		: [moment(addStart), null];
	const initAllDay = event ? event.allDay : false;
	const modalContext = useContext(ModalContext);
	const {
		value: title,
		isValid: titleIsValid,
		onChange: titleOnChange,
		onBlur: titleOnBlur,
	} = useInput((value) => value.trim() !== '', initTitle);
	const [dateTime, setDateTime] = useState(initDateTime);
	const [allDay, setAllDay] = useState(initAllDay);

	const returnToView = (selectedEvent) => {
		modalContext.showModal(
			<EventModal modalType="Read" event={selectedEvent} />
		);
	};

	const changeDateTimeHandler = (dates, dateStrings) => {
		setDateTime(dates);
	};

	const submitHandler = () => {
		let [start, end] = dateTime;

		if (!titleIsValid || start === null || end == null) {
			// TODO Handle invalids
			alert('Invalid');
			return;
		}

		if (
			title === event.title &&
			event.allDay === allDay &&
			moment(event.start).isSame(start) &&
			moment(event.end).isSame(end)
		) {
			return;
		}

		if (allDay) {
			[start, end].map((time) => time.startOf('day'));
		}

		const [startSerialize, endSerialize] = [start, end].map((time) =>
			time.valueOf()
		);

		// ! Handled by POST Requests
		if (isAdd) {
			const payload = {
				start: startSerialize,
				end: endSerialize,
				allDay,
				title,
			};
			dispatch(eventActions.addEvent(payload));
			modalContext.hideModal();
			return;
		}

		// Serialize for Redux management
		const payload = {
			event: { ...event, allDay, title },
			start: startSerialize,
			end: endSerialize,
		};

		dispatch(eventActions.updateEvent(payload));

		returnToView({ ...payload.event, start, end });
	};

	const cancelHandler = () => {
		if (isAdd) {
			modalContext.hideModal();
			return;
		}
		returnToView(event);
	};

	return (
		<React.Fragment>
			<ModalBody>
				<Form>
					<Label for="title">Title</Label>
					<Input
						type="text"
						id="title"
						name="title"
						placeholder="Add a title"
						value={title}
						onChange={titleOnChange}
						onBlur={titleOnBlur}
					/>
					<DatePicker.RangePicker
						ranges={{
							Today: [moment(), moment()],
						}}
						showTime={
							allDay
								? false
								: { use12Hours: true, format: 'h:mm a' }
						}
						style={{ width: '100%' }}
						onChange={changeDateTimeHandler}
						format="DD/MM/YYYY h:mm a"
						value={dateTime}
					/>
					<Input
						type="checkbox"
						id="allDay"
						name="allDay"
						onChange={() => setAllDay(!allDay)}
						checked={allDay}
					/>
					<Label for="allDay">All Day</Label>
				</Form>
			</ModalBody>
			<ModalFooter>
				<Button color="success" onClick={submitHandler}>
					Submit
				</Button>
				<Button color="danger" outline onClick={cancelHandler}>
					Cancel
				</Button>
			</ModalFooter>
		</React.Fragment>
	);
}

export default EditEvent;
