import moment from 'moment';
import React, { useState, useContext, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Form, Input, Label, ModalBody, ModalFooter } from 'reactstrap';
import { DatePicker } from 'antd';
import 'antd/dist/antd.css';
import EventModal from './EventModal';
import ModalContext from '../../store/ModalContext';
import { eventActions } from '../../store/event';
import useInput from '../hooks/use-input';
import { FormGroup } from 'reactstrap';

function initializeEvent(event, addStart) {
	const isAdd = !!!event;
	const title = event ? event.title : '';
	const dateTime = event
		? [moment(event.start), moment(event.end)]
		: [moment(addStart), null];
	const desc = event ? event.desc : '';
	const allDay = event ? event.allDay : false;
	return { isAdd, allDay, title, dateTime, desc, allDay };
}

function EditEvent(props) {
	const dispatch = useDispatch();
	const { event, addStart } = props;
	const initEvent = initializeEvent(event, addStart);
	const modalContext = useContext(ModalContext);
	const {
		value: title,
		isValid: titleIsValid,
		onChange: titleOnChange,
		onBlur: titleOnBlur,
	} = useInput((value) => value.trim() !== '', initEvent.title);
	const descRef = useRef(initEvent.desc);
	const [dateTime, setDateTime] = useState(initEvent.dateTime);
	const [allDay, setAllDay] = useState(initEvent.allDay);

	const returnToView = (selectedEvent) => {
		modalContext.showModal(
			<EventModal modalType="Read" event={selectedEvent} />
		);
	};

	const changeDateTimeHandler = (dates, dateStrings) => {
		setDateTime(dates);
	};

	const submitHandler = () => {
		const newDesc = descRef.current.value;
		let [start, end] = dateTime;

		if (!titleIsValid || start === null || end == null) {
			// TODO Handle invalids
			alert('Invalid');
			return;
		}

		if (
			initEvent.title === title &&
			initEvent.allDay === allDay &&
			initEvent.desc === newDesc &&
			moment(event.start).isSame(start) &&
			moment(event.end).isSame(end)
		) {
			return;
		}

		const [startSerialize, endSerialize] = [start, end].map((time) => {
			if (allDay) {
				time = time.startOf('day');
			}
			return time.valueOf();
		});

		// ! Handled by POST Requests
		if (initEvent.isAdd) {
			const payload = {
				start: startSerialize,
				end: endSerialize,
				allDay,
				title,
				desc: newDesc,
			};
			dispatch(eventActions.addEvent(payload));
			modalContext.hideModal();
			return;
		}

		// Serialize for Redux management
		const payload = {
			event: { ...event, allDay, title, desc: newDesc },
			start: startSerialize,
			end: endSerialize,
		};

		dispatch(eventActions.updateEvent(payload));

		returnToView({ ...payload.event, start, end });
	};

	const cancelHandler = () => {
		if (initEvent.isAdd) {
			modalContext.hideModal();
			return;
		}
		returnToView(event);
	};

	return (
		<React.Fragment>
			<ModalBody>
				<Form>
					<FormGroup className="mb-2">
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
					</FormGroup>
					<FormGroup className="mb-2">
						<Label for="dateRange">Duration</Label>
						<DatePicker.RangePicker
							id="dateRange"
							ranges={{
								Today: [moment(), moment()],
							}}
							showTime={
								allDay
									? false
									: { use12Hours: true, format: 'h:mm a' }
							}
							style={{ width: '85%' }}
							onChange={changeDateTimeHandler}
							format="DD/MM/YYYY h:mm a"
							value={dateTime}
						/>
						<div className="d-flex flex-row align-items-center">
							<Input
								type="checkbox"
								id="allDay"
								name="allDay"
								onChange={() => setAllDay(!allDay)}
								checked={allDay}
							/>
							<Label
								for="allDay"
								style={{ marginLeft: '8px', fontSize: '1rem' }}
							>
								All Day
							</Label>
						</div>
					</FormGroup>
					<FormGroup className="mb-2">
						<Label for="description">Description</Label>
						<Input
							type="textarea"
							id="description"
							name="description"
							placeholder="Add a description"
							innerRef={descRef}
							defaultValue={initEvent.desc}
						/>
					</FormGroup>
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
