// const express = require("express")
// const router = express.Router()
// const verifyJWT = require('../middleware/verifyJWT')
// const Student = require("../controllers/studentController")


// router.post("/addStudent", verifyJWT, Student.addStudent)
// router.get("/getStudentById/:id", verifyJWT, Student.getById)
// router.get("/getAllStudents", verifyJWT, Student.getAll)
// router.get("/getAllClasses", verifyJWT, Student.getAllClasses)

// router.put("/updateAttendanceForLesson", verifyJWT, Student.updateAttendanceForLesson)
// router.put("/updateStudent/:id", verifyJWT, Student.updateStudent)
// router.put("/changeActive/:id", verifyJWT, Student.updateActive)
// router.delete("/deleteStudent/:id", verifyJWT, Student.deleteById)

// module.exports = router


const express = require("express")
const router = express.Router()
const verifyJWT = require('../middleware/verifyJWT')
const Student = require("../controllers/studentController")

router.post("/addStudent", verifyJWT, Student.addStudent)
router.get("/getStudentById/:id", verifyJWT, Student.getById)
router.get("/getAllStudents", verifyJWT, Student.getAll)
router.put("/updateStudent/:id", verifyJWT, Student.updateStudent)
router.put("/changeActive/:id", verifyJWT, Student.updateActive)
router.delete("/deleteStudent/:id", verifyJWT, Student.deleteById)
router.get("/getAllClasses", verifyJWT, Student.getAllClasses);
router.put("/updateAttendance", verifyJWT, Student.updateAttendanceForLesson);
router.get("/getStudentByClassNumber/:classNumber", verifyJWT, Student.getStudentByClassNumber)
router.get("/getAttendanceByLesson/:classNumber/:day/:lessonId", verifyJWT, Student.getAttendanceByLesson)

module.exports = router

module.exports = { addStudent, getById, getAll, updateStudent, updateActive, deleteById, getAllClasses, updateAttendanceForLesson, getStudentByClassNumber }
