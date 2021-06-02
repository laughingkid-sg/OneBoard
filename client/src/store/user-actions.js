import { userActions } from './user';

export const fetchUserData = (id, token) => {
	return async (dispatch) => {
		const fetchData = async () => {
			const response = await fetch(`/api/secret/${id}`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				throw new Error('Could not fetch user data!');
			}

			const data = await response.json();

			return data;
		};

		try {
			const userData = await fetchData();
			dispatch(
				userActions.login({
					id: userData.user._id,
					token,
					firstName: userData.user.firstName,
					lastName: userData.user.lastName,
					email: userData.user.email,
					boards: userData.user.boards,
				})
			);

			return { isSuccess: true };
		} catch (error) {
			return { isSuccess: false, errorMsg: error.message };
		}
	};
};
