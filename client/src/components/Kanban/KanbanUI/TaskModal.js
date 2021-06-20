import React, { useContext, useState, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import {
	Badge,
	Button,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
} from 'reactstrap';
import LabelSelect from './Label/LabelSelect';
import styles from './TaskModal.module.css';
import { updateTask } from '../../../store/kanban-actions';
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
	const [cookies] = useCookies(['t']);
	const token = cookies.t;

	const confirmEditHandler = () => {
		if (nameRef.current.value.trim() === '') {
			return;
		}

		if (
			nameRef.current.value === beforeChange.name &&
			descriptionRef.current.value === beforeChange.description
		) {
			toggleEditHandler();
			return;
		}

		// TODO Include label, expireAt, subTask
		const updatedTask = {
			name: nameRef.current.value,
			description: descriptionRef.current.value,
			order: beforeChange.order,
		};

		setBeforeChange(updatedTask);
		dispatch(updateTask(token, task.id, updatedTask));
		toggleEditHandler();
	};

	const toggleEditHandler = () => {
		setIsWrite((prevWrite) => !prevWrite);
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
						<input
							type="text"
							id="taskTitle"
							ref={nameRef}
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
					<textarea
						rows="10"
						ref={descriptionRef}
						defaultValue={beforeChange.description}
						className={styles.input}
					/>
				)}

				{/* Labels */}
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
