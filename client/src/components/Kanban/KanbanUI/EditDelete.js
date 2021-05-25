import React from 'react';
import { IconContext } from 'react-icons';
import { FaEdit, FaTrash } from 'react-icons/fa';
import styles from './EditDelete.module.css';

/**
 * @param onEdit Handler to edit component
 * @param onDelete Handler to delete component
 */
function EditDelete(props) {
	return (
		<div className={styles.icons}>
			<IconContext.Provider value={{ className: styles.icons }}>
				<FaEdit onClick={props.onEdit} />
				<FaTrash onClick={props.onDelete} className={styles.delete} />
			</IconContext.Provider>
		</div>
	);
}

export default EditDelete;
