import moment from 'moment';
import { Button, ModalBody, ModalFooter } from 'reactstrap';
import React, { useContext } from 'react';
import ModalContext from '../../store/ModalContext';
import EventModal from './EventModal';

function formatDate(date, allDay) {
	return allDay
		? moment(date).format('DD-MMM-YY')
		: moment(date).format('DD-MMM-YY h:mm a');
}

const ViewEvent = (props) => {
	const { event } = props;
	const { start, end, allDay, desc } = event;
	const modalContext = useContext(ModalContext);

	const editHandler = () => {
		modalContext.showModal(<EventModal modalType="Edit" event={event} />);
	};

	const deleteHandler = () => {
		modalContext.showModal(<EventModal modalType="Delete" event={event} />);
	};

	return (
		<React.Fragment>
			<ModalBody>
				<h4>Duration</h4>
				<p>{`${formatDate(start, allDay)} to ${formatDate(
					end,
					allDay
				)}`}</p>
				{desc && (
					<React.Fragment>
						<h4>Description</h4>
						<p>{desc}</p>
					</React.Fragment>
				)}
			</ModalBody>
			<ModalFooter>
				<Button color="warning" onClick={editHandler}>
					Edit Event
				</Button>
				<Button color="danger" onClick={deleteHandler}>
					Delete Event
				</Button>
			</ModalFooter>
		</React.Fragment>
	);
};

export default ViewEvent;
