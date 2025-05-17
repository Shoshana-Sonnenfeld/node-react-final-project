const express = require("express")
const router = express.Router()
const verifyJWT = require('../middleware/verifyJWT')
const WeeklyScheduleController = require("../controllers/weeklyScheduleControlle")

router.post("/createSchedule", verifyJWT, WeeklyScheduleController.createSchedule)
router.get("/daySchedule", verifyJWT, WeeklyScheduleController.oneDaySchedule)
router.get("/getSchedule", verifyJWT, WeeklyScheduleController.getSchedule)
router.put("/updateSchedule", verifyJWT, WeeklyScheduleController.updateSchedule)
router.put("/updateOneDaySchedule", verifyJWT, WeeklyScheduleController.updateOneDaySchedule)
router.delete("/deleteSchedule", verifyJWT, WeeklyScheduleController.deleteSchedule)

module.exports = router
