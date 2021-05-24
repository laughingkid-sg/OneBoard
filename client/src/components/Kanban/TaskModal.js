import React, {useState} from 'react';
import Modal from '../../UI/Modal';
import styles from './TaskModal.module.css';
import { AiOutlineClose } from 'react-icons/ai';

function TaskModal(props) {
	const [isWrite, setIsWrite] = useState( props.write || false );

	return (
		<Modal onClose={props.onClose}>
			<div className={styles.container}>
				<AiOutlineClose
					onClick={props.onClose}
					className={styles.close}
				/>

				<div className={styles.taskinfo}>
					<h2 className={styles.title}>{props.title}</h2>
					<p className={styles.subtitle}>in {props.columnTitle}</p>
				</div>

				<div className={styles.taskinfo}>
					<h3 className={styles.header}>Description</h3>
					<p className={styles.description}>{props.description}</p>
				</div>

				{/* Labels */}
				{/* <h3>Labels</h3> */}

				{/* Subtasks */}
				{/* <h3>Subtasks</h3> */}

                {/* Some button badges to edit or remove task? */}
			</div>
		</Modal>
	);
}

export default TaskModal;
