import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';

const LessonDialog = ({
    visible,
    onHide,
    selectedDay,
    lessonIndex,
    schedule,
    setSchedule,
    classNumber,
    refreshSchedule
}) => {
    const [lessons, setLessons] = useState([]);
    const [selectedLesson, setSelectedLesson] = useState(null);

    const purpleColor = '#542468';

    useEffect(() => {
        if (visible) {
            axios.get('http://localhost:1235/api/lesson/getAllLessons', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(res => setLessons(res.data))
                .catch(err => console.error('Error fetching lessons:', err));
        }
    }, [visible]);

    const handleSave = async () => {
        if (!selectedLesson) return;

        try {
            await axios.put('http://localhost:1235/api/schedule/updateLessonInSchedule', {
                classNumber,
                day: selectedDay,
                lessonIndex,
                lessonId: selectedLesson._id
            });
            if (refreshSchedule) refreshSchedule();
        } catch (err) {
            console.error('Error saving lesson:', err);
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
                overflow: 'hidden'
            }}
            contentStyle={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: '2rem',
                position: 'relative',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}
        >
            {/* Close Button */}
            <Button
                icon="pi pi-times"
                onClick={onHide}
                className="p-button-rounded p-button-text"
                style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    color: purpleColor,
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontSize: '1.2rem'
                }}
            />

            <h3 style={{ color: purpleColor, fontWeight: 'bold', marginTop: 0 }}>
                {`Choose Lesson - ${selectedDay}, Lesson ${lessonIndex }`}
            </h3>

            <div className="p-fluid">
                <div className="mb-4">
                    <label className="block font-bold mb-2" style={{ color: purpleColor }}>
                        Select a lesson
                    </label>
                    <Dropdown
                        value={selectedLesson}
                        options={lessons}
                        onChange={e => setSelectedLesson(e.value)}
                        optionLabel="name"
                        placeholder="Select a lesson"
                        style={{ width: '100%' }}
                    />
                </div>

                <div className="flex justify-between mt-4">
                    <Button
                        label="Cancel"
                        onClick={onHide}
                        className="p-button-text"
                        style={{ color: '#6b6b6b', borderColor: '#ccc' }}
                    />
                    <Button
                        label="Save"
                        onClick={handleSave}
                        disabled={!selectedLesson}
                        style={{
                            backgroundColor: purpleColor,
                            borderColor: purpleColor,
                            color: '#FFFFFF'
                        }}
                    />
                </div>
            </div>
        </Dialog>
    );
};

export default LessonDialog;
