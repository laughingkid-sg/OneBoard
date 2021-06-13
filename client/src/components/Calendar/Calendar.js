import moment from 'moment';
import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar as Cal, momentLocalizer } from 'react-big-calendar';
import EventModal from './EventModal';
import { eventActions } from '../../store/event';
import ModalContext from '../../store/ModalContext';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
// May be changed for other styles
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Cal);

function serializeEvent(data) {
	const { start: newStart, end: newEnd, event } = data;
	const { start: prevStart, end: prevEnd } = event;
	const serialDate = [newStart, newEnd, prevStart, prevEnd].map((date) =>
		date.toJSON()
	);
	return {
		...data,
		start: serialDate[0],
		end: serialDate[1],
		event: {
			...event,
			start: serialDate[2],
			end: serialDate[3],
		},
	};
}

function Calendar() {
	// TODO Persistence for Calendar
	const modalContext = useContext(ModalContext);
	const events = useSelector((state) => state.event);
	const dispatch = useDispatch();

	const eventDropHandler = (data) => {
		// ! To be placed within the event action creator
		const serialized = serializeEvent(data);
		dispatch(eventActions.updateEvent(serialized));
	};

	const addEventHandler = (data) => {
		modalContext.showModal(
			<EventModal modalType="Add" addStart={data.start} />
		);
	};

	const viewEventHandler = (event) => {
		modalContext.showModal(<EventModal modalType="Read" event={event} />);
	};

	return (
		<React.Fragment>
			<DnDCalendar
				defaultDate={moment().toDate()}
				defaultView={'month'}
				events={events}
				localizer={localizer}
				style={{ height: '50vh' }}
				onEventDrop={eventDropHandler}
				onEventResize={eventDropHandler}
				onSelectSlot={addEventHandler}
				onSelectEvent={viewEventHandler}
				resizable
				selectable
				popup
			/>
		</React.Fragment>
	);
}

export default Calendar;
