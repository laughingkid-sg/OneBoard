import React from 'react';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as FaIcons from 'react-icons/fa';
import {} from 'react-icons/io';

export const SidebarData = [
	{
		title: 'Home',
		path: '/',
		icon: <AiIcons.AiFillHome />,
		className: 'nav-text',
	},
	{
		title: 'Reports',
		path: '/reports',
		icon: <IoIcons.IoIosPaper />,
		className: 'nav-text',
	},
	{
		title: 'Products',
		path: '/products',
		icon: <FaIcons.FaCartPlus />,
		className: 'nav-text',
	},
	{
		title: 'Team',
		path: '/team',
		icon: <IoIcons.IoMdPeople />,
		className: 'nav-text',
	},
	{
		title: 'Messages',
		path: '/messages',
		icon: <FaIcons.FaEnvelopeOpenText/>,
		className: 'nav-text',
	},
	{
		title: 'Support',
		path: '/support',
		icon: <IoIcons.IoMdHelpCircle/>,
		className: 'nav-text',
	},
];
