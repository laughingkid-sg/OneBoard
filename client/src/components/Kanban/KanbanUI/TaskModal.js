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
	const modalContext = useContext(ModalContext);
	const taskName = useRef(props.title);
	const description = useRef(props.description);
	const [isWrite, setIsWrite] = useState(props.write || false);
	const [beforeChange, setBeforeChange] = useState({
		name: props.title,
		description: props.description,
	});
	const [cookies] = useCookies(['t']);
	const token = cookies.t;

	const confirmEditHandler = () => {
		if (taskName.current.value.trim() === '') {
			return;
		}

		if (
			taskName.current.value === beforeChange.name &&
			description.current.value === beforeChange.description
		) {
			toggleEditHandler();
			return;
		}

		const updatedTask = {
			name: taskName.current.value,
			description: description.current.value,
		};

		setBeforeChange(updatedTask);
		dispatch(
			updateTask(
				props.boardId,
				props.columnId,
				props.id,
				updatedTask,
				token
			)
		);
		toggleEditHandler();
	};

	const toggleEditHandler = () => {
		setIsWrite((prevWrite) => !prevWrite);
	};

	const deleteTaskHandler = () => {
		props.onDelete(props.id, props.title, props.index);
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
			<Button onClick={deleteTaskHandler} color="danger">
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
			<ModalHeader>
				<React.Fragment>
					{!isWrite && (
						<h2 className={styles.title}>{beforeChange.name}</h2>
					)}
					{isWrite && (
						<input
							type="text"
							id="taskTitle"
							ref={taskName}
							defaultValue={beforeChange.name}
							className={styles.input}
						/>
					)}
					<p className={styles.subtitle}>in {props.columnTitle}</p>
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
						ref={description}
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
				{/* TODO Supply subtasks into SubtaskList */}
				<SubtaskList />
			</ModalBody>

			<ModalFooter>{renderButtons}</ModalFooter>
		</Modal>
	);
}

export default TaskModal;
