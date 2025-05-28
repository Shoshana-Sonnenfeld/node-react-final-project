const WeeklySchedule = require('../models/weeklySchedule');

const createSchedule = async (req, res) => {
    const { classNumber } = req.body;

    if (!classNumber) {
        return res.status(400).json({ message: 'Class number is required' });
    }

    try {
        const schedule = await WeeklySchedule.create({ classNumber });
        return res.status(201).json(schedule);
    } catch (err) {
        console.error('Error creating schedule:', err);
        return res.status(500).json({ message: 'Failed to create schedule' });
    }
};

const getScheduleByClassNumber = async (req, res) => {
    const { classNumber } = req.params;

    try {
        const schedule = await WeeklySchedule.findOne({ classNumber })
            .populate('sunday.lessons')
            .populate('monday.lessons')
            .populate('tuesday.lessons')
            .populate('wednesday.lessons')
            .populate('thursday.lessons');

        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        return res.status(200).json(schedule);
    } catch (err) {
        console.error('Error fetching schedule:', err);
        return res.status(500).json({ message: 'Failed to get schedule' });
    }
};

const getSchedule = async (req, res) => {
    const { classNumber } = req.query;

    if (!classNumber) {
        return res.status(400).json({ message: 'Class number is required' });
    }

    try {
        const schedule = await WeeklySchedule.findOne({ classNumber })
            .populate('sunday.lessons')
            .populate('monday.lessons')
            .populate('tuesday.lessons')
            .populate('wednesday.lessons')
            .populate('thursday.lessons');

        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        return res.status(200).json(schedule);
    } catch (err) {
        console.error('Error fetching schedule:', err);
        return res.status(500).json({ message: 'Failed to get schedule' });
    }
};

const updateSchedule = async (req, res) => {
    const { classNumber, scheduleUpdates } = req.body;

    if (!classNumber || !scheduleUpdates) {
        return res.status(400).json({ message: 'Class number and updates are required' });
    }

    try {
        const schedule = await WeeklySchedule.findOne({ classNumber });

        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        Object.entries(scheduleUpdates).forEach(([day, data]) => {
            if (schedule[day]) {
                schedule[day].lessons = data.lessons;
            }
        });

        await schedule.save();
        return res.status(200).json({ message: 'Schedule updated' });
    } catch (err) {
        console.error('Error updating schedule:', err);
        return res.status(500).json({ message: 'Update failed' });
    }
};

const updateOneDaySchedule = async (req, res) => {
    const { classNumber, day, lessons } = req.body;

    if (!classNumber || !day || !lessons) {
        return res.status(400).json({ message: 'Class number, day and lessons are required' });
    }

    try {
        const schedule = await WeeklySchedule.findOne({ classNumber });

        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        schedule[day].lessons = lessons;
        await schedule.save();

        return res.status(200).json({ message: 'Day schedule updated' });
    } catch (err) {
        console.error('Error updating day schedule:', err);
        return res.status(500).json({ message: 'Update failed' });
    }
};

const updateLessonInSchedule = async (req, res) => {
    console.log('updateLessonInSchedule lesson in schedule:');
    const { classNumber, day, lessonIndex, lessonId } = req.body;

    if (!classNumber || !day || lessonIndex === undefined || !lessonId) {
        return res.status(400).json({ message: 'classNumber, day, lessonIndex, and lessonId are required' });
    }

    try {
        const schedule = await WeeklySchedule.findOne({ classNumber });

        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        if (!schedule[day] || !Array.isArray(schedule[day].lessons)) {
            schedule[day] = { lessons: [] };
        }

        while (schedule[day].lessons.length <= lessonIndex) {
            schedule[day].lessons.push(null);
        }

        schedule[day].lessons[lessonIndex] = lessonId;

        await schedule.save();
        return res.status(200).json({ message: 'Lesson updated in schedule' });
    } catch (err) {
        console.error('Error updating lesson:', err);
        return res.status(500).json({ message: 'Update failed' });
    }
};

const deleteSchedule = async (req, res) => {
    const { classNumber } = req.body;

    if (!classNumber) {
        return res.status(400).json({ message: 'Class number is required' });
    }

    try {
        const result = await WeeklySchedule.deleteOne({ classNumber });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        return res.status(200).json({ message: 'Schedule deleted' });
    } catch (err) {
        console.error('Error deleting schedule:', err);
        return res.status(500).json({ message: 'Deletion failed' });
    }
};

module.exports = {
    createSchedule,
    getSchedule,
    updateSchedule,
    updateOneDaySchedule,
    updateLessonInSchedule,
    deleteSchedule,
    getScheduleByClassNumber
};
