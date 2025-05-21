import { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import axios from 'axios';

const AttendanceDialog = ({ visible, onHide, selectedDay, lessonIndex, classNumber, schedule }) => {
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState([]);

    const lessonId = schedule[selectedDay]?.lessons?.[lessonIndex]?._id;

    const fetchStudents = async () => {
        try {
            const response = await axios.get(
                `http://localhost:1235/api/student/getAttendanceByLesson/${classNumber}/${selectedDay}/${lessonId}`
            );
            setStudents(response.data);
            setAttendance(response.data.map(student => ({
                idNumber: student.idNumber,
                status: student.status,
            })));
        } catch (error) {
            console.error('Error fetching attendance:', error);
        }
    };

    useEffect(() => {
        if (visible) {
            fetchStudents();
        }
    }, [visible]);

    const handleStatusChange = (idNumber, status) => {
        setAttendance(prev =>
            prev.map(a => (a.idNumber === idNumber ? { ...a, status } : a))
        );
    };

    const handleSaveAttendance = () => {
        if (!lessonId) {
            alert('לא נבחר שיעור או שאין מזהה לשיעור!');
        }
        // לוגים לבדיקה
        console.log({
            classNumber,
            day: selectedDay,
            lessonId,
            attendanceUpdates: attendance,
        });
        console.log('schedule:', schedule);
        console.log('selectedDay:', selectedDay);
        console.log('lessonIndex:', lessonIndex);
        console.log('schedule[selectedDay]:', schedule[selectedDay]);
        console.log('schedule[selectedDay]?.lessons:', schedule[selectedDay]?.lessons);
        console.log('lesson:', schedule[selectedDay]?.lessons?.[lessonIndex]);

        axios.put('http://localhost:1235/api/student/updateAttendanceForLesson', {
            classNumber,
            day: selectedDay,
            lessonId,
            attendanceUpdates: attendance,
        })
            .then(() => {
                console.log('Attendance saved successfully');
                onHide();
            })
            .catch(err => {
                console.error('Error updating attendance:', err);
            });
    };

    return (
        <Dialog
            header="Manage Attendance"
            visible={visible}
            onHide={onHide}
            style={{ width: '50vw' }}
            footer={
                <Button
                    label="Save"
                    icon="pi pi-check"
                    onClick={handleSaveAttendance}
                    style={{
                        backgroundColor: '#007bff',
                        border: 'none',
                        color: 'white',
                        width: '100%',
                    }}
                />
            }
        >
            <table style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student.idNumber}>
                            <td>{student.name}</td>
                            <td>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <Button
                                        label="Present"
                                        className={`p-button ${attendance.find(a => a.idNumber === student.idNumber)?.status === 'Present' ? 'p-button-success' : 'p-button-outlined'}`}
                                        onClick={() => handleStatusChange(student.idNumber, 'Present')}
                                    />
                                    <Button
                                        label="Late"
                                        className={`p-button ${attendance.find(a => a.idNumber === student.idNumber)?.status === 'Late' ? 'p-button-warning' : 'p-button-outlined'}`}
                                        onClick={() => handleStatusChange(student.idNumber, 'Late')}
                                    />
                                    <Button
                                        label="Absent"
                                        className={`p-button ${attendance.find(a => a.idNumber === student.idNumber)?.status === 'Absent' ? 'p-button-danger' : 'p-button-outlined'}`}
                                        onClick={() => handleStatusChange(student.idNumber, 'Absent')}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Dialog>
    );
};

export default AttendanceDialog;