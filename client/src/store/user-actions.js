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

export const login = (user) => {
	return async (dispatch) => {
		const postData = async () => {
			const response = await fetch('/api/signin', {
				method: 'POST',
				body: JSON.stringify(user),
				headers: { 'Content-Type': 'application/json' },
			});

			const data = await response.json();

			if (response.ok) {
				return { isSuccess: true, data };
			}

			return { isSuccess: false, errorMsg: data.message };
		};

		try {
			const login = await postData();
			if (!login.isSuccess) {
				throw new Error(login.errorMsg);
			}

			const fetchInfo = await dispatch(
				fetchUserData(login.data.user._id, login.data.token)
			);

			if (!fetchInfo.isSuccess) {
				throw new Error(fetchInfo.errorMsg);
			}

			return '';
		} catch (error) {}
	};
};

export const logout = () => {
	return async (dispatch) => {
		const postData = async () => {
			const response = await fetch('/api/signout', {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			});

			const data = await response.json();
			console.log(data);
			return;
		};

		try {
			await postData();
			dispatch(userActions.logout());
		} catch (error) {}
	};
};
