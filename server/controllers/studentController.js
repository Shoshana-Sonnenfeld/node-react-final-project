const Student = require("../models/student")
const { isValidId } = require("../utils")

const addStudent = async (req, res) => {
    const { name, idNumber, parentEmail, classNumber } = req.body

    if (!name || !idNumber || !parentEmail || !classNumber) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    if (!isValidId(idNumber)) {
        return res.status(400).json({ message: 'Invalid ID number format' })
    }

    const duplicate = await Student.findOne({ idNumber }).lean()
    if (duplicate) {
        return res.status(409).json({ message: "Student with this ID already exists" })
    }

    try {
        const student = await Student.create({ name, idNumber, parentEmail, classNumber })
        res.status(201).json(student)
    } catch (error) {
        res.status(500).json({ message: 'Failed to create student', error })
    }
}

const getById = async (req, res) => {
    const { id } = req.params

    try {
        const student = await Student.findById(id)
        if (!student) return res.status(404).json({ message: "Student not found" })
        res.status(200).json(student)
    } catch (error) {
        res.status(500).json({ message: 'Failed to get student', error })
    }
}

const getAll = async (req, res) => {
    try {
        const students = await Student.find().lean()
        res.status(200).json(students)
    } catch (error) {
        res.status(500).json({ message: 'Failed to get students', error })
    }
}

const updateStudent = async (req, res) => {
    const { id } = req.params
    const { name, idNumber, parentEmail, classNumber } = req.body

    if (!name || !idNumber || !parentEmail || !classNumber) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    if (!isValidId(idNumber)) {
        return res.status(400).json({ message: 'Invalid ID number format' })
    }

    try {
        const student = await Student.findByIdAndUpdate(id, { name, idNumber, parentEmail, classNumber }, { new: true })
        if (!student) return res.status(404).json({ message: "Student not found" })
        res.status(200).json(student)
    } catch (error) {
        res.status(500).json({ message: 'Failed to update student', error })
    }
}

const updateActive = async (req, res) => {
    const { id } = req.params

    try {
        const student = await Student.findById(id)
        if (!student) return res.status(404).json({ message: "Student not found" })

        student.active = !student.active
        await student.save()

        res.status(200).json({ message: `Active status changed to ${student.active}`, student })
    } catch (error) {
        res.status(500).json({ message: 'Failed to toggle active status', error })
    }
}

const deleteById = async (req, res) => {
    const { id } = req.params

    try {
        const student = await Student.findByIdAndDelete(id)
        if (!student) return res.status(404).json({ message: "Student not found" })
        res.status(200).json({ message: "Student deleted" })
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete student', error })
    }
}

module.exports = { addStudent, getById, getAll, updateStudent, updateActive, deleteById }
