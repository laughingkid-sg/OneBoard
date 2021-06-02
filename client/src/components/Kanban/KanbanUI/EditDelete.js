import React from 'react';
import { IconContext } from 'react-icons';
import { FaEdit, FaTrash } from 'react-icons/fa';
import styles from './EditDelete.module.css';

function EditDelete(props) {
	return (
		<div className={`${styles.icons} ${props.className}`}>
			<IconContext.Provider value={{ className: styles.icons }}>
				<FaEdit onClick={props.onEdit} />
				<FaTrash onClick={props.onDelete} className={styles.delete} />
			</IconContext.Provider>
		</div>
	);
}

export default EditDelete;
