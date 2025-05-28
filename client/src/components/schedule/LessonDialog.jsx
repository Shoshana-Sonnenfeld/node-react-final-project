import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';
import { useSelector } from 'react-redux'; // לקריאת מידע מה־Redux store


const LessonDialog = ({
    visible,
    onHide,
    selectedDay,
    lessonIndex,
    classNumber,
    refreshSchedule,
}) => {
    const token = useSelector(state => state.user.token)  // קריאת שם המשתמש מה־Redux, או ברירת מחדל
    const [lessons, setLessons] = useState([]);
    const [selectedLesson, setSelectedLesson] = useState(null);

    const purpleColor = '#542468';

    // Fetch all lessons when dialog opens
    useEffect(() => {
        if (visible) {
            
            axios
                .get('http://localhost:1235/api/lesson/getAllLessons', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => setLessons(res.data))
                .catch((err) => console.error('Error fetching lessons:', err));
        }
    }, [visible]);

    // Save selected lesson to the schedule
    const handleSave = async () => {
        if (!selectedLesson) return;

        try {
            const token = localStorage.getItem('token');
            await axios.put(
                'http://localhost:1235/api/schedule/updateLessonInSchedule',
                {
                    classNumber,
                    day: selectedDay,
                    lessonIndex,
                    lessonId: selectedLesson._id,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (refreshSchedule) refreshSchedule();
        } catch (err) {
            console.error('Error saving lesson:', err);
            alert('Failed to save lesson. Please try again.');
        }
        onHide();
    };

    return (
        <Dialog
            visible={visible}
            onHide={onHide}
            modal
            closable={false}
            style={{
                width: '100%',
                maxWidth: '500px',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 6px 15px rgba(0,0,0,0.15)',
            }}
            contentStyle={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                padding: '2rem',
                position: 'relative',
            }}
        >
            {/* Close Button */}
            <Button
                icon="pi pi-times"
                onClick={onHide}
                className="p-button-rounded p-button-text"
                aria-label="Close dialog"
                style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    color: purpleColor,
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontSize: '1.3rem',
                    cursor: 'pointer',
                }}
            />

            <h3
                style={{
                    color: purpleColor,
                    fontWeight: '700',
                    marginTop: 0,
                    marginBottom: '1.5rem',
                    fontSize: '1.4rem',
                }}
            >
                {`Choose Lesson - ${selectedDay}, Lesson ${lessonIndex}`}
            </h3>

            <div className="p-fluid">
                <div className="mb-4">
                    <label
                        htmlFor="lesson-dropdown"
                        className="block font-bold mb-2"
                        style={{ color: purpleColor, fontSize: '1rem' }}
                    >
                        Select a lesson
                    </label>
                    <Dropdown
                        inputId="lesson-dropdown"
                        value={selectedLesson}
                        options={lessons}
                        onChange={(e) => setSelectedLesson(e.value)}
                        optionLabel="name"
                        placeholder="Select a lesson"
                        style={{ width: '100%' }}
                        filter
                        filterPlaceholder="Search lessons"
                        showClear
                    />
                </div>

                <div
                    className="flex justify-between"
                    style={{ marginTop: '2rem', gap: '1rem' }}
                >
                    <Button
                        label="Cancel"
                        onClick={onHide}
                        className="p-button-text"
                        style={{
                            color: '#6b6b6b',
                            borderColor: '#ccc',
                            flex: 1,
                            minWidth: '100px',
                        }}
                    />
                    <Button
                        label="Save"
                        onClick={handleSave}
                        disabled={!selectedLesson}
                        style={{
                            backgroundColor: purpleColor,
                            borderColor: purpleColor,
                            color: '#fff',
                            flex: 1,
                            minWidth: '100px',
                        }}
                    />
                </div>
            </div>
        </Dialog>
    );
};

export default LessonDialog;
