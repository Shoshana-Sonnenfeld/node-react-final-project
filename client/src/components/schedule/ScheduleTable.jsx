import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import axios from 'axios';
import AttendanceDialog from './AttendanceDialog';
import LessonDialog from './LessonDialog';

const ScheduleTable = ({ classNumber }) => {
    const [schedule, setSchedule] = useState({});
    const [showDialog, setShowDialog] = useState(false);
    const [showAttendanceDialog, setShowAttendanceDialog] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [lessonIndex, setLessonIndex] = useState(null);

    const fetchSchedule = async () => {
        try {
            const response = await axios.get(`http://localhost:1235/api/schedule/getScheduleByClassNumber/${classNumber}`);
            setSchedule(response.data);
        } catch (error) {
            console.error('Error fetching schedule:', error);
        }
    };

    useEffect(() => {
        fetchSchedule();
    }, [classNumber]);

    const handleEdit = (day, lessonIndex) => {
        setSelectedDay(day);
        setLessonIndex(lessonIndex);
        setShowDialog(true);
    };

    const handleAttendance = (day, lessonIndex) => {
        setSelectedDay(day);
        setLessonIndex(lessonIndex);
        setShowAttendanceDialog(true);
    };

    const renderSchedule = () => {
        const days = [
            { key: 'sunday', label: 'Sunday' },
            { key: 'monday', label: 'Monday' },
            { key: 'tuesday', label: 'Tuesday' },
            { key: 'wednesday', label: 'Wednesday' },
            { key: 'thursday', label: 'Thursday' },
        ];

        return (
            <div style={{ overflowX: 'auto' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'center' }}>
                    <thead>
                        <tr>
                            <th>Lesson</th>
                            {days.map(day => (
                                <th key={day.key}>{day.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 8 }, (_, lessonIndex) => (
                            <tr key={lessonIndex}>
                                <td>Lesson {lessonIndex + 1}</td>
                                {days.map(day => (
                                    <td key={day.key}>
                                        <div>
                                            <span>{schedule[day.key]?.lessons?.[lessonIndex]?.name || 'No Lesson'}</span>
                                            <Button
                                                icon="pi pi-pencil"
                                                className="p-button-text"
                                                onClick={() => handleEdit(day.key, lessonIndex)}
                                            />
                                            <Button
                                                label="Attendance"
                                                className="p-button-text"
                                                onClick={() => handleAttendance(day.key, lessonIndex)}
                                            />
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div>
            <h2>Weekly Schedule</h2>
            {renderSchedule()}
            <LessonDialog
                visible={showDialog}
                onHide={() => setShowDialog(false)} // ודאי שהפונקציה מועברת כאן
                selectedDay={selectedDay}
                lessonIndex={lessonIndex}
                schedule={schedule}
                setSchedule={setSchedule}
                classNumber={classNumber}
            />
            <AttendanceDialog
                visible={showAttendanceDialog}
                onHide={() => setShowAttendanceDialog(false)} // סגירת הדיאלוג
                selectedDay={selectedDay}
                lessonIndex={lessonIndex}
                classNumber={classNumber}
            />
        </div>
    );
};

export default ScheduleTable;