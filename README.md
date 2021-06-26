# OneBoard (Front End)

## About OneBoard

OneBoard is a single-page web application which centralises the user's tasks, schedules and expesnes to improve productivity. 

OneBoard would consist of a dashboard with the supporting features:
- Kanban Board
- Calendar
- Expense Tracker
- Notes

## Frameworks used
- [React](https://reactjs.org/) 
- [Redux](https://redux.js.org/) and [Redux Toolkit](https://github.com/reduxjs/redux-toolkit) to manage application data
- [reactstrap](https://github.com/reactstrap/reactstrap) for UI components
- [ant-design](https://github.com/ant-design/ant-design/) for UI components

## Features
**Completed Features (as of 24 Jun 21)**
- Login / Signup
- Kanban Board
  - (CORE) Create, Update and Deletion of Boards, Columns and Tasks
  - [Drag and Drop Support](https://github.com/atlassian/react-beautiful-dnd) for task and column reordering
  - Task labelling
  - Subtasking within Tasks

- Notes
  - (CORE) Create, Update and Deletion of Notes 
  - Search for tasks by title, description or both

**Upcoming Features**
- Calendar
- Expense Tracker

## Using OneBoard
### On the web
Coming Soon!

### Running OneBoard locally
1. Clone this repository and install the npm packages

```
git clone https://github.com/KwanHW/OneBoard.git
npm install
```

2. Clone the [backend repository](https://github.com/laughingkid-sg/OneBoard-backend)

```
git clone https://github.com/laughingkid-sg/OneBoard-backend.git
npm install
```

3. Run `npm start` for both repositories and you're all set!
