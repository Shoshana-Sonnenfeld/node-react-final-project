import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import Axios from 'axios';

const Attendance = () => {
    const [allStudents, setAllStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const toastRef = useRef(null);

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

        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'];
        const dayLabels = {
            sunday: 'Sunday',
            monday: 'Monday',
            tuesday: 'Tuesday',
            wednesday: 'Wednesday',
            thursday: 'Thursday'
        };

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
        borderRadius: '20px',
    };

    const handleSendWeeklyAttendanceEmails = async () => {
        try {
            const token = localStorage.getItem("token");
            await Axios.post(
                'http://localhost:1235/api/student/sendWeeklyAttendanceEmails',
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toastRef.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Weekly attendance emails sent successfully!',
                life: 3000,
            });
        } catch (error) {
            toastRef.current?.show({
                severity: 'error',
                summary: 'Sending Failed',
                detail: 'An error occurred while sending the emails.',
                life: 3000,
            });
            console.error(error);
        }
    };

    return (
        <div className="card" style={{ backgroundColor: '#F4F4F4' }}>
            <Toast ref={toastRef} position="top-center" />
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                <Button
                    label="Send Weekly Attendance Emails"
                    style={buttonStyle}
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
