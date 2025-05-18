const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    idNumber: {
        type: String,
        required: true,
        unique: true
    },
    active: {
        type: Boolean,
        default: true
    },
    parentEmail: {
        type: String,
        required: true,
        lowercase: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Invalid email format']
    },
    classNumber: {
        type: Number,
        required: true
    },
    weeklyAttendance: {
        type: {
            sunday: [{ 
                lessonId: mongoose.Schema.Types.ObjectId, 
                status: { 
                    type: String, 
                    enum: ['Present', 'Late', 'Absent'], 
                    default: 'Absent' 
                } 
            }],
            monday: [{ 
                lessonId: mongoose.Schema.Types.ObjectId, 
                status: { 
                    type: String, 
                    enum: ['Present', 'Late', 'Absent'], 
                    default: 'Absent' 
                } 
            }],
            tuesday: [{ 
                lessonId: mongoose.Schema.Types.ObjectId, 
                status: { 
                    type: String, 
                    enum: ['Present', 'Late', 'Absent'], 
                    default: 'Absent' 
                } 
            }],
            wednesday: [{ 
                lessonId: mongoose.Schema.Types.ObjectId, 
                status: { 
                    type: String, 
                    enum: ['Present', 'Late', 'Absent'], 
                    default: 'Absent' 
                } 
            }],
            thursday: [{ 
                lessonId: mongoose.Schema.Types.ObjectId, 
                status: { 
                    type: String, 
                    enum: ['Present', 'Late', 'Absent'], 
                    default: 'Absent' 
                } 
            }]
        },
        default: {
            sunday: [],
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: []
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);