const Lesson = require("../models/lesson")

const addLesson = async (req, res) => {
    const { name, teacher } = req.body

    if (!name || !teacher) {
        return res.status(400).json({ message: "All fields are required" })
    }

    try {
        const lesson = await Lesson.create({ name, teacher })
        return res.status(201).json({ message: `Lesson '${lesson.name}' created successfully` })
    } catch (err) {
        return res.status(500).json({ message: "Failed to create lesson", error: err.message })
    }
}

const getById = async (req, res) => {
    const { id } = req.params

    const lesson = await Lesson.findById(id).lean()
    if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" })
    }

    return res.status(200).json(lesson)
}

const getAll = async (req, res) => {
    const lessons = await Lesson.find().lean()
    return res.status(200).json(lessons)
}

const updateLesson = async (req, res) => {
    const { id } = req.params
    const { name, teacher } = req.body

    const lesson = await Lesson.findById(id)
    if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" })
    }

    if (name) lesson.name = name
    if (teacher) lesson.teacher = teacher

    try {
        const updated = await lesson.save()
        return res.status(200).json({ message: `Lesson '${updated.name}' updated` })
    } catch (err) {
        return res.status(500).json({ message: "Failed to update lesson", error: err.message })
    }
}

const deleteById = async (req, res) => {
    const { id } = req.params

    const deleted = await Lesson.findByIdAndDelete(id)
    if (!deleted) {
        return res.status(404).json({ message: "Lesson not found" })
    }

    return res.status(200).json({ message: `Lesson '${deleted.name}' deleted successfully` })
}

module.exports = { addLesson, getById, getAll, updateLesson, deleteById }
