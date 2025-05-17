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

module.exports = router