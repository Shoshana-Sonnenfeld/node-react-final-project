import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';

const LessonDialog = ({ visible, onHide, selectedDay, lessonIndex, schedule, setSchedule, classNumber }) => {
    const [lessons, setLessons] = useState([]);
    const [selectedLesson, setSelectedLesson] = useState(null);

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

    const handleSave = () => {
        if (!selectedLesson) return;
        const updatedSchedule = { ...schedule };

        if (!updatedSchedule[selectedDay]) {
            updatedSchedule[selectedDay] = { lessons: [] };
        }
        updatedSchedule[selectedDay].lessons[lessonIndex] = selectedLesson;

        setSchedule(updatedSchedule);
        onHide();
    };

    return (
        <Dialog
            header={`בחר שיעור - ${selectedDay}, שיעור ${lessonIndex + 1}`}
            visible={visible}
            onHide={onHide}
            style={{ width: '30vw' }}
            footer={
                <div>
                    <Button label="ביטול" icon="pi pi-times" onClick={onHide} className="p-button-text" />
                    <Button label="שמור" icon="pi pi-check" onClick={handleSave} autoFocus disabled={!selectedLesson} />
                </div>
            }
        >
            <div className="p-field">
                <label htmlFor="lessonDropdown">בחר שיעור</label>
                <Dropdown
                    id="lessonDropdown"
                    value={selectedLesson}
                    options={lessons}
                    onChange={e => setSelectedLesson(e.value)}
                    optionLabel="name"
                    placeholder="בחר שיעור"
                    style={{ width: '100%' }}
                />
            </div>
        </Dialog>
    );
};

export default LessonDialog;