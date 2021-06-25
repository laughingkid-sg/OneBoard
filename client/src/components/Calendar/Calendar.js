import moment from 'moment';
import React, { useEffect, useContext } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar as Cal, momentLocalizer } from 'react-big-calendar';
import EventModal from './EventModal';
import { eventActions } from '../../store/event';
import { fetchEvents } from '../../store/event-actions';
import ModalContext from '../../store/ModalContext';
import { convertToDate, updateEventTime } from '../../lib/event';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Cal);

function Calendar() {
	const dispatch = useDispatch();
	const [cookies] = useCookies(['t']);
	const { t: token } = cookies;
	const modalContext = useContext(ModalContext);
	const events = useSelector((state) => state.event).map(convertToDate);

	useEffect(() => {
		function eventsFromStorage() {
			const stringEvents = localStorage.getItem('event');
			const parsedEvents = JSON.parse(stringEvents);
			if (parsedEvents) {
				console.log(parsedEvents);
				if (parsedEvents.length !== 0) {
					console.log('Mount from storage');
					dispatch(eventActions.replace(parsedEvents));
					return;
				}
			}
			console.log('Fetch events from server');
			const start = moment().startOf('month').toDate();
			const end = moment().endOf('month').toDate();
			dispatch(fetchEvents(token, start, end));
		}
		eventsFromStorage();
		return () => {
			dispatch(eventActions.store());
		};
	}, [dispatch, token]);

	const eventDropHandler = (data) => {
		alert('To be updated');
		console.log(data);
		const updated = updateEventTime(data);
		// ! POST To Update
		// dispatch(updateEvent(token,updated));
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
				defaultView={'day'}
				events={events}
				localizer={localizer}
				style={{ height: '500px' }}
				onEventDrop={eventDropHandler}
				onEventResize={eventDropHandler}
				onSelectSlot={addEventHandler}
				onSelectEvent={viewEventHandler}
				views={{ month: true, day: true }}
				resizable
				selectable
				popup
			/>
		</React.Fragment>
	);
}

export default Calendar;
