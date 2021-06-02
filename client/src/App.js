import React, { useContext, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import styles from './App.module.css';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Login/Register';
import { ComingSoon, Home, KanbanBoard } from './pages';
import ModalContext from './store/ModalContext';
import AuthContext from './store/AuthContext';
import { userActions } from './store/user';
import { kanbanActions } from './store/kanban';
import { fetchUserData } from './store/user-actions';

function App() {
	const dispatch = useDispatch();
	const [cookies] = useCookies(['t', 'id']);
	const { t: token, id } = cookies;
	const authContext = useContext(AuthContext);
	const modalContext = useContext(ModalContext);
	const isLoggedIn = authContext.isLoggedIn;

	useEffect(() => {
		if (token) {
			authContext.login(token);
			dispatch(fetchUserData(id, token));
			return;
		}
		if (!isLoggedIn && !token) {
			dispatch(userActions.logout());
			dispatch(kanbanActions.resetBoard());
		}
	}, [dispatch, token]);

	const showRoutes = (
		<React.Fragment>
			<Route path="/" exact>
				{isLoggedIn ? <Home /> : <Login />}
			</Route>
			<Route path="/register">
				{isLoggedIn ? <Register /> : <Redirect to="/" />}
			</Route>
			<Route path="/tasks">
				{isLoggedIn ? <KanbanBoard /> : <Redirect to="/" />}
			</Route>
			<Route path={['/calendar', '/notes', '/profile']}>
				{isLoggedIn ? <ComingSoon /> : <Redirect to="/" />}
			</Route>
		</React.Fragment>
	);

	return (
		<div className={styles.app}>
			{modalContext.isVisible && modalContext.modal}
			<Router>
				{isLoggedIn && <Switch>{showRoutes}</Switch>}
				{!isLoggedIn && <Switch>{showRoutes}</Switch>}
			</Router>
		</div>
	);
}

export default App;
