import React from 'react';
import * as AiIcons from 'react-icons/ai';
import * as FaIcons from 'react-icons/fa';
import { RiLogoutBoxRFill } from 'react-icons/ri';

export const SidebarData = [
	{
		title: 'Home',
		path: '/',
		icon: <AiIcons.AiFillHome />,
	},
	{
		title: 'Tasks',
		path: '/tasks',
		icon: <FaIcons.FaTasks />,
	},
	{
		title: 'Calendar',
		path: '/calendar',
		icon: <FaIcons.FaCalendar />,
	},
	{
		title: 'Expenses',
		path: '/expenses',
		icon: <FaIcons.FaWallet />,
	},
	{
		title: 'Notes',
		path: '/notes',
		icon: <FaIcons.FaStickyNote />,
	},
	// TODO Insert classnames for last 2 buttons (at the bottom)
	{
		title: 'Edit Profile',
		path: '/profile',
		icon: <FaIcons.FaUser />,
	},
	{
		title: 'Logout',
		path: '/',
		icon: <RiLogoutBoxRFill />,
	},
];
