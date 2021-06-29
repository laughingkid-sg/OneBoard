import { useSelector } from 'react-redux';
import { Badge } from 'reactstrap';

const LabelBar = (props) => {
	const { labels } = props;
	const boardLabels = useSelector((state) => state.kanban.labels).filter(
		(label) => label._id && labels.includes(label._id)
	);

	if (!labels) return null;

	return (
		<div className="my-1">
			{boardLabels.map((label) => (
				<Badge className={`bg-${label.type}`} key={label}>
					{label.name}
				</Badge>
			))}
		</div>
	);
};

export default LabelBar;
