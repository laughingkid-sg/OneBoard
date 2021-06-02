import React, { useContext, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import styles from './App.module.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Board from './components/Kanban/Board';
import Login from './components/Login/Login';
import Register from './components/Login/Register';
import Dashboard from './components/Dashboard/Dashboard';
import MainLayout from './Layout/MainLayout';
import ComingSoon from './pages/ComingSoon';
import AuthContext from './store/AuthContext';
import { userActions } from './store/user';
import { fetchUserData } from './store/user-actions';

function App() {
	const dispatch = useDispatch();
	const [cookies] = useCookies(['t', 'id']);
	const { t: token, id } = cookies;
	const authContext = useContext(AuthContext);
	const isLoggedIn = authContext.isLoggedIn;

	useEffect(() => {
		if (token) {
			authContext.login(token);
			dispatch(fetchUserData(id, token));
			return;
		}
		if (!isLoggedIn && !token) {
			dispatch(userActions.logout());
		}
	}, [dispatch, token]);

	// useEffect(() => {
	// 	if (!isLoggedIn && !!token) {
	// 		console.log('No token and not logged in');
	// 		dispatch(userActions.logout());
	// 	}
	// }, [dispatch, isLoggedIn, token]);

	// TODO could be in another file?
	const showRoutes = isLoggedIn ? (
		<React.Fragment>
			<MainLayout>
				<Route path="/" exact>
					<Dashboard />
				</Route>
				<Route path="/tasks">
					<div className={styles.container}>
						<Board />
					</div>
				</Route>
				<Route path="/calendar" component={ComingSoon} />
				<Route path="/expenses" component={ComingSoon} />
				<Route path="/notes" component={ComingSoon} />
			</MainLayout>
		</React.Fragment>
	) : (
		<React.Fragment>
			<Route path="/" exact>
				<Login />
			</Route>
			<Route path="/register" component={Register} />
		</React.Fragment>
	);

	return (
		<div className={styles.app}>
			<Router>
				<Switch>{showRoutes}</Switch>
			</Router>
		</div>
	);
}

export default App;
