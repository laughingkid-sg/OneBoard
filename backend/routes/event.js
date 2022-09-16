const express = require("express")
const router = express.Router()

const {
	createEvent,
	getEvents,
	getEvent,
	updateEvent,
	delEvent,
	eventById,
	updateFeatured,
	removeFeatured,
} = require("../controllers/event")
const { requireSignin, isAuth } = require("../controllers/auth")
const { setUser } = require("../controllers/user")

router.use(requireSignin, isAuth, setUser)

router.route("/").get(getEvents).post(createEvent).delete(removeFeatured)

router
	.route("/:eventId/")
	.get(getEvent)
	.post(updateFeatured)
	.put(updateEvent)
	.delete(delEvent)

router.param("eventId", eventById)

module.exports = router
