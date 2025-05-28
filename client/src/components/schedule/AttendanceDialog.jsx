import { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';
import axios from 'axios';
import { useSelector } from 'react-redux';

const AttendanceDialog = ({ visible, onHide, selectedDay, lessonIndex, classNumber, schedule }) => {
    const token = useSelector(state => state.user.token);

    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const messagesRef = useRef(null); // הודעות שגיאה

    const lessonId = schedule[selectedDay]?.lessons?.[lessonIndex]?._id;

    const fetchStudents = async () => {
        try {
            const response = await axios.get(
                `http://localhost:1235/api/student/getAttendanceByLesson/${classNumber}/${selectedDay}/${lessonId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setStudents(response.data);
            setAttendance(
                response.data.map((student) => ({
                    idNumber: student.idNumber,
                    status: student.status,
                }))
            );
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
        setAttendance((prev) =>
            prev.map((a) => (a.idNumber === idNumber ? { ...a, status } : a))
        );
    };

    const handleSaveAttendance = () => {
        if (!lessonId) {
            messagesRef.current.clear();
            messagesRef.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No lesson selected or lesson ID missing!',
                life: 3000
            });
            return;
        }

        const token = localStorage.getItem('token');

        axios
            .put(
                'http://localhost:1235/api/student/updateAttendanceForLesson',
                {
                    classNumber,
                    day: selectedDay,
                    lessonId,
                    lessonIndex,
                    attendanceUpdates: attendance,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then(() => {
                console.log('Attendance saved successfully');
                onHide();
            })
            .catch((err) => {
                console.error('Error updating attendance:', err);
                messagesRef.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error updating attendance. Please try again later.',
                    life: 3000
                });
            });
    };

    return (
        <Dialog
            header="Manage Attendance"
            visible={visible}
            onHide={onHide}
            style={{ width: '50vw', minWidth: '350px' }}
            breakpoints={{ '960px': '90vw', '640px': '100vw' }}
            footer={
                <Button
                    label="Save"
                    icon="pi pi-check"
                    onClick={handleSaveAttendance}
                    style={{
                        backgroundColor: '#542468',
                        border: 'none',
                        color: 'white',
                        width: '100%',
                        fontWeight: 'bold',
                    }}
                />
            }
        >
            <Messages ref={messagesRef} />

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f4f4f4' }}>
                        <th style={{ textAlign: 'left', padding: '0.75rem' }}>Name</th>
                        <th style={{ textAlign: 'left', padding: '0.75rem' }}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length === 0 && (
                        <tr>
                            <td colSpan={2} style={{ padding: '1rem', textAlign: 'center', fontStyle: 'italic' }}>
                                No students found.
                            </td>
                        </tr>
                    )}
                    {students.map((student) => {
                        const currentStatus = attendance.find((a) => a.idNumber === student.idNumber)?.status;

                        return (
                            <tr key={student.idNumber} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '0.75rem' }}>{student.name}</td>
                                <td style={{ padding: '0.75rem' }}>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <Button
                                            label="Present"
                                            className={`p-button ${currentStatus === 'Present' ? 'p-button-success' : 'p-button-outlined'}`}
                                            onClick={() => handleStatusChange(student.idNumber, 'Present')}
                                            style={{ minWidth: '75px' }}
                                        />
                                        <Button
                                            label="Late"
                                            className={`p-button ${currentStatus === 'Late' ? 'p-button-warning' : 'p-button-outlined'}`}
                                            onClick={() => handleStatusChange(student.idNumber, 'Late')}
                                            style={{ minWidth: '75px' }}
                                        />
                                        <Button
                                            label="Absent"
                                            className={`p-button ${currentStatus === 'Absent' ? 'p-button-danger' : 'p-button-outlined'}`}
                                            onClick={() => handleStatusChange(student.idNumber, 'Absent')}
                                            style={{ minWidth: '75px' }}
                                        />
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </Dialog>
    );
};

export default AttendanceDialog;
