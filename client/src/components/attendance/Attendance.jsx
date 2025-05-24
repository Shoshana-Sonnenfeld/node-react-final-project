import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import Axios from 'axios';

const Attendance = () => {
    const [allStudents, setAllStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showDialog, setShowDialog] = useState(false);

    const fetchStudents = async () => {
        const token = localStorage.getItem("token");
        const { data } = await Axios.get('http://localhost:1235/api/student/getAllStudents', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setAllStudents(data);
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleViewAttendance = (student) => {
        setSelectedStudent(student);
        setShowDialog(true);
    };

    const renderAttendanceTable = () => {
        if (!selectedStudent || !selectedStudent.weeklyAttendance) return null;

        // סדר הימים
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'];
        const dayLabels = {
            sunday: 'Sunday',
            monday: 'Monday',
            tuesday: 'Tuesday',
            wednesday: 'Wednesday',
            thursday: 'Thursday'
        };

        // נבנה מערך דו־ממדי: rows = שיעורים (1–8), columns = ימים
        const numLessons = 8;

        return (
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ccc', padding: '8px', background: '#eee' }}>Lesson #</th>
                        {days.map(day => (
                            <th key={day} style={{ border: '1px solid #ccc', padding: '8px', background: '#eee' }}>
                                {dayLabels[day]}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: numLessons }, (_, lessonIdx) => (
                        <tr key={lessonIdx}>
                            <td style={{ border: '1px solid #ccc', padding: '8px', fontWeight: 600 }}>
                                {lessonIdx + 1}
                            </td>
                            {days.map(day => {
                                const lesson = selectedStudent.weeklyAttendance[day]?.[lessonIdx];
                                return (
                                    <td key={day} style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                                        {lesson
                                            ? <>
                                                <div>Lesson: {lesson.lessonName || lesson.name || ''}</div>
                                                <div>Status: {lesson.status}</div>
                                            </>
                                            : <span style={{ color: '#bbb' }}>—</span>
                                        }
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="text-xl text-900 font-bold" style={{ color: '#6A0DAD' }}>Attendance</span>
        </div>
    );

    const footer = `In total there are ${allStudents ? allStudents.length : 0} students.`;

    const purpleColor = '#542468';

    const buttonStyle = {
        backgroundColor: purpleColor,
        borderColor: purpleColor,
        color: '#FFFFFF',
    };

    const handleSendWeeklyAttendanceEmails = async () => {
        try {
            const token = localStorage.getItem("token");
            await Axios.post(
                'http://localhost:1235/api/student/sendWeeklyAttendanceEmails',
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("המיילים נשלחו בהצלחה לכל ההורים!");
        } catch (error) {
            alert("אירעה שגיאה בשליחת המיילים.");
            console.error(error);
        }
    };

    return (
        <div className="card" style={{ backgroundColor: '#F4F4F4' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                <Button
                    label="שלח נוכחות שבועית לכל ההורים"
                    icon="pi pi-send"
                    style={{ backgroundColor: '#542468', borderColor: '#542468', color: '#fff', marginBottom: '1rem' }}
                    onClick={handleSendWeeklyAttendanceEmails}
                />
            </div>
            <DataTable
                value={allStudents}
                header={header}
                footer={footer}
                tableStyle={{ minWidth: '60rem' }}
                style={{ backgroundColor: '#FFFFFF' }}
            >
                <Column field="name" header="Name" />
                <Column field="idNumber" header="ID Number" />
                <Column field="classNumber" header="Class Number" />
                <Column field="parentEmail" header="Parent Email" />
                <Column field="active" header="Active" body={(rowData) => (
                    <span>{rowData.active ? "Yes" : "No"}</span>
                )} />
                <Column body={(rowData) => (
                    <div className="flex align-items-center gap-2">
                        <Button
                            onClick={() => handleViewAttendance(rowData)}
                            icon="pi pi-eye"
                            className="p-button-rounded"
                            style={buttonStyle}
                            tooltip="View Attendance"
                        />
                    </div>
                )} />
            </DataTable>

            <Dialog
                header={`Attendance for ${selectedStudent?.name || ''}`}
                visible={showDialog}
                style={{ width: '50vw' }}
                onHide={() => setShowDialog(false)}
            >
                {renderAttendanceTable()}
            </Dialog>
        </div>
    );
};

export default Attendance;