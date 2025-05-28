const mongoose = require("mongoose")

const weeklyScheduleSchema = new mongoose.Schema({
    classNumber: {
        type: Number,
        required: true
    },
    sunday: {
        lessons: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lesson'
        }]
    },
    monday: {
        lessons: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lesson'
        }]
    },
    tuesday: {
        lessons: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lesson'
        }]
    },
    wednesday: {
        lessons: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lesson' 
        }]
    },
    thursday: {
        lessons: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lesson'
        }]
    }
});

module.exports = mongoose.model('WeeklySchedule', weeklyScheduleSchema);
