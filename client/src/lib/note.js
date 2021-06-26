export function createNote(note) {
	const { _id, name, description } = note;
	return { _id, name, description };
}
