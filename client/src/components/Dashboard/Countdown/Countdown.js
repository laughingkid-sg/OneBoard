import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEvent } from '../../../store/event-actions';

function determineCountdown(start, end) {
	if (moment().isAfter(end, 'days')) return { daysDiff: -1, isStart: false };

	let daysDiff;
	let isStart = true;
	if (moment().isBefore(start)) {
		daysDiff = moment().diff(start, 'days') * -1;
	} else {
		daysDiff = moment().diff(end, 'days');
		isStart = false;
	}

	return { daysDiff, isStart };
}

// Bug in determining countdown
function Countdown() {
	const dispatch = useDispatch();
	const [cookies] = useCookies(['t']);
	const { t: token } = cookies;
	const featured = useSelector((state) => state.user.featured);
	const [featuredEvent, setFeaturedEvent] = useState(null);

	useEffect(() => {
		async function fetchData() {
			const getEvent = await dispatch(fetchEvent(token, featured));
			setFeaturedEvent(getEvent);
		}

		if (featured) {
			fetchData();
		} else {
			setFeaturedEvent(null);
		}
		return () => {};
	}, [featured]);

	if (!featuredEvent) {
		return <p>No events for countdown.</p>;
	}

	const countdown = determineCountdown(
		featuredEvent.start,
		featuredEvent.end
	);

	const formatMessage = !featuredEvent.allDay
		? `${countdown.isStart ? 'start of' : 'end of'}`
		: '';

	return (
		<React.Fragment>
			<p>
				{countdown.daysDiff >= 0
					? `${countdown.daysDiff} days to ${formatMessage} ${featuredEvent.title}`
					: 'Event selected has passed.'}
			</p>
		</React.Fragment>
	);
}

export default Countdown;
