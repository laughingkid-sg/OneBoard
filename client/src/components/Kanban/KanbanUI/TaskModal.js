import moment from 'moment';
import React, { useContext, useState, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import { DatePicker } from 'antd';
import {
	Badge,
	Button,
	Input,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
} from 'reactstrap';
import LabelSelect from './Label/LabelSelect';
import styles from './TaskModal.module.css';
import { TYPES, updateData } from '../../../store/kanban-actions';
import ModalContext from '../../../store/ModalContext';
import { AddSubtask, SubtaskList } from './Subtask';

// TODO To be replaced
const LABEL_TYPES = [
	'primary',
	'secondary',
	'success',
	'info',
	'warning',
	'danger',
];

function TaskModal(props) {
	const dispatch = useDispatch();
	const { task, columnTitle, write, onDelete } = props;
	const modalContext = useContext(ModalContext);
	const nameRef = useRef();
	const descriptionRef = useRef();
	const [isWrite, setIsWrite] = useState(write || false);
	const [beforeChange, setBeforeChange] = useState({ ...task });
	const [deadline, setDeadline] = useState(
		task.expireAt ? moment(task.expireAt) : null
	);
	const [cookies] = useCookies(['t']);
	const token = cookies.t;

	const confirmEditHandler = () => {
		if (nameRef.current.value.trim() === '') {
			return;
		}

		if (
			nameRef.current.value === beforeChange.name &&
			descriptionRef.current.value === beforeChange.description &&
			deadline.isSame(moment(beforeChange.expireAt))
		) {
			toggleEditHandler();
			return;
		}

		// TODO Include label, expireAt, subTask
		// * expireAt needs to be an ISOString for backend
		const updatedTask = {
			name: nameRef.current.value,
			description: descriptionRef.current.value,
			order: beforeChange.order,
			expireAt: deadline,
		};

		setBeforeChange(updatedTask);
		dispatch(updateData(token, TYPES.TASK, updatedTask, task._id));
		toggleEditHandler();
	};

	const toggleEditHandler = () => {
		setIsWrite((prevWrite) => !prevWrite);
	};

	const dateChangeHandler = (date, dateString) => {
		setDeadline(date);
		// console.log(new Date(dateString).toISOString());
	};

	const renderButtons = isWrite ? (
		<React.Fragment>
			<Button color="success" onClick={confirmEditHandler}>
				Confirm Changes
			</Button>
			<Button color="danger" outline onClick={toggleEditHandler}>
				Cancel Changes
			</Button>
		</React.Fragment>
	) : (
		<React.Fragment>
			<Button onClick={onDelete} color="danger">
				Delete Task
			</Button>
			<Button onClick={toggleEditHandler} color="warning">
				Edit Task
			</Button>
		</React.Fragment>
	);

	return (
		<Modal
			isOpen={modalContext.isVisible}
			toggle={modalContext.hideModal}
			className="my-1"
		>
			<AiOutlineClose
				onClick={modalContext.hideModal}
				className={`${styles.close} me-3 mt-3`}
			/>
			<ModalHeader tag="div">
				<React.Fragment>
					{!isWrite && (
						<h2 className={styles.title}>{beforeChange.name}</h2>
					)}
					{isWrite && (
						<Input
							type="text"
							id="taskTitle"
							innerRef={nameRef}
							defaultValue={beforeChange.name}
							className={styles.input}
						/>
					)}
					<p className={styles.subtitle}>in {columnTitle}</p>
				</React.Fragment>
			</ModalHeader>
			<ModalBody>
				<h3 className={styles.header}>Description</h3>
				{!isWrite && (
					<p className={styles.description}>
						{beforeChange.description || ' '}
					</p>
				)}
				{isWrite && (
					// <textarea
					// 	rows="10"
					// 	ref={descriptionRef}
					// 	defaultValue={beforeChange.description}
					// 	className={styles.input}
					// />
					<Input
						type="textarea"
						innerRef={descriptionRef}
						defaultValue={beforeChange.description}
						className={styles.input}
					/>
				)}

				{/* Deadline */}
				<h3>Deadline</h3>
				{isWrite && (
					<DatePicker
						allowClear
						defaultValue={deadline || moment()}
						onChange={dateChangeHandler}
					/>
				)}
				{!isWrite && (
					<p>
						{deadline
							? deadline.format('DD/MM/YYYY')
							: 'No deadline'}
					</p>
				)}

				{/* Labels - Recycle from Expenses there*/}
				<h3>Labels</h3>
				{/* TODO Style this */}
				<div className="d-flex align-items-center">
					{/* DUMMY LABEL - to be replaced by a map()*/}
					<Badge className="bg-primary m-0">Low Priority</Badge>
					<LabelSelect labelTypes={LABEL_TYPES} />
				</div>

				{/* Subtasks */}
				<h3>Subtasks </h3>
				<AddSubtask />
				<SubtaskList subtasks={task.subtasks} taskId={task.id} />
			</ModalBody>

			<ModalFooter>{renderButtons}</ModalFooter>
		</Modal>
	);
}

export default TaskModal;
