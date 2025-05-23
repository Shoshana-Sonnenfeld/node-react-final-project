const WeeklySchedule = require('../models/weeklySchedule');
const Lesson = require('../models/lesson');

const createSchedule = async (req, res) => {
    const { classNumber } = req.body;

    if (!classNumber) {
        return res.status(400).json({ message: 'Class number is required' });
    }

    try {
        const emptyLessons = Array(8).fill(null);
        const schedule = await WeeklySchedule.create({
            classNumber,
            sunday: { lessons: [...emptyLessons] },
            monday: { lessons: [...emptyLessons] },
            tuesday: { lessons: [...emptyLessons] },
            wednesday: { lessons: [...emptyLessons] },
            thursday: { lessons: [...emptyLessons] }
        });
        return res.status(201).json(schedule);
    } catch (err) {
        return res.status(500).json({ message: 'Failed to create schedule', error: err });
    }
};

const getScheduleByClassNumber = async (req, res) => {
    const { classNumber } = req.params;
    try {
        let schedule = await WeeklySchedule.findOne({ classNumber })
            .populate('sunday.lessons')
            .populate('monday.lessons')
            .populate('tuesday.lessons')
            .populate('wednesday.lessons')
            .populate('thursday.lessons');

        if (!schedule) {
            const emptyLessons = Array(8).fill(null);
            schedule = await WeeklySchedule.create({
                classNumber,
                sunday: { lessons: [...emptyLessons] },
                monday: { lessons: [...emptyLessons] },
                tuesday: { lessons: [...emptyLessons] },
                wednesday: { lessons: [...emptyLessons] },
                thursday: { lessons: [...emptyLessons] }
            });
            schedule = await WeeklySchedule.findOne({ classNumber })
                .populate('sunday.lessons')
                .populate('monday.lessons')
                .populate('tuesday.lessons')
                .populate('wednesday.lessons')
                .populate('thursday.lessons');
        }

        res.status(200).json(schedule);
    } catch (err) {
        console.error('Error fetching schedule:', err);
        return res.status(500).json({ message: 'Failed to get schedule', error: err });
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
        return res.status(500).json({ message: 'Failed to get schedule', error: err });
    }
};

const oneDaySchedule = async (req, res) => {
    const { classNumber, day } = req.query;

    if (!classNumber || !day) {
        return res.status(400).json({ message: 'Class number and day are required' });
    }

    try {
        const schedule = await WeeklySchedule.findOne({ classNumber }).populate(`${day}.lessons`);
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        return res.status(200).json(schedule[day]);
    } catch (err) {
        return res.status(500).json({ message: 'Failed to get day schedule', error: err });
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

        console.log('Before update:', schedule); // לוג לפני העדכון

        Object.entries(scheduleUpdates).forEach(([day, data]) => {
            if (schedule[day]) {
                schedule[day].lessons = data.lessons;
            }
        });

        await schedule.save();

        console.log('After update:', schedule); // לוג אחרי העדכון

        return res.status(200).json({ message: 'Schedule updated' });
    } catch (err) {
        console.error('Update schedule error:', err); // הוסיפי שורה זו
        return res.status(500).json({ message: 'Update failed', error: err });
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
        return res.status(500).json({ message: 'Update failed', error: err });
    }
};

const updateLessonInSchedule = async (req, res) => {
    const { classNumber, day, lessonIndex, lessonId } = req.body;

    if (!classNumber || !day || lessonIndex === undefined || !lessonId) {
        return res.status(400).json({ message: 'classNumber, day, lessonIndex, and lessonId are required' });
    }

    try {
        const weeklySchedule = await WeeklySchedule.findOne({ classNumber });
        if (!weeklySchedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        // ודא שיש מערך שיעורים ליום הזה
        if (!weeklySchedule[day] || !Array.isArray(weeklySchedule[day].lessons)) {
            weeklySchedule[day] = { lessons: [] };
        }

        // הרחב את המערך אם צריך
        while (weeklySchedule[day].lessons.length <= lessonIndex) {
            weeklySchedule[day].lessons.push(null);
        }

        // עדכן את השיעור במקום הנכון
        weeklySchedule[day].lessons[lessonIndex] = lessonId;

        await weeklySchedule.save();
        res.status(200).json({ message: 'Lesson updated in schedule' });
    } catch (err) {
        console.error('Update single lesson error:', err);
        res.status(500).json({ message: 'Update failed', error: err });
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
        return res.status(500).json({ message: 'Deletion failed', error: err });
    }
};

module.exports = { createSchedule, getSchedule, oneDaySchedule, updateSchedule, updateOneDaySchedule, updateLessonInSchedule, deleteSchedule, getScheduleByClassNumber };
