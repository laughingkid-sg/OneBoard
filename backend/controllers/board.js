const Board = require("../models/board")
const User = require("../models/user")
const Column = require("../models/column")
const Task = require("../models/task")
const ObjectId = require("mongodb").ObjectID

// Board By Id
exports.boardById = (req, res, next, id) => {
	if (!ObjectId.isValid(id)) {
		res.status(400).json({
			message: "Invalid Object Id",
		})
	}
	Board.findById(id)
		.populate({ path: "columns", populate: { path: "tasks", model: "Task" } })
		.exec((err, board) => {
			if (err) {
				res.status(500).json({
					message: err.message,
				})
			} else if (!board) {
				res.status(404).json({
					message: "Board not found",
				})
			} else {
				req.board = board
				next()
			}
		})
}

// Get Single Board
exports.getBoard = (req, res) => {
	User.findOne({
		boards: {
			$elemMatch: {
				$eq: ObjectId(req.board._id),
			},
		},
	}).exec((err, user) => {
		if (err) {
			res.status(500).json({
				message: err.message,
			})
		} else if (!user) {
			res.status(404).json({
				message: "Board not found",
			})
		} else if (user._id != req.auth._id) {
			res.status(403).json({
				message: "Insufficient permission",
			})
		} else {
			res.json(req.board)
		}
	})
}

// Create Board
exports.createBoard = async (req, res) => {
	try {
		let board = new Board(req.body)
		await board.validate(req.body)

		board = await board.save(req.body)

		await User.findByIdAndUpdate(
			req.auth._id,
			{
				$push: {
					boards: board._id,
				},
			},
			{
				new: true,
				upsert: true,
			}
		)

		let todo = await new Column({
			name: "To-Do",
			order: 0,
			board_id: board._id,
		}).save()

		let inprogress = await new Column({
			name: "In Progress",
			order: 1,
			board_id: board._id,
		}).save()
		let done = await new Column({
			name: "Done",
			order: 2,
			board_id: board._id,
		}).save()
		await Board.findByIdAndUpdate(
			board._id,
			{
				$push: {
					columns: [todo._id, inprogress._id, done._id],
				},
			},
			{
				upsert: true,
			}
		)

		let example_task = await new Task({
			name: "Example Task",
			order: 0,
			labelType: "info",
			expireAt: new Date(),
		}).save()

		await Column.findByIdAndUpdate(
			todo._id,
			{
				$push: {
					tasks: [example_task._id],
				},
			},
			{
				upsert: true,
			}
		)
		if (req.body.newUser) {
			const user = req.user
			console.log(user)
			req.user.boards = [board._id]
			res.json(user)
		} else {
			res.status(200).json(board)
		}
	} catch (err) {
		res.status(500).json({
			message: err.message,
		})
	}
}

// Update Board
exports.updateBoard = async (req, res, next) => {
	try {
		if (
			req.profile.boards.some((board) => {
				return board.equals(req.board._id)
			})
		) {
			req.body._id = req.board._id
			let board = new Board(req.body)
			await board.validate(req.body)
			board = await Board.findByIdAndUpdate(
				req.board._id,
				{ $set: req.body },
				{ new: true }
			)
			res.status(200).json(board)
		} else {
			res.status(403).json({
				message: "Insufficient permission",
			})
		}
	} catch (err) {
		res.status(500).json({
			message: err.message,
		})
	}
}

// Delete Board
exports.delBoard = async (req, res) => {
	try {
		if (
			req.profile.boards.some((board) => {
				return board.equals(req.board._id)
			})
		) {
			let columns = await Board.findById(req.board._id, { columns: 1, _id: 0 })
			columns["columns"].forEach(async (column_id) => {
				// Delete column's tasks.
				let tasks = await Column.findById(column_id, { tasks: 1, _id: 0 })
				tasks["tasks"].forEach(async (task_id) => {
					await Task.findByIdAndDelete(task_id)
				})
				await Column.findByIdAndDelete(column_id)
			})
			let deletedProject = await Board.deleteOne({ _id: req.board._id })
			if (deletedProject.deletedCount && deletedProject.deletedCount > 0) {
				await User.findByIdAndUpdate(
					req.profile._id,
					{ $pull: { projects: req.board._id } },
					{ new: true, upsert: true }
				)
				res.status(200).json(deletedProject)
			}
		} else {
			res.status(403).json({
				message: "Insufficient permission",
			})
		}
	} catch (err) {
		res.status(500).json({
			message: err.message,
		})
	}
}

// Get Boards
exports.getBoards = async (req, res) => {
	User.findById(req.auth._id)
		.populate({
			path: "boards",
			populate: {
				path: "columns",
				model: "Column",
				populate: { path: "tasks", model: "Task" },
			},
		})
		.exec((err, user) => {
			if (!user) {
				return res.status(404).json({
					message: "User not found",
				})
			} else if (err) {
				res.status(500).json(err.message)
			} else {
				res.json(user.boards)
			}
		})
}
