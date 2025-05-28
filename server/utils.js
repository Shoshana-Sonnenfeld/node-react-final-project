const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const Student = require("./models/student"); 
const pLimitImport = async () => (await import('p-limit')).default;

async function sendWeeklyAttendanceEmails() {
    try {
        const pLimit = await pLimitImport();
        const limit = pLimit(5);

        const students = await Student.find({ active: true });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

        const sendMailForStudent = (student) => {
            return new Promise((resolve, reject) => {
                const doc = new PDFDocument({ margin: 50 });
                let buffers = [];
                doc.on('data', buffers.push.bind(buffers));

                const attendance = student.weeklyAttendance || {};
                const maxLessons = Math.max(...days.map(day =>
                    (attendance[day.toLowerCase()] || []).length
                ));

                doc.font('Helvetica-Bold')
                    .fontSize(18)
                    .text(`Weekly Attendance Report - ${student.name}`, { align: 'left' });
                doc.moveDown();

                const startX = 50;
                const columnWidth = 90;
                let y = doc.y;

                doc.font('Helvetica-Bold').fontSize(12);
                doc.text('Lesson #', startX, y, { width: columnWidth, align: 'center' });
                days.forEach((day, i) => {
                    doc.text(day, startX + columnWidth * (i + 1), y, { width: columnWidth, align: 'center' });
                });

                for (let i = 0; i < maxLessons; i++) {
                    y += 20;
                    doc.font('Helvetica-Bold').text(`${i + 1}`, startX, y, {
                        width: columnWidth,
                        align: 'center'
                    });

                    days.forEach((day, j) => {
                        const status = attendance[day.toLowerCase()]?.[i]?.status || '';
                        doc.font('Helvetica')
                            .text(status, startX + columnWidth * (j + 1), y, {
                                width: columnWidth,
                                align: 'center'
                            });
                    });
                }

                doc.end();

                doc.on('end', async () => {
                    const pdfData = Buffer.concat(buffers);
                    try {
                        await transporter.sendMail({
                            from: process.env.EMAIL_USER,
                            to: student.parentEmail,
                            subject: `Attendance Report for ${student.name}`,
                            text: `Hi,\n\nAttached is your daughter's attendance for the week.\n\nThank you.`,
                            attachments: [
                                {
                                    filename: `attendance_${student.name}.pdf`,
                                    content: pdfData
                                }
                            ]
                        });
                        resolve();
                    } catch (err) {
                        reject(err);
                    }
                });
            });
        };

        await Promise.all(
            students.map(student => limit(() => sendMailForStudent(student)))
        );

        return { message: "Emails sent successfully!" };

    } catch (err) {
        console.error(err);
        throw new Error(err.message || "Error sending emails");
    }
}

function isValidId(id) {
    if (id.length !== 9 || !/^\d+$/.test(id)) {
        return false;
    }
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        let digit = parseInt(id[i])
        if (i % 2 === 1) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        sum += digit;
    }

    return sum % 10 === 0;
}

const resetWeeklyAttendance = async () => {
    try {
        await Student.updateMany({}, {
            $set: {
                weeklyAttendance: {
                    sunday: [],
                    monday: [],
                    tuesday: [],
                    wednesday: [],
                    thursday: []
                }
            }
        });
        console.log('Weekly attendance reset successfully.');
    } catch (err) {
        console.error('Error resetting weekly attendance:', err);
    }
};

module.exports = { isValidId, resetWeeklyAttendance, sendWeeklyAttendanceEmails };