const Student = require("../models/student");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const { Readable } = require("stream");
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

const getAllClasses = async (req, res) => {
    try {
        // שליפת מספרי הכיתות מתוך אוסף התלמידות
        const students = await Student.find({}, 'classNumber');
        const classNumbers = [...new Set(students.map(student => student.classNumber))];

        console.log('Class numbers fetched from students:', classNumbers); // בדוק את הנתונים
        res.json(classNumbers);
    } catch (error) {
        console.error('Error fetching class numbers from students:', error);
        res.status(500).json({ error: 'Failed to fetch class numbers' });
    }
    console.log('getAllClasses endpoint hit');
};

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

const updateAttendanceForLesson = async (req, res) => {
    const { classNumber, day, lessonId, attendanceUpdates } = req.body;

    if (!classNumber || !day || !lessonId || !attendanceUpdates) {
        return res.status(400).json({ message: "Class number, day, lesson ID, and attendance updates are required" });
    }

    try {
        const students = await Student.find({ classNumber });

        if (!students || students.length === 0) {
            return res.status(404).json({ message: "No students found for this class" });
        }

        for (const update of attendanceUpdates) {
            const student = students.find(s => s.idNumber === update.idNumber);
            if (student) {
                const attendanceDay = student.weeklyAttendance[day] || [];
                const lesson = attendanceDay.find(l => l.lessonId.toString() === lessonId);
                if (lesson) {
                    lesson.status = update.status;
                } else {
                    attendanceDay.push({ lessonId, status: update.status });
                }
                student.weeklyAttendance[day] = attendanceDay;
                await student.save();
            }
        }

        res.status(200).json({ message: "Attendance updated successfully" });
    } catch (err) {
        console.error("Error updating attendance:", err);
        res.status(500).json({ message: "Failed to update attendance", error: err });
    }
};

const getStudentByClassNumber = async (req, res) => {
    const { classNumber } = req.params;

    if (!classNumber) {
        return res.status(400).json({ message: "Class number is required" });
    }

    try {
        const students = await Student.find({ classNumber });
        if (!students || students.length === 0) {
            return res.status(404).json({ message: "No students found for this class" });
        }

        res.status(200).json(students);
    } catch (err) {
        console.error("Error fetching students:", err);
        res.status(500).json({ message: "Failed to fetch students", error: err });
    }
};

const getAttendanceByLesson = async (req, res) => {
    const { classNumber, day, lessonId } = req.params;

    if (!classNumber || !day || !lessonId) {
        return res.status(400).json({ message: "Class number, day, and lesson ID are required" });
    }

    try {
        const students = await Student.find({ classNumber });

        if (!students || students.length === 0) {
            return res.status(404).json({ message: "No students found for this class" });
        }

        const attendanceData = students.map(student => {
            const attendanceDay = student.weeklyAttendance[day] || [];
            const lesson = attendanceDay.find(l => l.lessonId.toString() === lessonId);
            return {
                idNumber: student.idNumber,
                name: student.name,
                status: lesson ? lesson.status : 'Absent'
            };
        });

        res.status(200).json(attendanceData);
    } catch (err) {
        console.error("Error fetching attendance:", err);
        res.status(500).json({ message: "Failed to fetch attendance", error: err });
    }
};

const sendWeeklyAttendanceEmails = async (req, res) => {
    try {
        const students = await Student.find({ active: true });

        // הגדרת טרנספורטר (הכניסי פרטי SMTP אמיתיים)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        for (const student of students) {
            // יצירת PDF בזיכרון
            const doc = new PDFDocument({ margin: 30, size: 'A4' });
            let buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', async () => {
                const pdfData = Buffer.concat(buffers);

                // שליחת המייל
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: student.parentEmail,
                    subject: `דו"ח נוכחות שבועי עבור ${student.name}`,
                    text: `שלום,\nמצורף קובץ PDF עם סיכום הנוכחות השבועי של בתך ${student.name}.`,
                    attachments: [
                        {
                            filename: `attendance_${student.name}.pdf`,
                            content: pdfData
                        }
                    ]
                });
            });

            // כותרת
            doc.fontSize(18).text(`דו"ח נוכחות שבועי - ${student.name}`, { align: 'right' });
            doc.moveDown();

            // טבלה
            doc.fontSize(14);
            const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'];
            const daysHeb = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי'];
            doc.text('יום', 450, doc.y, { continued: true });
            doc.text('שיעור', 350, doc.y, { continued: true });
            doc.text('סטטוס', 250, doc.y);
            doc.moveDown(0.5);

            days.forEach((day, i) => {
                const lessons = student.weeklyAttendance?.[day] || [];
                if (lessons.length === 0) {
                    doc.text(daysHeb[i], 450, doc.y, { continued: true });
                    doc.text('-', 350, doc.y, { continued: true });
                    doc.text('לא נרשמה נוכחות', 250, doc.y);
                } else {
                    lessons.forEach((lesson, idx) => {
                        doc.text(daysHeb[i], 450, doc.y, { continued: true });
                        doc.text(`${idx + 1}`, 350, doc.y, { continued: true });
                        let status = lesson.status === 'Present' ? 'נוכחת' : lesson.status === 'Late' ? 'איחרה' : 'חסרה';
                        doc.text(status, 250, doc.y);
                    });
                }
                doc.moveDown(0.5);
            });

            doc.end();
            // המתן לסיום יצירת ה-PDF לפני המשך הלולאה
            await new Promise(resolve => doc.on('end', resolve));
        }

        res.json({ message: "המיילים נשלחו בהצלחה" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "שגיאה בשליחת המיילים" });
    }
};

module.exports = { addStudent, getById, getAll, updateStudent, updateActive, deleteById, getAllClasses, updateAttendanceForLesson, getStudentByClassNumber, getAttendanceByLesson, sendWeeklyAttendanceEmails }
