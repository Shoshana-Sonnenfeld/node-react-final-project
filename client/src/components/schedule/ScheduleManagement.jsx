
import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

const days = [
    { key: 'sunday', label: 'Sunday' },
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
];

const ScheduleManagement = () => {
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const navigate = useNavigate();

    const handleEdit = (classNumber, day, lessonIndex) => {
        setSelectedClass(classNumber);
        setSelectedDay(day);
        setSelectedLesson(lessonIndex);
        navigate(`/insert-lesson?class=${classNumber}&day=${day}&lesson=${lessonIndex}`);
    };

    const renderSchedule = (classNumber) => {
        return (
            <div style={{ overflowX: 'auto' }}>
                <table
                    style={{
                        borderCollapse: 'collapse',
                        width: '100%',
                        textAlign: 'center',
                        fontFamily: 'Arial, sans-serif',
                        direction: 'ltr',
                        tableLayout: 'fixed', // שומר על גודל אחיד
                    }}
                >
                    <thead>
                        <tr>
                            <th style={thStyle}>Lesson</th>
                            {days.map(day => (
                                <th key={day.key} style={thStyle}>{day.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 8 }, (_, lessonIndex) => (
                            <tr key={lessonIndex}>
                                <td style={tdStyle}>Lesson {lessonIndex + 1}</td>
                                {days.map(day => (
                                    <td key={day.key} style={tdStyle}>
                                        <div style={{ position: 'relative', height: '50px' }}>
                                            <Button
                                                icon="pi pi-pencil"
                                                onClick={() => handleEdit(classNumber, day.key, lessonIndex + 1)}
                                                style={{
                                                    fontSize: '12px',
                                                    padding: '4px',
                                                    position: 'absolute',
                                                    top: '4px',
                                                    right: '4px',
                                                    backgroundColor: '#542468', // סגול שלך
                                                    border: 'none',
                                                    color: 'white',
                                                }}
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

    const thStyle = {
        border: '1px solid #ccc',
        padding: '10px',
        backgroundColor: '#eee',
        color: '#4B296B',
    };

    const tdStyle = {
        border: '1px solid #ccc',
        padding: '10px',
        height: '60px',
        position: 'relative',
        overflow: 'hidden',
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#f9f9f9',
                direction: 'rtl',
                padding: '2rem',
                boxSizing: 'border-box',
            }}
        >
            <Card style={{ width: '90%', maxWidth: '1000px', boxShadow: '0 0 10px #ccc' }}>
                <h2 style={{ textAlign: 'center', color: '#4B296B', marginBottom: '2rem' }}>Weekly Schedule</h2>
                {renderSchedule('1')}
            </Card>
        </div>
    );
};

export default ScheduleManagement;
